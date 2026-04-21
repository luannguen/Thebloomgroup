import { supabase } from '@/supabase';
import { Result, success, failure, ErrorCodes } from '@/components/data/types';

export interface ContactDTO {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export const contactService = {
    async createContact(contact: ContactDTO & { b_address?: string }): Promise<Result<any>> {
        try {
            // Anti-spam honeypot check (Backend tier)
            if (contact.b_address && contact.b_address.length > 0) {
                console.warn('Anti-spam: Backend honeypot triggered');
                // Use Blackhole strategy: Return success but don't save to DB
                return success({ message: "Contact submitted successfully" });
            }

            // Remove honeypot field before sending to Supabase
            const { b_address, ...cleanContact } = contact;

            const { data, error } = await supabase
                .from('contacts')
                .insert([{
                    ...cleanContact,
                    status: 'new'
                }]);

            // Note: We do NOT use .select() here because anonymous users 
            // do not have SELECT permissions on the contacts table for security.
            // We just need to know if the insert was successful (no error).

            if (error) {
                console.error('Supabase error:', error);
                return failure(error.message, ErrorCodes.DB_ERROR, error);
            }
            return success({ message: "Contact submitted successfully" });
        } catch (err: any) {
            console.error('Unexpected error:', err);
            return failure(err.message || 'Unknown error', ErrorCodes.UNKNOWN_ERROR, err);
        }
    }
};
