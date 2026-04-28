import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { BLOCK_LIBRARY } from './BlockLibraryDef';

export const BlockLibrary: React.FC = () => {
    // Group blocks by category
    const categories = BLOCK_LIBRARY.reduce((acc, block) => {
        const cat = block.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(block);
        return acc;
    }, {} as Record<string, typeof BLOCK_LIBRARY>);

    // Order categories logically
    const categoryOrder = ['Basic', 'Homepage', 'About Us V2', 'About Us', 'Industry & Tech', 'Corporate', 'General'];
    const sortedCategories = Object.keys(categories).sort((a, b) => {
        const idxA = categoryOrder.indexOf(a);
        const idxB = categoryOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <div className="flex-grow overflow-y-auto custom-scrollbar p-3">
                <Droppable droppableId="blocks-palette" isDropDisabled={true}>
                    {(provided) => (
                        <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                            className="space-y-6"
                        >
                            {sortedCategories.map((catName) => (
                                <div key={catName} className="space-y-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                                        {catName}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories[catName].map((block) => {
                                            // Calculate actual index in the original flat array for DnD
                                            const originalIndex = BLOCK_LIBRARY.findIndex(b => b.type === block.type);
                                            
                                            return (
                                                <Draggable 
                                                    key={`block-${block.type}`} 
                                                    draggableId={`block-${block.type}`} 
                                                    index={originalIndex}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex flex-col items-center justify-center p-2.5 text-center bg-white border border-slate-100 rounded-xl hover:border-primary hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${
                                                                snapshot.isDragging ? 'z-50 shadow-2xl border-primary ring-2 ring-primary/20' : ''
                                                            }`}
                                                            title={block.name}
                                                        >
                                                            <div className="w-10 h-10 flex items-center justify-center text-xl bg-slate-50 rounded-lg mb-1.5 group-hover:bg-primary/5 transition-colors">
                                                                {block.icon}
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-slate-600 truncate w-full px-1">
                                                                {block.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};
