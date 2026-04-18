import React, { useState, useEffect } from 'react';
import { useVisualEditor } from '../../../context/VisualEditorContext';
import { getBlock } from './SectionRegistry';
import { EditWrapper } from './EditWrapper';
import NotFound from '../../../pages/NotFound';

export const VisualPageRenderer = ({ customSections }: { customSections?: any[] }) => {
    const { editMode, contentData, slug, syncSections, selectedSectionId, setSelectedSectionId, isPageActive } = useVisualEditor();

    // If page is inactive and not in edit mode, return 404
    if (!isPageActive && !editMode) {
        return <NotFound />;
    }

    // Smart selection: Use customSections if passed, otherwise use persistent contentData from database
    const sections = customSections || contentData?.sections || [];

    // Listen for messages from Admin (e.g., Select Section)
    useEffect(() => {
        // Hydrate context with initial sections if they are missing or provided as a fallback
        if (sections && sections.length > 0 && (!contentData.sections || contentData.sections.length === 0)) {
            syncSections(sections);
        }

        // Signal to parent that we are ready and provide current sections
        if (sections && sections.length > 0) {
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
                const sectionProps = section.props || section.data || {};
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
