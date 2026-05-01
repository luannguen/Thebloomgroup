import React from 'react';
import { Minus, Plus, Layout, ArrowLeft, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';

interface FloatingToolbarProps {
  iconSize: number;
  onIconSizeChange: (size: number) => void;
  iconPosition?: string;
  onIconPositionChange?: (pos: string) => void;
  iconSpacing?: number;
  onIconSpacingChange?: (spacing: number) => void;
  className?: string;
  maxSize?: number;
  minSize?: number;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  iconSize,
  onIconSizeChange,
  iconPosition,
  onIconPositionChange,
  iconSpacing,
  onIconSpacingChange,
  className = "",
  maxSize = 1200,
  minSize = 20
}) => {
  return (
    <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-full px-4 py-1.5 flex items-center gap-3 z-[10001] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto scale-90 group-hover:scale-100 ${className}`}>
      <div className="flex items-center gap-1 border-r border-slate-100 pr-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Size</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onIconSizeChange(Math.max(minSize, iconSize - 10)); }}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <Minus size={14} />
        </button>
        <span className="text-xs font-bold text-primary min-w-[24px] text-center">{iconSize}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onIconSizeChange(Math.min(maxSize, iconSize + 10)); }}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <Plus size={14} />
        </button>
      </div>

      {onIconSpacingChange && iconSpacing !== undefined && (
        <div className="flex items-center gap-1 border-r border-slate-100 pr-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gap</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onIconSpacingChange(Math.max(0, iconSpacing - 4)); }}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs font-bold text-primary min-w-[24px] text-center">{iconSpacing}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onIconSpacingChange(Math.min(100, iconSpacing + 4)); }}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      {onIconPositionChange && (
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pos</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onIconPositionChange(iconPosition === 'top' ? 'left' : 'top'); }}
            className={`p-1.5 rounded-lg transition-all ${iconPosition === 'top' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}`}
            title="Chuyển vị trí Icon"
          >
            {iconPosition === 'top' ? <ArrowUp size={14} /> : <ArrowLeft size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};
