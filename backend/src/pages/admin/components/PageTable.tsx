import { Link } from "react-router-dom";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
    Loader2, 
    Pencil, 
    Trash2, 
    FileText, 
    Image as ImageIcon, 
    Wand2, 
    ExternalLink,
    Calendar,
    Globe
} from "lucide-react";
import { StaticPage } from "@/services/pageService";
import { Badge } from "@/components/ui/badge";

interface PageTableProps {
    pages: StaticPage[];
    loading: boolean;
    onEdit: (page: StaticPage) => void;
    onDelete: (id: string) => void;
    onToggleActive: (page: StaticPage) => void;
}

export function PageTable({
    pages,
    loading,
    onEdit,
    onDelete,
    onToggleActive
}: PageTableProps) {
    
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[100px]">Ảnh</TableHead>
                            <TableHead>Trang</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Cập nhật</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={6} className="h-16 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                        <span className="text-sm text-slate-400 font-medium">Đang tải dữ liệu...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <FileText className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Không tìm thấy trang nào</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-1">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để thấy kết quả.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[100px] font-bold text-slate-900">Ảnh</TableHead>
                        <TableHead className="font-bold text-slate-900">Trang</TableHead>
                        <TableHead className="font-bold text-slate-900">Slug</TableHead>
                        <TableHead className="font-bold text-slate-900">Cập nhật</TableHead>
                        <TableHead className="font-bold text-slate-900">Trạng thái</TableHead>
                        <TableHead className="text-right font-bold text-slate-900">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pages.map((page) => (
                        <TableRow key={page.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                            <TableCell>
                                {page.image_url ? (
                                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                        <img
                                            src={page.image_url}
                                            alt={page.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-12 w-20 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-50">
                                        <ImageIcon className="h-6 w-6 text-slate-300" />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {page.title}
                                        </span>
                                        {(page.slug === 'home' || page.slug === 'home_v2') && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 px-1.5 py-0 text-[10px] uppercase font-black tracking-wider">
                                                Hệ thống
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-400 gap-3">
                                        <span className="flex items-center gap-1">
                                            <Globe className="h-3 w-3" />
                                            {page.slug === 'home' ? '/' : `/${page.slug}`}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <code className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-600 border border-slate-200/50">
                                    {page.slug}
                                </code>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    {new Date(page.updated_at).toLocaleDateString('vi-VN')}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={page.is_active}
                                        onCheckedChange={() => onToggleActive(page)}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                    <span className={`text-xs font-medium ${page.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                                        {page.is_active ? 'Hiện' : 'Ẩn'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="h-8 w-8 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        title="Xem trên trang web"
                                    >
                                        <a href={`/${page.slug}`} target="_blank" rel="noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="h-8 w-8 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                        title="Chỉnh sửa Visual"
                                    >
                                        <Link to={`/pages/visual-edit/${page.slug}`}>
                                            <Wand2 className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(page)}
                                        className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        title="Sửa thông tin"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    
                                    {page.slug !== 'home' && page.slug !== 'home_v2' && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-red-50"
                                                    title="Xóa trang"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-2xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xác nhận xóa trang?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Hành động này sẽ xóa vĩnh viễn trang <span className="font-bold text-slate-900">"{page.title}"</span>. 
                                                        Bạn không thể hoàn tác sau khi thực hiện.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-xl border-slate-200">Hủy</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={() => onDelete(page.id)}
                                                        className="rounded-xl bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Xác nhận xóa
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
