import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { serviceService, Service, ServiceCategory } from "@/services/serviceService";
import { slugify } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

type ServiceFormValues = {
    title: string;
    slug: string;
    description?: string;
    content?: string;
    icon?: string;
    image_url?: string;
    category_id?: string;
    is_active: boolean;
};

interface ServiceFormProps {
    initialData?: Service | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ServiceForm({ initialData, onSuccess, onCancel }: ServiceFormProps) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await serviceService.getCategories();
            if (result.success) {
                setCategories(result.data || []);
            }
        };
        fetchCategories();
    }, []);

    const serviceSchema = useMemo(() => z.object({
        title: z.string().min(2, t('error_min_length', { count: 2 })),
        slug: z.string().min(2, t('error_min_length', { count: 2 })),
        description: z.string().optional(),
        content: z.string().optional(),
        icon: z.string().optional(),
        image_url: z.string().optional(),
        category_id: z.string().optional(),
        is_active: z.boolean(),
    }), [t]);

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            content: "",
            icon: "",
            image_url: "",
            category_id: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                slug: initialData.slug,
                description: initialData.description || "",
                content: initialData.content || "",
                icon: initialData.icon || "",
                image_url: initialData.image_url || "",
                category_id: initialData.category_id || "",
                is_active: initialData.is_active ?? true,
            });
        }
    }, [initialData, form]);


    // Auto-generate slug from title if slug is empty
    const title = form.watch("title");
    useEffect(() => {
        if (!initialData && title && !form.getValues("slug")) {
            const slug = slugify(title);
            form.setValue("slug", slug);
        }
    }, [title, initialData, form]);

    const onSubmit = async (data: ServiceFormValues) => {
        setIsLoading(true);
        // Prepare data for submission: transform empty strings to null for certain fields
        const submissionData = {
            ...data,
            category_id: data.category_id === "" ? null : data.category_id,
        };

        try {
            if (initialData) {
                const result = await serviceService.updateService(initialData.id, submissionData as any);
                if (result.success) {
                    toast({ title: t('success'), description: t('service_update_success') });
                    onSuccess();
                } else {
                    toast({ variant: "destructive", title: t('error'), description: result.error || t('error_occurred') });
                }
            } else {
                const result = await serviceService.createService(submissionData as any);
                if (result.success) {
                    toast({ title: t('success'), description: t('service_create_success') });
                    onSuccess();
                } else {
                    toast({ variant: "destructive", title: t('error'), description: result.error || t('error_occurred') });
                }
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: t('error'), description: error.message || t('error_occurred') });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('service_title')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('service_title_placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('slug')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('slug_placeholder')} {...field} />
                                </FormControl>
                                <FormDescription>{t('slug_desc')}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('category') || 'Danh mục'}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('select_category') || "Chọn danh mục"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('short_description')}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t('short_desc_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('content_html')}</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[200px] font-mono text-sm" placeholder={t('content_placeholder')} {...field} />
                            </FormControl>
                            <FormDescription>{t('html_support')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('icon_lucide')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Wrench, Cog, ..." {...field} />
                                </FormControl>
                                <FormDescription>{t('icon_desc')}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="image_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('image_url')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">{t('is_visible')}</FormLabel>
                                <FormDescription>
                                    {t('is_visible_desc')}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        {t('cancel')}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? t('save') : t('create_new')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
