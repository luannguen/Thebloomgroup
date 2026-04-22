import React, { useState, useRef } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useVisualEditor } from '@/hooks/useVisualEditor';
import { EditorToolbar } from '@/components/admin/visual-editor/EditorToolbar';
import { BlockLibrary } from '@/components/admin/visual-editor/BlockLibrary';
import { PageNavigator } from '@/components/admin/visual-editor/PageNavigator';
import { PreviewArea } from '@/components/admin/visual-editor/PreviewArea';
import { PropertyInspector } from '@/components/admin/visual-editor/PropertyInspector';
import { PageSettingsModal } from '@/components/admin/visual-editor/PageSettingsModal';
import { ImagePickerModal } from '@/components/admin/visual-editor/ImagePickerModal';
import { PartnerQuickFormModal } from '@/components/admin/visual-editor/PartnerQuickFormModal';
import { Loader2, AlertCircle, Layout, List } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { partnerService } from '@/services/partnerService';
import { toast } from 'sonner';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const VisualEditorPage: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    
    const [partnerModal, setPartnerModal] = useState({
        isOpen: false,
        selectedLogo: null as string | null,
        editingPartner: null as any | null
    });
    
    // Global message debugger
    React.useEffect(() => {
        const globalHandler = (e: MessageEvent) => {
            if (e.data?.type === 'VISUAL_EDIT_PICK_IMAGE') {
                console.log('[VisualEditorPage] GLOBAL RECEIVE:', e.data);
            }
            if (e.data?.type === 'VISUAL_EDIT_QUICK_ADD_PARTNER') {
                setPartnerModal({ isOpen: true, selectedLogo: null, editingPartner: null });
            }
            if (e.data?.type === 'VISUAL_EDIT_EDIT_PARTNER') {
                setPartnerModal({ isOpen: true, selectedLogo: null, editingPartner: e.data.partner });
            }
            if (e.data?.type === 'VISUAL_EDIT_DELETE_PARTNER') {
                handleDeletePartner(e.data.partnerId);
            }
        };
        window.addEventListener('message', globalHandler);
        return () => window.removeEventListener('message', globalHandler);
    }, []);
    
    const {
        loading,
        error,
        slug,
        isNewPage,
        sections,
        selectedSectionId,
        isSaving,
        hasPendingChanges,
        setSelectedSectionId,
        handleDragEnd,
        handleSave,
        updateSection,
        removeSection,
        iframeSrc,
        isDragging,
        setIsDragging,
        imagePicker,
        setImagePicker,
        handleImageSelect,
        pageMetadata,
        setPageMetadata,
        isSettingsOpen,
        setIsSettingsOpen,
        sendToIframe,
        frontendUrl
    } = useVisualEditor(iframeRef);

    const refreshPreview = React.useCallback(() => {
        console.log('[VisualEditor Parent] Sending refresh signal to child');
        sendToIframe('VISUAL_EDIT_REFRESH_PARTNERS', {});
    }, [sendToIframe]);

    const onPartnerLogoSelect = (url: string) => {
        setPartnerModal(prev => ({ ...prev, selectedLogo: url }));
    };

    const handlePartnerSuccess = () => {
        refreshPreview();
        setPartnerModal({ isOpen: false, selectedLogo: null, editingPartner: null });
    };

    const handleDeletePartner = async (id: string) => {
        try {
            const result = await partnerService.delete(id);
            if (result.success) {
                toast.success('Đã xóa đối tác');
                refreshPreview();
            } else {
                toast.error('Không thể xóa đối tác');
            }
        } catch (error) {
            toast.error('Lỗi khi xóa đối tác');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 font-bold text-slate-500">Đang tải trình chỉnh sửa...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi hệ thống</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const onDragStart = () => setIsDragging(true);
    const onDragEnd = (result: any) => {
        setIsDragging(false);
        handleDragEnd(result);
    };

    return (
        <div className="fixed inset-0 z-10 flex flex-col bg-slate-50 overflow-hidden font-sans select-none">
            <header className="p-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 shadow-sm">
                <EditorToolbar 
                    slug={slug} 
                    isNewPage={isNewPage}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    handleSave={handleSave}
                    setIsSettingsOpen={setIsSettingsOpen}
                    isSaving={isSaving}
                    hasPendingChanges={hasPendingChanges}
                    frontendUrl={frontendUrl}
                />
            </header>

            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="flex-grow p-2 h-full overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl border bg-slate-100/50 shadow-sm overflow-hidden">
                        
                        {/* Panel Left: Block Library & Navigator */}
                        <ResizablePanel defaultSize={20} minSize={15} maxSize={35} className="bg-white flex flex-col overflow-hidden border-r">
                            <Tabs defaultValue="blocks" className="flex flex-col h-full overflow-hidden">
                                <div className="p-2 border-b bg-slate-50/50">
                                    <TabsList className="grid w-full grid-cols-2 h-9 p-1">
                                        <TabsTrigger value="blocks" className="flex items-center gap-2 text-xs py-1">
                                            <Layout className="w-3.5 h-3.5" />
                                            <span>Thư viện</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="navigator" className="flex items-center gap-2 text-xs py-1">
                                            <List className="w-3.5 h-3.5" />
                                            <span>Cấu trúc</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <div className="flex-grow overflow-hidden relative">
                                    <TabsContent value="blocks" className="h-full m-0 p-0 overflow-y-auto">
                                        <BlockLibrary />
                                    </TabsContent>
                                    <TabsContent value="navigator" className="h-full m-0 p-0 overflow-y-auto">
                                        <PageNavigator 
                                            sections={sections} 
                                            selectedSectionId={selectedSectionId}
                                            setSelectedSectionId={setSelectedSectionId}
                                            removeSection={removeSection}
                                        />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Panel Center: Preview Area */}
                        <ResizablePanel defaultSize={60} minSize={30} className="flex flex-col overflow-hidden bg-slate-100/30 relative">
                            <PreviewArea 
                                iframeRef={iframeRef}
                                iframeSrc={iframeSrc}
                                viewMode={viewMode}
                                isDragging={isDragging}
                                sections={sections}
                            />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Panel Right: Property Inspector */}
                        <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="bg-white flex flex-col overflow-hidden">
                            <PropertyInspector 
                                selectedSectionId={selectedSectionId}
                                sections={sections}
                                updateSection={updateSection}
                                setSelectedSectionId={setSelectedSectionId}
                                onPickImage={(fieldId, parentPath) => setImagePicker({
                                    isOpen: true,
                                    fieldId,
                                    parentPath: parentPath || null,
                                    sectionId: selectedSectionId
                                })}
                            />
                        </ResizablePanel>

                    </ResizablePanelGroup>
                </div>
            </DragDropContext>

            <PageSettingsModal 
                isOpen={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                config={pageMetadata}
                onConfigChange={setPageMetadata}
                isNewPage={isNewPage}
                onPickImage={() => setImagePicker({ isOpen: true, fieldId: 'image_url', sectionId: null, isForMetadata: true })}
            />

            <ImagePickerModal 
                isOpen={imagePicker.isOpen}
                onClose={() => setImagePicker(prev => ({ ...prev, isOpen: false }))}
                onSelect={partnerModal.isOpen ? onPartnerLogoSelect : handleImageSelect}
            />

            <PartnerQuickFormModal 
                isOpen={partnerModal.isOpen}
                onClose={() => setPartnerModal({ isOpen: false, selectedLogo: null, editingPartner: null })}
                onSuccess={handlePartnerSuccess}
                onPickImage={() => setImagePicker({
                    isOpen: true,
                    fieldId: 'quick_partner_logo',
                    sectionId: null
                })}
                selectedImageUrl={partnerModal.selectedLogo}
                editingPartner={partnerModal.editingPartner}
            />
        </div>
    );
};

export default VisualEditorPage;
