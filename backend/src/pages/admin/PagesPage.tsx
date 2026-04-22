
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pageService, StaticPage, PageFormData } from "@/services/pageService";
import { mediaService } from "@/services/mediaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Plus, Pencil, Trash2, FileText, Image as ImageIcon, Eye, Wand2, Layout, Code } from "lucide-react";

export default function PagesPage() {
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<StaticPage | null>(null);
    const [formData, setFormData] = useState<PageFormData>({
        slug: "",
        title: "",
        content: "",
        excerpt: "",
        image_url: "",
        is_active: true,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showRawJson, setShowRawJson] = useState(false);
    const { toast } = useToast();

    const isJsonContent = (content: string | null) => {
        if (!content) return false;
        try {
            return content.trim().startsWith('{"sections":');
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const data = await pageService.getPages();
            
            // Đảm bảo Trang chủ luôn có mặt trong danh sách để quản lý Visual Edit
            const hasHome = data.some(p => p.slug === 'home');
            if (!hasHome) {
                const homePage: StaticPage = {
                    id: 'home-virtual', // Virtual ID, sẽ được tạo thật khi lưu trong Visual Editor
                    slug: 'home',
                    title: 'Trang chủ (Mặc định)',
                    content: '{"sections":[]}',
                    excerpt: 'Trang chủ chính của website',
                    image_url: null,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                setPages([homePage, ...data]);
            } else {
                // Sắp xếp để Trang chủ luôn ở đầu danh sách
                const sortedData = [...data].sort((a, b) => {
                    if (a.slug === 'home') return -1;
                    if (b.slug === 'home') return 1;
                    return 0;
                });
                setPages(sortedData);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load pages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (page?: StaticPage) => {
        if (page) {
            setCurrentPage(page);
            setFormData({
                slug: page.slug,
                title: page.title,
                content: page.content,
                excerpt: page.excerpt,
                image_url: page.image_url,
                is_active: page.is_active,
            });
        } else {
            setCurrentPage(null);
            setFormData({
                slug: "",
                title: "",
                content: "",
                excerpt: "",
                image_url: "",
                is_active: true,
            });
        }
        setSelectedFile(null);
        setShowRawJson(false); // Reset show JSON mode
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = formData.image_url;

            if (selectedFile) {
                const uploadResult = await mediaService.uploadImage(selectedFile, 'pages');
                if (uploadResult) {
                    imageUrl = uploadResult.url;
                }
            }

            if (!formData.title || !formData.slug) {
                toast({
                    title: "Validation Error",
                    description: "Title and Slug are required",
                    variant: "destructive",
                });
                return;
            }

            const pageData = { ...formData, image_url: imageUrl };

            if (currentPage) {
                await pageService.updatePage(currentPage.id, pageData);
                toast({ title: "Success", description: "Page updated successfully" });
            } else {
                await pageService.createPage(pageData);
                toast({ title: "Success", description: "Page created successfully" });
            }

            setIsDialogOpen(false);
            fetchPages();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save page",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        try {
            await pageService.deletePage(id);
            toast({ title: "Success", description: "Page deleted successfully" });
            fetchPages();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete page",
                variant: "destructive",
            });
        }
    };

    const handleToggleActive = async (page: StaticPage) => {
        try {
            await pageService.updatePage(page.id, { is_active: !page.is_active });
            fetchPages();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Static Pages</h1>
                <div className="flex gap-3">
                    <Button 
                        variant="outline"
                        asChild
                        className="rounded-full shadow-sm hover:bg-slate-50 border-slate-200"
                    >
                        <Link to="/pages/visual-edit/new-page">
                            <Eye className="mr-2 h-4 w-4 text-blue-500" />
                            Tạo bằng Visual Editor
                        </Link>
                    </Button>
                    <Button onClick={() => handleOpenDialog()} className="rounded-full bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200">
                        <Plus className="mr-2 h-4 w-4" /> Add Page
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No pages found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell>
                                        {page.image_url ? (
                                            <img
                                                src={page.image_url}
                                                alt={page.title}
                                                className="h-10 w-16 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {page.title}
                                            {page.slug === 'home' && (
                                                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                                                    Hệ thống
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell><code className="bg-muted px-1 py-0.5 rounded text-xs">{page.slug}</code></TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(page.updated_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={page.is_active}
                                            onCheckedChange={() => handleToggleActive(page)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            title="Chỉnh sửa trực quan"
                                        >
                                            <Link to={`/pages/visual-edit/${page.slug}`}>
                                                <Wand2 className="h-4 w-4 text-blue-500" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(page)}
                                            title="Sửa thông tin cơ bản"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        {page.slug !== 'home' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(page.id)}
                                                title="Xóa trang"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentPage ? "Edit Page" : "Create Page"}</DialogTitle>
                        <DialogDescription>
                            {currentPage
                                ? "Update the content of the static page."
                                : "Create a new static page for the website."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL Path)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    placeholder="e.g. about-us"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Featured Image</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                            {formData.image_url && !selectedFile && (
                                <p className="text-xs text-muted-foreground break-all">Current: {formData.image_url}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                                placeholder="Brief summary for list views or SEO..."
                                className="h-20"
                            />
                        </div>

                        <div className="flex items-center space-x-2 py-2">
                            <Switch
                                id="is_active_modal"
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                            <Label htmlFor="is_active_modal">Hiển thị trang (Active)</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            {isJsonContent(formData.content) && !showRawJson ? (
                                <div className="space-y-4">
                                    <Alert className="bg-blue-50 border-blue-200">
                                        <Layout className="h-4 w-4 text-blue-600" />
                                        <AlertTitle className="text-blue-700 font-bold">Visual Editor Detected</AlertTitle>
                                        <AlertDescription className="text-blue-600 text-sm">
                                            Trang này được xây dựng bằng thiết kế trực quan. Nội dung được lưu trữ dưới dạng cấu trúc Sections. 
                                            Để chỉnh sửa nội dung và bố cục, vui lòng sử dụng trình chỉnh sửa trực quan chuyên biệt.
                                        </AlertDescription>
                                    </Alert>
                                    
                                    <div className="flex flex-wrap gap-3 py-2">
                                        <Button 
                                            asChild 
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2"
                                        >
                                            <Link to={`/pages/visual-edit/${formData.slug}`}>
                                                <Wand2 className="h-4 w-4" />
                                                Mở Visual Editor
                                            </Link>
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            type="button"
                                            onClick={() => setShowRawJson(true)}
                                            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Code className="h-4 w-4" />
                                            Xem mã JSON (Expert Only)
                                        </Button>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center gap-4">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">Thông tin bổ sung</p>
                                            <p className="text-xs text-slate-500">Bạn vẫn có thể thay đổi Tiêu đề, Slug và Ảnh đại diện ở trên.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content || ""}
                                        onChange={(value) =>
                                            setFormData({ ...formData, content: value })
                                        }
                                        placeholder="Enter your page content here..."
                                        className="h-[400px] mb-12"
                                    />
                                    {showRawJson && isJsonContent(formData.content) && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            type="button"
                                            onClick={() => setShowRawJson(false)}
                                            className="mt-2 text-blue-600 hover:text-blue-700"
                                        >
                                            Quay lại giao diện thông báo
                                        </Button>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Nội dung được soạn thảo ở đây sẽ hiển thị trực quan trên Client.
                                    </p>
                                </>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="submit">Save Page</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
