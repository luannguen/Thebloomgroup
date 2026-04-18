import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';

interface PreviewAreaProps {
    iframeRef: React.RefObject<HTMLIFrameElement>;
    iframeSrc: string;
    viewMode: 'desktop' | 'tablet' | 'mobile';
    isDragging: boolean;
    sections: any[];
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
    iframeRef,
    iframeSrc,
    viewMode,
    isDragging,
    sections = []
}) => {
    // Generate drop slots: one before each section, and one at the very end
    const dropSlots = [];
    for (let i = 0; i <= (sections?.length || 0); i++) {
        dropSlots.push(i);
    }

    return (
        <div className="flex-grow h-full w-full overflow-hidden bg-slate-200/30 flex items-center justify-center relative p-4 lg:p-8">
            <div 
                className={`bg-white shadow-2xl transition-all duration-300 h-full relative overflow-hidden rounded-lg border border-slate-200 ${
                    viewMode === 'desktop' ? 'w-full' : 
                    viewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                }`}
            >
                {/* Drag and Drop Overlay for Preview */}
                <div className={`absolute inset-0 z-50 flex flex-col p-4 transition-opacity duration-200 ${
                    isDragging ? 'opacity-100 pointer-events-auto bg-primary/5 backdrop-blur-[2px]' : 'opacity-0 pointer-events-none'
                }`}>
                    <div className="flex-grow flex flex-col gap-2 py-4 overflow-y-auto no-scrollbar">
                        {dropSlots.map((index) => (
                            <React.Fragment key={`slot-wrapper-${index}`}>
                                <Droppable droppableId={`drop-slot-${index}`}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`h-10 rounded-xl border-2 border-dashed transition-all flex items-center justify-center mb-2 ${
                                                snapshot.isDraggingOver 
                                                ? 'border-primary bg-primary/20 h-24 ring-4 ring-primary/10 shadow-lg' 
                                                : 'border-primary/30 bg-white/80 hover:border-primary/50 hover:bg-white shadow-sm'
                                            }`}
                                        >
                                            <div className={`flex flex-col items-center gap-1 transition-all ${
                                                snapshot.isDraggingOver ? 'scale-110' : 'scale-90 opacity-60'
                                            }`}>
                                                <Plus className={`h-4 w-4 text-primary ${snapshot.isDraggingOver ? 'animate-bounce' : ''}`} />
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                    Thả vào vị trí {index + 1}
                                                </span>
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                
                                {index < sections.length && (
                                    <div className="h-16 w-full bg-slate-100/40 rounded-lg border border-slate-200/30 flex items-center justify-center mb-2 backdrop-blur-sm">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Hiện tại</span>
                                            <span className="text-[11px] text-slate-500 font-medium px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100">
                                                {sections[index].type}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <iframe 
                    ref={iframeRef}
                    src={iframeSrc} 
                    className={`w-full h-full border-none pointer-events-auto transition-all duration-500 ${isDragging ? 'grayscale-[0.5] opacity-30 scale-[0.98] blur-[1px]' : ''}`}
                    title="Visual Editor Preview"
                />
            </div>
        </div>
    );
};
