import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Loader2, Send } from "lucide-react";
import { serviceService, CreateInquiryDTO } from "@/services/serviceService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAntiSpam } from "@/hooks/useAntiSpam";

const inquirySchema = z.object({
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  company: z.string().optional(),
  message: z.string().min(10, "Nội dung lời nhắn phải có ít nhất 10 ký tự"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface ServiceInquiryFormProps {
  serviceId?: string;
  onSuccess?: () => void;
}

export default function ServiceInquiryForm({ serviceId, onSuccess }: ServiceInquiryFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { HoneypotField, isBot } = useAntiSpam();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: InquiryFormValues) {
    if (isBot()) {
      // Fake success for bots
      toast({
        title: "Gửi yêu cầu thành công",
        description: "Chúng tôi sẽ sớm liên hệ lại với bạn.",
      });
      form.reset();
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await serviceService.submitInquiry({
        ...values,
        service_id: serviceId,
      });

      if (result.success) {
        toast({
          title: "Gửi yêu cầu thành công",
          description: "Chúng tôi sẽ sớm liên hệ lại với bạn.",
        });
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Gửi yêu cầu thất bại",
          description: (result as any).error?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống",
        description: "Vui lòng kiểm tra lại kết nối mạng.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <HoneypotField />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Họ tên *</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} className="h-9 text-sm" />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Email *</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} className="h-9 text-sm" />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Điện thoại *</FormLabel>
                <FormControl>
                  <Input placeholder="09xxx..." {...field} className="h-9 text-sm" />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Lời nhắn *</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="Tôi cần tư vấn về dịch vụ này..." 
                    {...field} 
                    className="min-h-[80px] text-sm resize-none" 
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Gửi yêu cầu ngay</>
          )}
        </Button>
      </form>
    </Form>
  );
}
