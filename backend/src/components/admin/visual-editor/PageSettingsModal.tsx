import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { PageFormData } from '@/services/pageService';

interface PageSettingsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    config: Partial<PageFormData>;
    onConfigChange: (data: Partial<PageFormData>) => void;
    isNewPage: boolean;
    onPickImage: () => void;
}

export const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
    isOpen,
    onOpenChange,
    config,
    onConfigChange,
    isNewPage,
    onPickImage
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {isNewPage ? 'Cấu hình trang mới' : 'Cài đặt trang'}
                    </DialogTitle>
                    <DialogDescription>
                        Thiết lập các thông tin cơ bản cho trang này để hiển thị trên menu và tối ưu SEO.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="font-semibold text-slate-700">Tiêu đề trang</Label>
                        <Input
                            id="title"
                            value={config.title || ''}
                            onChange={(e) => onConfigChange({ ...config, title: e.target.value })}
                            placeholder="Ví dụ: Về chúng tôi"
                            className="rounded-xl border-slate-200 focus:ring-primary/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug" className="font-semibold text-slate-700">Đường dẫn (Slug)</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">/</span>
                            <Input
                                id="slug"
                                value={config.slug || ''}
                                onChange={(e) => onConfigChange({ ...config, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="ve-chung-toi"
                                disabled={config.slug === 'home'}
                                className="rounded-xl border-slate-200 focus:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-400"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Dùng làm URL truy cập. Không chứa dấu cách.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label className="font-semibold text-slate-700">Ảnh đại diện (Thumbnail)</Label>
                        <div className="flex gap-4 items-center">
                            {config.image_url ? (
                                <div className="relative group w-24 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                    <img 
                                        src={config.image_url} 
                                        alt="Thumbnail" 
                                        className="w-full h-full object-cover"
                                    />
                                    <button 
                                        onClick={() => onConfigChange({ ...config, image_url: null })}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    className="w-24 h-16 rounded-xl border-dashed border-2 flex flex-col gap-1 text-slate-400 hover:text-primary hover:border-primary transition-colors"
                                    onClick={onPickImage}
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    <span className="text-[10px]">Chọn ảnh</span>
                                </Button>
                            )}
                            <div className="flex-1">
                                <p className="text-xs text-slate-500">Ảnh này dùng làm banner mặc định hoặc xuất hiện khi chia sẻ link.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt" className="font-semibold text-slate-700">Mô tả ngắn (Description)</Label>
                        <Textarea
                            id="excerpt"
                            value={config.excerpt || ''}
                            onChange={(e) => onConfigChange({ ...config, excerpt: e.target.value })}
                            placeholder="Mô tả tóm tắt cho trang..."
                            className="rounded-xl border-slate-200 focus:ring-primary/20 min-h-[80px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button 
                        onClick={() => onOpenChange(false)} 
                        className="rounded-full w-full bg-slate-900 hover:bg-slate-800 text-white font-bold"
                    >
                        {isNewPage ? 'Tiếp tục thiết kế' : 'Hoàn tất cấu hình'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
