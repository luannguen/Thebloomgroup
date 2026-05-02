import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Image as ImageIcon, Settings2, Layout, Sliders, Type } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceService, Service, ServiceCategory } from "@/services/serviceService";
import { slugify } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { RichTextEditorWidget } from "../visual-editor/RichTextEditorWidget";
import { ImagePickerModal } from "../visual-editor/ImagePickerModal";

// Định nghĩa Schema rõ ràng và nhất quán
// Định nghĩa Schema nới lỏng hơn để tránh lỗi validation ẩn
const serviceSchema = z.object({
    title: z.string().min(2, "Tiêu đề quá ngắn"),
    slug: z.string().min(2, "Slug quá ngắn"),
    description: z.string().optional().or(z.literal("")),
    content: z.string().optional().or(z.literal("")),
    icon: z.string().optional().or(z.literal("")),
    image_url: z.string().optional().or(z.literal("")),
    image_width: z.coerce.number().int().default(100),
    icon_size: z.coerce.number().int().default(48),
    image_position: z.string().optional().default("center"),
    category_id: z.string().optional().nullable().or(z.literal("")),
    is_active: z.boolean().default(true),
});

interface ServiceFormProps {
    initialData?: Service | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ServiceForm({ initialData, onSuccess, onCancel }: ServiceFormProps) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
            content: initialData?.content || "",
            icon: initialData?.icon || "",
            image_url: initialData?.image_url || "",
            image_width: Number(initialData?.image_width || 100),
            icon_size: Number(initialData?.icon_size || 48),
            image_position: initialData?.image_position || "center",
            category_id: initialData?.category_id ? String(initialData.category_id) : "",
            is_active: initialData?.is_active ?? true,
        },
    });

    // Cập nhật giá trị khi initialData thay đổi
    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title || "",
                slug: initialData.slug || "",
                description: initialData.description || "",
                content: initialData.content || "",
                icon: initialData.icon || "",
                image_url: initialData.image_url || "",
                image_width: Number(initialData.image_width || 100),
                icon_size: Number(initialData.icon_size || 48),
                image_position: initialData.image_position || "center",
                category_id: initialData.category_id ? String(initialData.category_id) : "",
                is_active: initialData.is_active ?? true,
            });
        }
    }, [initialData, form]);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await serviceService.getCategories();
            if (result.success) {
                setCategories(result.data || []);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data: z.infer<typeof serviceSchema>) => {
        console.log("🚀 Submit Start - Raw Data:", data);
        setLoading(true);
        try {
            // Chỉ gửi những trường mà Database chắc chắn có
            // Tạm thời bỏ: image_width, icon_size, image_position vì DB chưa có cột này
            const payload: any = {
                title: data.title,
                slug: data.slug,
                description: data.description || null,
                content: data.content || null,
                icon: data.icon || "FileCheck",
                image_url: data.image_url || null,
                is_active: !!data.is_active,
            };
            
            // Xử lý category_id
            if (!data.category_id || data.category_id === "" || data.category_id === "no_category" || data.category_id === "undefined") {
                payload.category_id = null;
            } else {
                payload.category_id = data.category_id;
            }

            console.log("📤 Sending SAFE Payload to Supabase:", payload);

            const result = initialData
                ? await serviceService.updateService(initialData.id, payload)
                : await serviceService.createService(payload);

            if (result.success) {
                console.log("✅ Save Success:", result.data);
                toast({
                    title: initialData ? "Đã cập nhật dịch vụ" : "Đã tạo dịch vụ mới",
                    description: "Dữ liệu đã được lưu thành công vào hệ thống.",
                    variant: "default",
                });
                onSuccess();
            } else {
                console.error("❌ API Error:", result.error);
                toast({
                    title: "Lỗi lưu dữ liệu",
                    description: String(result.error),
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("💥 Crash Error:", error);
            toast({
                title: "Lỗi hệ thống",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const onValidationError = (errors: any) => {
        console.error("❌ Validation Errors:", errors);
        const errorFields = Object.keys(errors);
        toast({
            title: "Dữ liệu chưa hợp lệ",
            description: `Vui lòng kiểm tra các trường: ${errorFields.join(", ")}`,
            variant: "destructive",
        });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue("title", title);
        if (!initialData) {
            form.setValue("slug", slugify(title));
        }
    };

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit, onValidationError)} 
                className="space-y-6 w-full overflow-x-hidden p-1"
            >
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 p-1 rounded-xl sticky top-0 z-10 shadow-sm">
                        <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                            <Type className="h-4 w-4 mr-2" />
                            {t('services.general_info', 'Thông tin chung')}
                        </TabsTrigger>
                        <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                            <Layout className="h-4 w-4 mr-2" />
                            {t('services.content_detail', 'Nội dung chi tiết')}
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                            <Settings2 className="h-4 w-4 mr-2" />
                            {t('services.appearance_display', 'Hình ảnh & Hiển thị')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6 animate-in fade-in duration-300 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Tiêu đề dịch vụ</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="VD: Cung cấp & Lắp đặt hệ thống lạnh" 
                                                {...field} 
                                                onChange={handleTitleChange}
                                                className="h-11 rounded-xl border-slate-200 focus:ring-primary shadow-sm w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Đường dẫn (Slug)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="cung-cap-lap-dat-he-thong-lanh" 
                                                {...field} 
                                                className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:ring-primary shadow-sm font-mono text-xs w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Danh mục dịch vụ</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 shadow-sm w-full">
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="no_category">--- Không có danh mục ---</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Mô tả ngắn</FormLabel>
                                    <FormControl>
                                        <div className="w-full">
                                            <RichTextEditorWidget 
                                                value={field.value || ""} 
                                                onChange={field.onChange}
                                                label="Mô tả tóm tắt"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 animate-in fade-in duration-300">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Nội dung chi tiết</FormLabel>
                                    <FormControl>
                                        <RichTextEditorWidget 
                                            value={field.value || ""} 
                                            onChange={field.onChange}
                                            label="Nội dung chính"
                                            placeholder="Bắt đầu viết nội dung dịch vụ của bạn tại đây..."
                                        />
                                    </FormControl>
                                    <FormDescription className="text-[10px]">
                                        Sử dụng các công cụ định dạng để làm nội dung hấp dẫn hơn. Bạn có thể mở rộng cửa sổ để soạn thảo dễ dàng.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="image_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Hình ảnh đại diện</FormLabel>
                                            <div className="space-y-4">
                                                {field.value ? (
                                                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-lg">
                                                        <img 
                                                            src={field.value} 
                                                            alt="Preview" 
                                                            className="w-full h-full transition-all duration-500 group-hover:scale-105"
                                                            style={{ 
                                                                objectFit: 'cover',
                                                                objectPosition: form.watch('image_position') || 'center'
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                                                            <Button 
                                                                type="button"
                                                                variant="secondary" 
                                                                size="sm" 
                                                                className="rounded-xl font-bold uppercase text-[10px]"
                                                                onClick={() => setIsImagePickerOpen(true)}
                                                            >
                                                                Thay đổi ảnh
                                                            </Button>
                                                            <Button 
                                                                type="button"
                                                                variant="destructive" 
                                                                size="sm" 
                                                                className="rounded-xl font-bold uppercase text-[10px]"
                                                                onClick={() => field.onChange("")}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-400 group"
                                                        onClick={() => setIsImagePickerOpen(true)}
                                                    >
                                                        <div className="p-4 bg-slate-100 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                            <ImageIcon className="h-8 w-8" />
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-widest">Chọn ảnh từ thư viện</span>
                                                    </div>
                                                )}
                                                <FormControl>
                                                    <Input 
                                                        {...field} 
                                                        placeholder="Hoặc dán URL ảnh trực tiếp..." 
                                                        className="h-10 rounded-xl border-slate-100 bg-slate-50 text-[11px] font-mono"
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sliders className="h-4 w-4 text-primary" />
                                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tùy chỉnh hiển thị</h4>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="image_width"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <div className="flex justify-between">
                                                <FormLabel className="text-xs font-medium text-slate-600">Độ rộng ảnh (%)</FormLabel>
                                                <span className="text-xs font-bold text-primary">{Number(field.value)}%</span>
                                            </div>
                                            <FormControl>
                                                <Slider 
                                                    min={10} 
                                                    max={100} 
                                                    step={1} 
                                                    value={[Number(field.value) || 100]} 
                                                    onValueChange={(vals) => field.onChange(vals[0])}
                                                    className="py-4"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="icon_size"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <div className="flex justify-between">
                                                <FormLabel className="text-xs font-medium text-slate-600">Kích thước Icon (px)</FormLabel>
                                                <span className="text-xs font-bold text-primary">{Number(field.value)}px</span>
                                            </div>
                                            <FormControl>
                                                <Slider 
                                                    min={16} 
                                                    max={120} 
                                                    step={2} 
                                                    value={[Number(field.value) || 48]} 
                                                    onValueChange={(vals) => field.onChange(vals[0])}
                                                    className="py-4"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image_position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-slate-600">Vị trí tiêu điểm ảnh</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="center">Chính giữa (Mặc định)</SelectItem>
                                                    <SelectItem value="top">Phía trên</SelectItem>
                                                    <SelectItem value="bottom">Phía dưới</SelectItem>
                                                    <SelectItem value="left">Bên trái</SelectItem>
                                                    <SelectItem value="right">Bên phải</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-[10px]">Xác định phần ảnh sẽ được ưu tiên hiển thị khi khung bị cắt.</FormDescription>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-xs font-bold">Trạng thái hoạt động</FormLabel>
                                                <FormDescription className="text-[10px]">Cho phép hiển thị dịch vụ này ngoài trang chủ.</FormDescription>
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
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={onCancel}
                        className="rounded-xl px-6 h-11 font-medium hover:bg-slate-100"
                    >
                        Hủy
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="rounded-xl px-10 h-11 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Lưu thay đổi" : "Tạo mới"}
                    </Button>
                </div>
            </form>

            <ImagePickerModal 
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onSelect={(url) => form.setValue("image_url", url)}
            />
        </Form>
    );
}
