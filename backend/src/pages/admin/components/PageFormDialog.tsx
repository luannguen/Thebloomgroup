import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wand2, Code, Layout, Save, Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { StaticPage, PageFormData } from "@/services/pageService";

interface PageFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentPage: StaticPage | null;
    formData: PageFormData;
    setFormData: (data: PageFormData) => void;
    setSelectedFile: (file: File | null) => void;
    selectedFile: File | null;
    showRawJson: boolean;
    setShowRawJson: (show: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function PageFormDialog({
    isOpen,
    onOpenChange,
    currentPage,
    formData,
    setFormData,
    setSelectedFile,
    selectedFile,
    showRawJson,
    setShowRawJson,
    onSubmit
}: PageFormDialogProps) {
    
    const isJsonContent = (content: string | null) => {
        if (!content) return false;
        try {
            return content.trim().startsWith('{"sections":');
        } catch (e) {
            return false;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-none p-0">
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {currentPage ? (
                                <>
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <Pencil className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    Chỉnh sửa trang
                                </>
                            ) : (
                                <>
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Plus className="h-5 w-5 text-green-600" />
                                    </div>
                                    Tạo trang mới
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            {currentPage
                                ? "Cập nhật nội dung và thông tin cơ bản cho trang này."
                                : "Thêm một trang mới vào hệ thống website của bạn."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-bold text-slate-700">Tiêu đề trang</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="h-11 rounded-xl border-slate-200 focus:ring-primary/20 transition-all"
                                    placeholder="VD: Giới thiệu công ty"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-sm font-bold text-slate-700">Đường dẫn (Slug)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="VD: gioi-thieu"
                                    required
                                    className="h-11 rounded-xl border-slate-200 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-bold text-slate-700">Ảnh đại diện (Banner)</Label>
                            <div className="flex flex-col gap-3">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                    className="h-11 rounded-xl border-slate-200 file:bg-slate-50 file:border-0 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                                />
                                {(formData.image_url || selectedFile) && (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                                        <div className="h-12 w-20 rounded-lg overflow-hidden border border-white shadow-sm bg-white">
                                            <img 
                                                src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image_url || ""} 
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-medium text-slate-700 truncate">
                                                {selectedFile ? selectedFile.name : formData.image_url}
                                            </p>
                                            <p className="text-[10px] text-slate-400">Ảnh hiện tại</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-sm font-bold text-slate-700">Mô tả ngắn (SEO)</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt || ""}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Tóm tắt nội dung trang cho công cụ tìm kiếm hoặc danh sách..."
                                className="min-h-[100px] rounded-xl border-slate-200 resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_active_modal" className="text-sm font-bold text-slate-900">Trạng thái hoạt động</Label>
                                <p className="text-xs text-slate-500">Cho phép người dùng truy cập trang này từ website.</p>
                            </div>
                            <Switch
                                id="is_active_modal"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                className="data-[state=checked]:bg-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700">Nội dung trang</Label>
                            {isJsonContent(formData.content) && !showRawJson ? (
                                <div className="space-y-4">
                                    <Alert className="bg-blue-50 border-blue-100 rounded-2xl">
                                        <Layout className="h-4 w-4 text-blue-600" />
                                        <AlertTitle className="text-blue-700 font-bold">Visual Editor Detected</AlertTitle>
                                        <AlertDescription className="text-blue-600 text-sm">
                                            Trang này được xây dựng bằng thiết kế trực quan. Để có trải nghiệm tốt nhất, vui lòng sử dụng Visual Editor.
                                        </AlertDescription>
                                    </Alert>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <Button 
                                            asChild 
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 flex items-center gap-2 px-6 shadow-lg shadow-primary/20"
                                        >
                                            <Link to={`/pages/visual-edit/${formData.slug.replace(/^\/+/, '')}`}>
                                                <Wand2 className="h-4 w-4" />
                                                Mở Visual Editor
                                            </Link>
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            type="button"
                                            onClick={() => setShowRawJson(true)}
                                            className="rounded-xl h-11 border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2 px-6"
                                        >
                                            <Code className="h-4 w-4" />
                                            Xem mã JSON
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content || ""}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        placeholder="Nhập nội dung trang tại đây..."
                                        className="h-[300px] mb-12 rounded-xl overflow-hidden"
                                    />
                                    {showRawJson && isJsonContent(formData.content) && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            type="button"
                                            onClick={() => setShowRawJson(false)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            ← Quay lại giao diện quản lý
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3">
                            <Button 
                                variant="outline" 
                                type="button" 
                                onClick={() => onOpenChange(false)}
                                className="h-12 rounded-xl px-8 border-slate-200"
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="submit" 
                                className="h-12 rounded-xl px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {currentPage ? "Cập nhật trang" : "Lưu trang mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

