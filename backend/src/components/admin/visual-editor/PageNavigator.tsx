import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Layers, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BLOCK_LIBRARY } from './BlockLibraryDef';

interface PageNavigatorProps {
    sections: any[];
    selectedSectionId: string | null;
    setSelectedSectionId: (id: string | null) => void;
    removeSection: (id: string) => void;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({
    sections,
    selectedSectionId,
    setSelectedSectionId,
    removeSection
}) => {
    return (
        <div className="flex-grow flex flex-col overflow-hidden bg-white h-full">
            <div className="flex-grow overflow-y-auto p-4 h-full">
                <Droppable droppableId="layers-list">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`space-y-1.5 min-h-[200px] transition-all duration-200 rounded-xl p-1 ${
                                    snapshot.isDraggingOver ? 'bg-slate-50 ring-2 ring-primary/20 ring-inset' : ''
                                }`}
                            >
                                {!sections || sections.length === 0 ? (
                                    <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                        <Layers className="h-6 w-6 text-slate-200 mx-auto mb-2" />
                                        <p className="text-[10px] font-medium text-slate-400">Trống - Hãy kéo khối vào đây hoặc Preview.</p>
                                    </div>
                                ) : (
                                    sections.map((section: any, index: number) => {
                                        const blockDef = BLOCK_LIBRARY.find(b => b.type === section.type);
                                        return (
                                            <Draggable key={section.id} draggableId={`layer-${section.id}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`group p-2.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer bg-white ${
                                                            snapshot.isDragging ? 'z-50 shadow-2xl border-primary scale-[1.02]' : 
                                                            selectedSectionId === section.id 
                                                            ? 'border-primary bg-primary/[0.02] shadow-sm' 
                                                            : 'border-slate-50 hover:border-slate-200'
                                                        }`}
                                                        onClick={() => setSelectedSectionId(section.id)}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-slate-300 group-hover:text-slate-400 p-1">
                                                            <GripVertical className="h-3.5 w-3.5" />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm">{blockDef?.icon}</span>
                                                                <p className="text-[11px] font-bold text-slate-700 truncate">
                                                                    {blockDef?.name || section.type}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeSection(section.id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
    );
};
