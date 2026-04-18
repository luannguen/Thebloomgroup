import React, { useState } from 'react';

interface EditWrapperProps {
  id: string;
  type: string;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  children: React.ReactNode;
}

export const EditWrapper = ({ id, type, isSelected, onSelect, onDelete, children }: EditWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative group transition-all duration-300 ${isHovered ? 'ring-2 ring-primary/40' : ''} ${isSelected ? 'ring-4 ring-primary ring-offset-2 z-20 shadow-2xl' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onSelect(id);
      }}
    >
      {/* Label/Toolbar when hovered or selected */}
      {(isHovered || isSelected) && (
        <div className={`absolute top-0 left-4 -translate-y-full px-3 py-1.5 text-[10px] font-bold text-white flex items-center gap-3 rounded-t-lg transition-all shadow-lg ${isSelected ? 'bg-primary' : 'bg-slate-700/90 backdrop-blur-sm'}`}>
          <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
             <span className="uppercase tracking-widest">{type}</span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/20 pl-2">
            {onDelete && (
              <button 
                title="Xóa block"
                className="hover:text-red-300 transition-colors p-0.5"
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Xóa khối này?')) {
                        onDelete(id);
                    }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Visual Overlay when selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none z-10" />
      )}

      {children}
    </div>
  );
};
