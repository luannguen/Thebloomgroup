import React, { useState, useEffect } from 'react';
import { useVisualEditor } from '../../../context/VisualEditorContext';
import { getBlock } from './SectionRegistry';
import { EditWrapper } from './EditWrapper';
import NotFound from '../../../pages/NotFound';

export const VisualPageRenderer = ({ customSections }: { customSections?: any[] }) => {
    const { editMode, contentData, slug, syncSections, selectedSectionId, setSelectedSectionId, isPageActive, isLoading } = useVisualEditor();

    // If page is inactive and not in edit mode, return 404
    if (!isPageActive && !editMode) {
        return <NotFound />;
    }

    // Smart selection: Use persistent contentData from context if available (source of truth for live edits)
    // Otherwise fallback to customSections (initial/default data)
    const sections = (contentData?.sections && contentData.sections.length > 0) 
        ? contentData.sections 
        : (customSections || []);

    // Listen for messages from Admin (e.g., Select Section)
    useEffect(() => {
        // Hydrate context with initial sections if they are missing or provided as a fallback
        if (sections && sections.length > 0 && (!contentData.sections || contentData.sections.length === 0)) {
            syncSections(sections);
        }

        // Signal to parent that we are ready and provide current sections
        // ONLY if not loading and we truly have sections to sync
        if (!isLoading && sections && sections.length > 0) {
            window.parent.postMessage({ 
                type: 'VISUAL_EDIT_SYNC_SECTIONS', 
                sections,
                slug
            }, '*');
        }

        const handleMessage = (event: MessageEvent) => {
            if (!event.data) return;
            const { type, sectionId } = event.data;
            if (type === 'VISUAL_EDIT_SELECT_SECTION') {
                setSelectedSectionId(sectionId);
                const el = document.getElementById(`section-${sectionId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [sections, contentData.sections, syncSections, slug, setSelectedSectionId]);

    const handleSectionSelect = (id: string, type: string) => {
        setSelectedSectionId(id);
        
        // Notify the Admin (parent window) that a section was selected in the preview
        window.parent.postMessage({
            type: 'VISUAL_EDIT_SECTION_SELECTED',
            sectionId: id,
            sectionType: type,
            slug
        }, '*');
    };

    const handleRemoveSection = (sectionId: string) => {
        window.parent.postMessage({
            type: 'VISUAL_EDIT_REMOVE_SECTION',
            sectionId
        }, '*');
    };

    if (!sections || sections.length === 0) {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            );
        }
        return (
            <div className="py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg m-8">
                <p className="text-muted-foreground">This page is empty. Start adding sections!</p>
            </div>
        );
    }

    return (
        <div className="page-builder-canvas space-y-0">
            {sections.map((section: any, index: number) => {
                const blockDef = getBlock(section.type);
                if (!blockDef) {
                    return (
                        <div key={section.id || index} className="p-4 bg-red-50 text-red-600 border border-red-200">
                            Error: Unknown block type "{section.type}"
                        </div>
                    );
                }

                const Component = blockDef.component;
                const sectionId = section.id;

                // Support both new 'props' format and legacy 'data' format
                const dbProps = section.props || section.data || {};
                
                // Merge defaultProps from registry with database props
                // This ensures components have data even if not yet edited in DB
                const sectionProps = {
                    ...(blockDef.defaultProps || {}),
                    ...dbProps
                };
                const content = (
                    <section id={`section-${sectionId}`} className="visual-builder-section">
                        <Component sectionId={sectionId} {...sectionProps} />
                    </section>
                );

                if (editMode) {
                    return (
                        <EditWrapper 
                            key={sectionId} 
                            id={sectionId} 
                            type={section.type}
                            isSelected={selectedSectionId === sectionId}
                            onSelect={(id) => handleSectionSelect(id, section.type)}
                            onDelete={handleRemoveSection}
                        >
                            {content}
                        </EditWrapper>
                    );
                }

                return (
                    <React.Fragment key={sectionId}>
                        {content}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
