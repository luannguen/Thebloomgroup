import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Image as ImageIcon, Loader2, Plus, Pencil } from 'lucide-react';
import { partnerService } from '@/services/partnerService';
import { toast } from 'sonner';

interface PartnerQuickFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onPickImage: () => void;
    selectedImageUrl: string | null;
    editingPartner?: any | null;
}

export const PartnerQuickFormModal: React.FC<PartnerQuickFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onPickImage,
    selectedImageUrl,
    editingPartner
}) => {
    const [name, setName] = React.useState('');
    const [websiteUrl, setWebsiteUrl] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Sync form when opening for edit
    React.useEffect(() => {
        if (isOpen) {
            if (editingPartner) {
                setName(editingPartner.name || '');
                setWebsiteUrl(editingPartner.website_url || '');
            } else {
                setName('');
                setWebsiteUrl('');
            }
        }
    }, [isOpen, editingPartner]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error('Vui lòng nhập tên đối tác');
            return;
        }

        setLoading(true);
        try {
            const partnerData = {
                name,
                website_url: websiteUrl,
                logo_url: selectedImageUrl || editingPartner?.logo_url || undefined,
                is_active: true,
                display_order: editingPartner?.display_order || 999
            };

            const result = editingPartner 
                ? await partnerService.update(editingPartner.id, partnerData)
                : await partnerService.create(partnerData);

            if (result.success) {
                toast.success(editingPartner ? 'Cập nhật đối tác thành công' : 'Thêm đối tác thành công');
                setName('');
                setWebsiteUrl('');
                onSuccess();
                onClose();
            } else {
                console.error('[PartnerQuickFormModal] Create failed:', result.error);
                const errorMessage = typeof result.error === 'string' ? result.error : (result.error as any)?.message || 'Không thể lưu đối tác';
                toast.error(`Lỗi: ${errorMessage}`);
            }
        } catch (error: any) {
            console.error('[PartnerQuickFormModal] System error:', error);
            toast.error(`Lỗi hệ thống: ${error.message || 'Không xác định'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] z-[10000]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary font-bold">
                        {editingPartner ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {editingPartner ? 'Cập nhật đối tác' : 'Thêm đối tác nhanh'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="quick-partner-name">Tên đối tác <span className="text-red-500">*</span></Label>
                        <Input 
                            id="quick-partner-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tên công ty / đối tác"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quick-partner-url">Link Website</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input 
                                id="quick-partner-url"
                                className="pl-9"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Logo đối tác</Label>
                        <div 
                            onClick={onPickImage}
                            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all min-h-[120px]"
                        >
                            {selectedImageUrl || editingPartner?.logo_url ? (
                                <img 
                                    src={selectedImageUrl || editingPartner?.logo_url} 
                                    alt="Preview" 
                                    className="max-h-20 object-contain"
                                />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                                    <span className="text-xs text-slate-400">Nhấn để chọn logo</span>
                                </>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {editingPartner ? 'Cập nhật' : 'Lưu đối tác'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
