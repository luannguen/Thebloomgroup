import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { serviceService, ServiceCategory } from "@/services/serviceService";
import { useToast } from "@/components/ui/use-toast";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  display_order: z.number(),
  is_active: z.boolean(),
});

type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

interface ServiceCategoryFormProps {
  initialData?: ServiceCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ServiceCategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: ServiceCategoryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      display_order: initialData?.display_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  const watchedName = form.watch("name");

  useEffect(() => {
    if (!initialData && watchedName) {
      form.setValue("slug", slugify(watchedName), { shouldValidate: true });
    }
  }, [watchedName, initialData, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    setSubmitting(true);
    try {
      if (initialData) {
        const result = await serviceService.updateCategory(initialData.id, data);
        if (result.success) {
          toast({ title: "Thành công", description: "Đã cập nhật danh mục" });
          onSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: result.error || "Không thể cập nhật danh mục",
          });
        }
      } else {
        const result = await serviceService.createCategory(data);
        if (result.success) {
          toast({ title: "Thành công", description: "Đã tạo danh mục mới" });
          onSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: result.error || "Không thể tạo danh mục",
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi hệ thống",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField<CategoryFormValues, "name">
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ví dụ: Tư vấn thiết kế" 
                  name={field.name}
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<CategoryFormValues, "slug">
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input 
                  placeholder="tu-van-thiet-ke" 
                  name={field.name}
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<CategoryFormValues, "description">
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Mô tả ngắn gọn về danh mục" 
                  name={field.name}
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField<CategoryFormValues, "display_order">
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự hiển thị</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    name={field.name}
                    value={field.value as number}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<CategoryFormValues, "is_active">
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-8">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Hoạt động</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
