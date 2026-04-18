
import { v4 as uuidv4 } from 'uuid';

export interface MediaItem {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
    url: string;
    path: string;
}

/**
 * Media Service - giao tiếp qua API Route (/api/media)
 * 
 * Service Role Key được xử lý server-side (Vercel API Route hoặc Vite dev middleware).
 * Frontend KHÔNG CẦN và KHÔNG CÓ quyền truy cập Service Role Key.
 */
export const mediaService = {
    async uploadImage(file: File, folder: string = 'uploads'): Promise<{ url: string; path: string } | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            // Step 1: Get signed upload URL from server
            const response = await fetch('/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getUploadUrl', path: filePath }),
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const { signedUrl } = result.data;

            // Step 2: Upload file directly to Supabase using signed URL
            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            }

            // Step 3: Get the public URL for the uploaded file
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/media/${filePath}`;

            return { url: publicUrl, path: filePath };
        } catch (error) {
            console.error('Error in uploadImage:', error);
            throw error;
        }
    },

    async getImages(folder: string = 'uploads'): Promise<MediaItem[]> {
        try {
            const response = await fetch(`/api/media?action=list&folder=${encodeURIComponent(folder)}`);
            const result = await response.json();

            if (result.error) {
                console.error('Error listing images:', result.error);
                throw new Error(result.error);
            }

            return result.data as MediaItem[];
        } catch (error) {
            console.error('Error in getImages:', error);
            throw error;
        }
    },

    async deleteImage(path: string): Promise<boolean> {
        try {
            const response = await fetch('/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', path }),
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            return true;
        } catch (error) {
            console.error('Error in deleteImage:', error);
            throw error;
        }
    },

    async cleanupGhostFiles(folder: string = 'uploads'): Promise<{ deleted: number; kept: number }> {
        try {
            const response = await fetch('/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'cleanup', folder }),
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            return result.data;
        } catch (error) {
            console.error('Error in cleanupGhostFiles:', error);
            throw error;
        }
    },
};
