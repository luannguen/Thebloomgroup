import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { pageService, PageFormData } from '@/services/pageService';
import { settingsService } from '@/services/settingsService';
import { DropResult } from '@hello-pangea/dnd';
export function useVisualEditor(iframeRef: React.RefObject<HTMLIFrameElement>) {
    const { slug: urlSlug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    
    const isNewPage = urlSlug === 'new-page';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageId, setPageId] = useState<string | null>(null);
    const [slug, setSlug] = useState<string>(isNewPage ? '' : (urlSlug || ''));
    const [sections, setSections] = useState<any[]>([]);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [iframeSrc, setIframeSrc] = useState<string>('');
    const [frontendUrl, setFrontendUrl] = useState<string>('');
    const isIframeReady = React.useRef(false);
    const hasInitialSyncHappened = React.useRef(false);

    // Page metadata for new pages or updating existing ones
    const [pageMetadata, setPageMetadata] = useState<Partial<PageFormData>>({
        title: '',
        slug: '',
        excerpt: '',
        image_url: '',
        is_active: true
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(isNewPage);



    // Send messages to iframe
    const sendToIframe = useCallback((type: string, payload: any) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type, ...payload }, '*');
        }
    }, [iframeRef]);

    // Sync selected section
    useEffect(() => {
        if (!loading && isIframeReady.current) {
            sendToIframe('VISUAL_EDIT_SELECT_SECTION', { sectionId: selectedSectionId });
        }
    }, [selectedSectionId, sendToIframe, loading]);

    // Push data to iframe when loading completes
    useEffect(() => {
        if (!loading && isIframeReady.current && !hasInitialSyncHappened.current) {
            console.log('[VisualEditor Parent] Loading finished, pushing initial data to ready iframe.');
            sendToIframe('VISUAL_EDIT_UPDATE_DATA', { sections });
            hasInitialSyncHappened.current = true;
        }
    }, [loading, sections, sendToIframe]);

    // Fetch initial data
    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);
            try {
                // Environment detection
                const isLocal = window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1' || 
                               window.location.hostname.startsWith('192.168.') ||
                               window.location.protocol === 'http:';
                
                const isLocalUrl = (url: string) => url.includes('localhost') || url.includes('127.0.0.1');
                
                let resolvedFrontendUrl: string | undefined;
                
                // Priority 1: Environment variable (Developer override)
                // In local dev, we trust this. In prod, we only trust it if it's NOT a localhost URL.
                const envFrontendUrl = import.meta.env.VITE_FRONTEND_URL;
                if (envFrontendUrl) {
                    const cleanEnvUrl = envFrontendUrl.endsWith('/') ? envFrontendUrl.slice(0, -1) : envFrontendUrl;
                    if (isLocal || !isLocalUrl(cleanEnvUrl)) {
                        resolvedFrontendUrl = cleanEnvUrl;
                    }
                }

                // Priority 2: Database settings (Production config)
                // We fetch this if we haven't found a valid non-local URL yet
                if (!resolvedFrontendUrl || (isLocalUrl(resolvedFrontendUrl) && !isLocal)) {
                    const settingsResult = await settingsService.getSettings();
                    if (settingsResult.success && settingsResult.data) {
                        const siteUrlSetting = settingsResult.data.find(s => s.key === 'site_url');
                        if (siteUrlSetting && siteUrlSetting.value) {
                            const cleanSiteUrl = siteUrlSetting.value.endsWith('/') 
                                ? siteUrlSetting.value.slice(0, -1) 
                                : siteUrlSetting.value;
                            
                            // Only use site_url from DB if it's appropriate for the environment
                            if (isLocal || !isLocalUrl(cleanSiteUrl)) {
                                resolvedFrontendUrl = cleanSiteUrl;
                            }
                        }
                    }
                }

                // Priority 3: Local development default
                if (!resolvedFrontendUrl && isLocal) {
                    resolvedFrontendUrl = 'http://localhost:8081';
                    console.log('[VisualEditor Parent] Local environment detected, defaulting to:', resolvedFrontendUrl);
                }
                
                // Priority 4: Dynamic fallback based on current origin
                if (!resolvedFrontendUrl) {
                    const currentOrigin = window.location.origin;
                    // If we are on admin.thebloomgroup.vn, try to go to thebloomgroup.vn
                    resolvedFrontendUrl = currentOrigin.replace('admin.', '').replace('backend.', '');
                    console.log('[VisualEditor Parent] Using dynamic fallback URL:', resolvedFrontendUrl);
                }

                // Final safety fallback
                if (!resolvedFrontendUrl) {
                    resolvedFrontendUrl = 'https://www.thebloomgroup.vn';
                }
                
                console.log('[VisualEditor Parent] Resolved frontend URL:', resolvedFrontendUrl);
                setFrontendUrl(resolvedFrontendUrl);
                
                const previewSlug = isNewPage ? 'new-page' : (urlSlug === 'home' ? '' : (urlSlug || ''));
                setIframeSrc(`${resolvedFrontendUrl}/${previewSlug}?edit_mode=true${isNewPage ? '&new=true' : ''}`);

                if (isNewPage) {
                    setLoading(false);
                    return;
                }
                
                if (!urlSlug) {
                    setLoading(false);
                    return;
                }

                const pages = await pageService.getPages();
                const page = pages.find(p => p.slug === urlSlug);
                
                if (!page) {
                    if (urlSlug === 'home' || urlSlug === 'home_v2') {
                        // Cho phép Trang chủ hoặc Home V2 hoạt động ở chế độ khởi tạo nếu chưa có trong DB
                        const isV2 = urlSlug === 'home_v2';
                        setSlug(urlSlug);
                        setPageMetadata({
                            title: isV2 ? 'Trang chủ V2' : 'Trang chủ',
                            slug: urlSlug,
                            excerpt: isV2 ? 'Trang chủ phiên bản mới' : 'Trang chủ mặc định của website',
                            image_url: '',
                            is_active: true
                        });
                        setLoading(false);
                        return;
                    }
                    setError('Không tìm thấy trang này');
                    return;
                }

                setPageId(page.id);
                setSlug(page.slug);
                setPageMetadata({
                    title: page.title,
                    slug: page.slug,
                    excerpt: page.excerpt || '',
                    image_url: page.image_url || '',
                    is_active: page.is_active
                });
                
                if (page.content) {
                    try {
                        const parsed = JSON.parse(page.content);
                        const rawSections = parsed.sections || [];
                        const processedSections = rawSections.map((s: any, idx: number) => ({
                            ...s,
                            // Use existing ID or generate a stable one based on index
                            id: s.id || `sec_stable_${idx}`
                        }));
                        setSections(processedSections);
                    } catch (e) {
                        setSections([]);
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải trang');
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [urlSlug, isNewPage]);

    // Removal of the separate determineIframeSrc effect to avoid duplication
    /* 
    useEffect(() => {
        ...
    }, [urlSlug, isNewPage]); 
    */

    const [imagePicker, setImagePicker] = useState<{ 
        isOpen: boolean; 
        fieldId: string | null; 
        parentPath?: string | null;
        sectionId: string | null;
        isForMetadata?: boolean;
    }>({
        isOpen: false,
        fieldId: null,
        parentPath: null,
        sectionId: null
    });

    // Handle incoming messages from iframe
    const handleMessage = useCallback((event: MessageEvent) => {
        let data = event.data;
        
        // Handle stringified messages
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return; // Not a JSON message we care about
            }
        }

        if (!data || typeof data !== 'object') return;

        // Standardize protocol: handle both legacy and new names
        if (data.type === 'VISUAL_EDIT_UPDATE' || data.type === 'VISUAL_EDIT_UPDATE_DATA_FROM_IFRAME') {
            const sectionsData = data.sections || data.data?.sections;
            if (sectionsData && Array.isArray(sectionsData)) {
                console.log('[VisualEditor Parent] Syncing sections from iframe:', sectionsData.length);
                setSections(sectionsData);
                setHasPendingChanges(true);
            }
        } else if (data.type === 'VISUAL_EDIT_SECTION_SELECTED') {
            console.log('[VisualEditor Parent] Section selected in iframe:', data.sectionId);
            setSelectedSectionId(data.sectionId);
        } else if (data.type === 'VISUAL_EDIT_PICK_IMAGE') {
            setImagePicker({
                isOpen: true,
                fieldId: data.fieldKey,
                sectionId: data.sectionId
            });
        } else if (data.type === 'VISUAL_EDIT_SYNC_SECTIONS') {
            // Fired by VisualPageRenderer on mount or when hydration happens
            if (data.sections && Array.isArray(data.sections)) {
                console.log('[VisualEditor Parent] Full sections sync from iframe:', data.sections.length);
                setSections(data.sections);
                // Also update page metadata if it was a new page or empty
                if (isNewPage && !pageMetadata.title) {
                    setPageMetadata(prev => ({ ...prev, title: `Trang ${data.slug || ''}` }));
                }
            }
        } else if (data.type === 'VISUAL_EDIT_READY' || data.type === 'VISUAL_EDIT_SYNC_REQUEST') {
            const iframeSlug = data.slug || 'unknown';
            isIframeReady.current = true;
            
            if (loading) {
                console.log(`[VisualEditor Parent] Iframe READY (${iframeSlug}) but Parent still loading. Postponing sync.`);
                return;
            }

            console.log(`[VisualEditor Parent] Iframe READY/SYNC_REQ (${iframeSlug}), pushing ${sections.length} sections to child.`);
            sendToIframe('VISUAL_EDIT_UPDATE_DATA', { sections });
            hasInitialSyncHappened.current = true;
        }
    }, [sections, sendToIframe]);

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    const handleSave = async () => {
        if (isNewPage && (!pageMetadata.title || !pageMetadata.slug)) {
            setIsSettingsOpen(true);
            toast.error('Vui lòng nhập Tiêu đề và Slug cho trang mới');
            return;
        }

        setIsSaving(true);
        try {
            // Safety check: Don't allow saving empty content if we haven't successfully synced yet
            if (!isNewPage && sections.length === 0 && !hasInitialSyncHappened.current) {
                throw new Error('Hệ thống chưa đồng bộ xong dữ liệu. Vui lòng đợi trong giây lát rồi thử lại.');
            }

            const contentJson = JSON.stringify({ sections });
            
            if (isNewPage) {
                const newPage = await pageService.createPage({
                    title: pageMetadata.title!,
                    slug: pageMetadata.slug!,
                    excerpt: pageMetadata.excerpt || null,
                    image_url: pageMetadata.image_url || null,
                    is_active: pageMetadata.is_active || true,
                    content: contentJson
                } as PageFormData);
                
                toast.success('Đã tạo trang mới thành công');
                setHasPendingChanges(false);
                // Redirect to the newly created page's editor
                navigate(`/pages/visual-edit/${newPage.slug}`, { replace: true });
            } else if (pageId) {
                await pageService.updatePage(pageId, {
                    ...pageMetadata,
                    content: contentJson
                });
                setHasPendingChanges(false);
                toast.success('Đã lưu thay đổi');
            } else if (pageMetadata.slug === 'home' || pageMetadata.slug === 'home_v2') {
                // Khởi tạo Trang chủ hoặc Home V2 trong DB nếu chưa tồn tại
                const isV2 = pageMetadata.slug === 'home_v2';
                const newPage = await pageService.createPage({
                    title: pageMetadata.title || (isV2 ? 'Trang chủ V2' : 'Trang chủ'),
                    slug: pageMetadata.slug,
                    excerpt: pageMetadata.excerpt || null,
                    image_url: pageMetadata.image_url || null,
                    is_active: pageMetadata.is_active ?? true,
                    content: contentJson
                });
                setPageId(newPage.id);
                setHasPendingChanges(false);
                toast.success(`Đã khởi tạo và lưu ${isV2 ? 'Trang chủ V2' : 'Trang chủ'} thành công`);
            }
        } catch (err: any) {
            toast.error(err.message || 'Lỗi khi lưu trang');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSection = (id: string, updates: any) => {
        setSections(prev => {
            const next = prev.map(s => {
                if (s.id === id) {
                    // Check if updates is already a full props object
                    if (updates.props) {
                        return { ...s, props: updates.props };
                    }
                    
                    // Otherwise, apply each update potentially deep
                    let newProps = { ...(s.props || {}) };
                    Object.entries(updates).forEach(([key, value]) => {
                        if (key.includes('.')) {
                            newProps = setDeepValue(newProps, key, value);
                        } else {
                            newProps[key] = value;
                        }
                    });
                    
                    return { ...s, props: newProps };
                }
                return s;
            });
            sendToIframe('VISUAL_EDIT_UPDATE_DATA', { sections: next });
            return next;
        });
        setHasPendingChanges(true);
    };

    const setDeepValue = (obj: any, path: string, value: any) => {
        const keys = path.split('.');
        const root = { ...obj };
        let current = root;
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            
            if (i === keys.length - 1) {
                current[key] = value;
            } else {
                const nextKey = keys[i + 1];
                const isNextKeyIndex = !isNaN(Number(nextKey));
                
                // Clone the next level to ensure immutability
                if (Array.isArray(current[key])) {
                    current[key] = [...current[key]];
                } else if (current[key] && typeof current[key] === 'object') {
                    current[key] = { ...current[key] };
                } else {
                    current[key] = isNextKeyIndex ? [] : {};
                }
                
                current = current[key];
            }
        }
        return root;
    };

    const handleImageSelect = (url: string) => {
        if (imagePicker.isForMetadata) {
            setPageMetadata(prev => ({ ...prev, image_url: url }));
            setHasPendingChanges(true);
        } else if (imagePicker.sectionId && imagePicker.fieldId) {
            const section = sections.find(s => s.id === imagePicker.sectionId);
            if (section) {
                const newProps = { ...(section.props || {}) };
                
                // Construct the full path if parentPath exists
                const fullPath = imagePicker.parentPath 
                    ? `${imagePicker.parentPath}.${imagePicker.fieldId}`
                    : imagePicker.fieldId;
                
                console.log('[useVisualEditor] Updating nested image:', { fullPath, url });
                setDeepValue(newProps, fullPath, url);
                
                updateSection(imagePicker.sectionId, { props: newProps });
                
                // If it's a forMetadata update, we don't send to iframe yet
                if (!imagePicker.isForMetadata) {
                    sendToIframe('VISUAL_EDIT_IMAGE_SELECTED', {
                        fieldKey: fullPath, // Send the FULL path
                        imageUrl: url,
                        sectionId: imagePicker.sectionId
                    });
                }
            }
        } else if (!imagePicker.sectionId && imagePicker.fieldId) {
            // Trường hợp cập nhật các field toàn cục (với sectionId = null)
            sendToIframe('VISUAL_EDIT_IMAGE_SELECTED', {
                fieldKey: imagePicker.fieldId,
                imageUrl: url,
                sectionId: null
            });
            setHasPendingChanges(true);
        }
        setImagePicker(prev => ({ ...prev, isOpen: false }));
    };

    const removeSection = (id: string) => {
        setSections(prev => {
            const next = prev.filter(s => s.id !== id);
            sendToIframe('VISUAL_EDIT_UPDATE_DATA', { sections: next });
            return next;
        });
        setHasPendingChanges(true);
        if (selectedSectionId === id) setSelectedSectionId(null);
    };

    const addSection = (blockType: string, index?: number) => {
        const newSection = {
            id: `sec_${Date.now()}`,
            type: blockType,
            props: {} 
        };

        setSections(prev => {
            const next = [...prev];
            if (typeof index === 'number') {
                next.splice(index, 0, newSection);
            } else {
                next.push(newSection);
            }
            sendToIframe('VISUAL_EDIT_UPDATE_DATA', { sections: next });
            return next;
        });
        setHasPendingChanges(true);
    };

    const handleDragEnd = (result: DropResult) => {
        setIsDragging(false);
        const { source, destination, draggableId } = result;
        if (!destination) return;

        if (draggableId.startsWith('layer-') && destination.droppableId === 'layers-list') {
            if (source.index === destination.index) return;
            setSections(prev => {
                const next = [...prev];
                const [moved] = next.splice(source.index, 1);
                next.splice(destination.index, 0, moved);
                sendToIframe('VISUAL_EDIT_UPDATE_DATA', { sections: next });
                return next;
            });
            setHasPendingChanges(true);
            return;
        }

        if (source.droppableId === 'blocks-palette' && destination.droppableId === 'layers-list') {
            const blockType = draggableId.replace('block-', '');
            addSection(blockType, destination.index);
            return;
        }

        if (source.droppableId === 'blocks-palette' && destination.droppableId.startsWith('drop-slot-')) {
            const blockType = draggableId.replace('block-', '');
            const indexValue = parseInt(destination.droppableId.replace('drop-slot-', ''));
            addSection(blockType, indexValue);
            return;
        }
    };

    const refreshPreview = useCallback(() => {
        const currentSrc = iframeSrc;
        setIframeSrc('');
        setTimeout(() => {
            setIframeSrc(currentSrc);
        }, 100);
        console.log('[VisualEditor Parent] Refreshing preview iframe');
    }, [iframeSrc]);

    return {
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
        sendToIframe,
        imagePicker,
        setImagePicker,
        handleImageSelect,
        pageMetadata,
        setPageMetadata,
        isSettingsOpen,
        setIsSettingsOpen,
        refreshPreview,
        frontendUrl
    };
}
