import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Laptop, Tablet, Smartphone, Loader2, ExternalLink, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EditorToolbarProps {
    slug: string;
    isNewPage: boolean;
    viewMode: 'desktop' | 'tablet' | 'mobile';
    setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    handleSave: () => void;
    setIsSettingsOpen: (open: boolean) => void;
    isSaving: boolean;
    hasPendingChanges: boolean;
    frontendUrl?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    slug,
    isNewPage,
    viewMode,
    setViewMode,
    handleSave,
    setIsSettingsOpen,
    isSaving,
    hasPendingChanges,
    frontendUrl
}) => {
    const navigate = useNavigate();
    // frontendUrl is now passed as a prop, but we keep a local fallback just in case
    const effectiveFrontendUrl = frontendUrl || import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8081';
    const displaySlug = isNewPage ? 'Trang mới' : slug;

    return (
        <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border mb-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/pages')} className="rounded-full hover:bg-slate-100">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <h1 className="font-bold text-slate-800 tracking-tight">
                    {isNewPage ? 'Tạo trang mới' : `Chỉnh sửa: ${displaySlug.replace(/-/g, ' ')}`}
                </h1>
            </div>

            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200">
                <Button 
                    variant={viewMode === 'desktop' ? 'outline' : 'ghost'} 
                    size="icon" 
                    className={`h-8 w-8 rounded-full ${viewMode === 'desktop' ? 'shadow-sm bg-white border-slate-200' : ''}`}
                    onClick={() => setViewMode('desktop')}
                >
                    <Laptop className="h-4 w-4" />
                </Button>
                <Button 
                    variant={viewMode === 'tablet' ? 'outline' : 'ghost'} 
                    size="icon" 
                    className={`h-8 w-8 rounded-full ${viewMode === 'tablet' ? 'shadow-sm bg-white border-slate-200' : ''}`}
                    onClick={() => setViewMode('tablet')}
                >
                    <Tablet className="h-4 w-4" />
                </Button>
                <Button 
                    variant={viewMode === 'mobile' ? 'outline' : 'ghost'} 
                    size="icon" 
                    className={`h-8 w-8 rounded-full ${viewMode === 'mobile' ? 'shadow-sm bg-white border-slate-200' : ''}`}
                    onClick={() => setViewMode('mobile')}
                >
                    <Smartphone className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsSettingsOpen(true)}
                    className="rounded-full border-slate-200 hover:bg-slate-50"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Cấu hình trang
                </Button>

                {!isNewPage && (
                    <Button variant="ghost" size="sm" asChild className="rounded-full">
                        <a href={`${effectiveFrontendUrl}/${['about-us', 'news', 'products', 'team'].includes(slug) ? slug : slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Xem
                        </a>
                    </Button>
                )}

                <Button 
                    size="sm" 
                    onClick={handleSave} 
                    disabled={isSaving || !hasPendingChanges}
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 shadow-lg shadow-primary/20 transition-all font-semibold"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {isNewPage ? 'Lưu trang mới' : 'Lưu thay đổi'}
                </Button>
            </div>
        </div>
    );
};
