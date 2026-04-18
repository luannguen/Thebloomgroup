import { getBlock } from '../admin/builder/SectionRegistry';

interface SectionProps {
    id: string;
    type: string;
    props: any;
}

interface VisualSectionRendererProps {
    sections: SectionProps[];
    isEditMode?: boolean;
}

export const VisualSectionRenderer: React.FC<VisualSectionRendererProps> = ({ 
    sections, 
    isEditMode = false 
}) => {
    return (
        <div className="flex flex-col">
            {sections.map((section, index) => (
                <EditableSectionWrapper 
                    key={section.id || `section-${index}`} 
                    id={section.id} 
                    isEditMode={isEditMode}
                >
                    <SectionDispatcher section={section} />
                </EditableSectionWrapper>
            ))}
        </div>
    );
};

const SectionDispatcher: React.FC<{ section: SectionProps }> = ({ section }) => {
    const blockDef = getBlock(section.type);

    if (!blockDef) {
        return (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-red-200 bg-red-50/30 m-4 rounded-xl">
                <span className="font-semibold text-red-500">Khối không xác định:</span> {section.type}
            </div>
        );
    }

    const Component = blockDef.component;
    return <Component sectionId={section.id} {...(section.props || {})} />;
};


const EditableSectionWrapper: React.FC<{ 
    id: string; 
    isEditMode: boolean; 
    children: React.ReactNode 
}> = ({ id, isEditMode, children }) => {
    const handleSelect = () => {
        if (!isEditMode) return;
        window.parent.postMessage({ 
            type: 'VISUAL_EDIT_SECTION_SELECTED', 
            sectionId: id 
        }, '*');
    };

    if (!isEditMode) return <>{children}</>;

    return (
        <div 
            className="group relative cursor-pointer hover:ring-2 hover:ring-primary transition-all rounded-sm"
            onClick={handleSelect}
            data-section-id={id}
        >
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-2 py-0.5 opacity-0 group-hover:opacity-100 z-10 font-bold uppercase tracking-wider">
                Section
            </div>
            {children}
        </div>
    );
};
