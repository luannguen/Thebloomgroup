
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { contactService, ContactDTO } from "@/services/contactService";
import { useToast } from "@/components/ui/use-toast"; // Assuming toast exists or using local state/console

export function useContactForm() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const urlSubject = searchParams.get("subject");
    const productId = searchParams.get("product");

    // Check if the URL subject matches one of our predefined options
    const validSubjects = ["general", "support", "quote", "partnership", "other"];
    const isPredefinedSubject = urlSubject && validSubjects.includes(urlSubject);

    // Determine default subject
    let defaultSubject = "general";
    if (isPredefinedSubject) defaultSubject = urlSubject;
    else if (productId) defaultSubject = "quote";
    else if (urlSubject) defaultSubject = "quote";

    // Determine default message
    let defaultMessage = "";
    if (productId) {
        defaultMessage = `${t('contact_product_interest', 'Tôi quan tâm đến sản phẩm có ID')}: ${productId}.\n${t('contact_please_advise', 'Vui lòng tư vấn thêm cho tôi.')}`;
    } else if (!isPredefinedSubject && urlSubject) {
        defaultMessage = urlSubject + "\n\n";
    }

    const [formData, setFormData] = useState<ContactDTO>({
        name: "",
        email: "",
        phone: "",
        subject: defaultSubject,
        message: defaultMessage,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    // Clear error for a field when it's modified (optional UX improvement)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, subject: value }));
        if (errors.subject) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.subject;
                return newErrors;
            });
        }
    };


    // Validation Schema
    const contactSchema = z.object({
        name: z.string().min(2, t('val_name_min', "Họ tên phải có ít nhất 2 ký tự")),
        email: z.string().email(t('val_email_invalid', "Email không hợp lệ")),
        phone: z.string().regex(/^[0-9+\-\s()]*$/, t('val_phone_invalid', "Số điện thoại không hợp lệ")).optional().or(z.literal("")),
        subject: z.string(),
        message: z.string().min(10, t('val_message_min', "Nội dung phải có ít nhất 10 ký tự")),
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});


        // 3. Validation
        const validationResult = contactSchema.safeParse(formData);
        if (!validationResult.success) {
            const formattedErrors: Record<string, string> = {};
            const errorList = validationResult.error.issues;

            errorList.forEach((err) => {
                const field = err.path[0];
                if (field) {
                    formattedErrors[field.toString()] = err.message;
                }
            });

            setErrors(formattedErrors);

            // Still show a toast for general feedback
            toast({
                title: t('info_incorrect', "Thông tin chưa chính xác"),
                description: t('check_red_fields', "Vui lòng kiểm tra lại các trường báo đỏ."),
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const result = await contactService.createContact(formData);

            if (result.success) {
                setSubmitStatus("success");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "general",
                    message: "",
                });
                toast({
                    title: t('success', "Thành công"),
                    description: t('sent_success_desc', "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!"),
                    variant: "default",
                });
            } else {
                setSubmitStatus("error");
                // Explicitly cast to failure type or any since we know it failed
                const failure = result as any;
                const errorMessage = failure.error?.message || t('sent_fail_desc', "Gửi liên hệ thất bại (mã lỗi không xác định)");

                toast({
                    title: t('error', "Lỗi"),
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus("error");
            toast({
                title: t('error', "Lỗi"),
                description: t('error_sending_form', "Đã xảy ra lỗi khi gửi form. Vui lòng thử lại sau."),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        handleChange,
        handleSelectChange,
        submit,
        isSubmitting,
        submitStatus,
    };
}
