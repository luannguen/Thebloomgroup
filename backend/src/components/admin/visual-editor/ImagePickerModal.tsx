import React, { useState, useEffect } from 'react';
import { mediaService, MediaItem } from '@/services/mediaService';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Search, Check, Image as ImageIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ImagePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    title?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    title = "Chọn hình ảnh"
}) => {
    const [images, setImages] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await mediaService.getImages();
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Không thể tải danh sách ảnh');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchImages();
            setSelectedUrl(null);
        }
    }, [isOpen]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        
        setUploading(true);
        try {
            const result = await mediaService.uploadImage(file);
            toast.success('Tải ảnh lên thành công');
            await fetchImages();
            if (result && result.url) setSelectedUrl(result.url);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Lỗi khi tải ảnh');
        } finally {
            setUploading(false);
        }
    };

    const filteredImages = images.filter(img => 
        (img.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfirm = () => {
        if (selectedUrl) {
            onSelect(selectedUrl);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[min(850px,94vh)] flex flex-col p-0 overflow-hidden ring-1 ring-slate-200 shadow-2xl z-[11000] border-none">
                {/* Header Section */}
                <DialogHeader className="p-5 border-b bg-white flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ImageIcon className="h-5 w-5 text-primary" />
                        </div>
                        {title}
                    </DialogTitle>
                </DialogHeader>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
                    {/* Controls Bar */}
                    <div className="p-5 pb-2">
                        <div className="flex gap-3">
                            <div className="relative flex-grow group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    placeholder="Tìm kiếm hình ảnh theo tên..." 
                                    className="pl-10 h-11 border-slate-200 bg-white focus-visible:ring-primary shadow-sm hover:border-slate-300 transition-all rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Button 
                                    variant="outline" 
                                    disabled={uploading} 
                                    className="h-11 border-slate-200 bg-white relative overflow-hidden transition-all hover:bg-slate-50 hover:border-primary/30 rounded-xl px-5"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                                    ) : (
                                        <Upload className="h-4 w-4 mr-2 text-primary" />
                                    )}
                                    <span className="font-semibold text-slate-700">Tải ảnh mới</span>
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        onChange={handleUpload}
                                        accept="image/*"
                                        disabled={uploading}
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-5 pt-2 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <div className="absolute inset-x-0 -bottom-8 whitespace-nowrap text-sm font-medium text-slate-500 text-center">
                                        Đang tải thư viện...
                                    </div>
                                </div>
                            </div>
                        ) : filteredImages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 m-2">
                                <div className="p-4 bg-slate-100 rounded-full mb-4">
                                    <ImageIcon className="h-10 w-10 opacity-30" />
                                </div>
                                <p className="text-base font-semibold text-slate-600">Không tìm thấy hình ảnh nào</p>
                                <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác hoặc tải ảnh mới.</p>
                                {searchQuery && (
                                    <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2 text-primary">
                                        Xóa bộ lọc tìm kiếm
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredImages.map((img) => (
                                    <div 
                                        key={img.id}
                                        className={`group relative aspect-square overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                                            selectedUrl === img.url 
                                            ? 'ring-4 ring-primary ring-offset-2 scale-[0.96] shadow-xl' 
                                            : 'border border-slate-200 hover:border-primary/50 hover:shadow-lg'
                                        }`}
                                        onClick={() => setSelectedUrl(img.url)}
                                    >
                                        <img 
                                            src={img.url} 
                                            alt={img.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        
                                        {/* Overlay for selection state */}
                                        <div className={`absolute inset-0 transition-all duration-300 ${
                                            selectedUrl === img.url 
                                            ? 'bg-primary/10' 
                                            : 'bg-black/0 group-hover:bg-black/5'
                                        }`} />

                                        {selectedUrl === img.url && (
                                            <div className="absolute top-2 right-2 animate-in zoom-in duration-300">
                                                <div className="bg-primary text-white p-1.5 rounded-full shadow-lg ring-2 ring-white">
                                                    <Check className="h-4 w-4 stroke-[3px]" />
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            <p className="text-[11px] text-white truncate font-semibold drop-shadow-sm">{img.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section - Fixed at the bottom */}
                <DialogFooter className="p-5 px-6 border-t bg-white flex flex-row items-center justify-between sm:justify-between gap-4">
                    <div className="text-sm text-slate-500 font-medium hidden sm:block">
                        {selectedUrl ? (
                            <span className="flex items-center gap-2 text-primary">
                                <Check className="h-4 w-4" />
                                Đã chọn 1 ảnh
                            </span>
                        ) : (
                            <span>Chọn một ảnh để tiếp tục</span>
                        )}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto ml-auto">
                        <Button variant="ghost" onClick={onClose} className="hover:bg-slate-100 rounded-xl px-6">
                            Hủy bỏ
                        </Button>
                        <Button 
                            onClick={handleConfirm} 
                            disabled={!selectedUrl}
                            className={`px-8 rounded-xl font-bold transition-all ${
                                selectedUrl 
                                ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95' 
                                : 'bg-slate-200 text-slate-400'
                            }`}
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Chèn ảnh ngay
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
