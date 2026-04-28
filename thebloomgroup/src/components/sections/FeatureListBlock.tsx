import { EditableElement } from '../admin/EditableElement';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { Settings2, Plus, Minus, Layout, Maximize2, MoveHorizontal } from 'lucide-react';
import { Button } from '../ui/button';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface FeatureListProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 1 | 2 | 3;
  padding?: 'none' | 'small' | 'medium' | 'large';
  sectionId?: string;
  iconSize?: number;
  iconPosition?: 'left' | 'top' | 'side';
  iconStyle?: 'square' | 'circle' | 'plain';
  iconSpacing?: number;
}

export const FeatureListBlock = ({ 
  title = "Features", 
  subtitle,
  items = [], 
  columns = 3, 
  padding = 'medium',
  sectionId,
  iconSize = 80,
  iconPosition = 'left',
  iconStyle = 'square',
  iconSpacing = 24
}: FeatureListProps) => {
  const { updateSectionProps, editMode, selectedSectionId } = useVisualEditor();
  
  const paddingClasses = {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-20',
    large: 'py-32'
  };

  const gridCols = {
    1: 'grid-cols-1 max-w-2xl mx-auto',
    2: 'grid-cols-1 md:grid-cols-2 lg:gap-12',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-10'
  };

  const handleUpdateItem = (index: number, key: keyof FeatureItem, value: string) => {
    if (!sectionId) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    updateSectionProps(sectionId, { items: newItems });
  };

  const getIconStyle = () => {
    if (iconStyle === 'plain') return '';
    return `rounded-${iconStyle === 'circle' ? 'full' : '2xl'} bg-gradient-to-br from-primary/10 to-primary/5 shadow-inner border border-primary/5`;
  };

  return (
    <div className={`relative bg-slate-50/50 ${paddingClasses[padding]} overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      {/* Floating Toolbar for Icons in Edit Mode */}
      {editMode && selectedSectionId === sectionId && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl p-2 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 px-3 border-r border-slate-200">
            <Maximize2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-slate-500 uppercase">Icon Size</span>
            <div className="flex items-center bg-slate-100 rounded-lg ml-2">
              <button 
                onClick={() => updateSectionProps(sectionId, { iconSize: Math.max(20, (Number(iconSize) || 80) - 10) })}
                className="p-2 hover:bg-primary/10 rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4 text-primary" />
              </button>
              <span className="px-3 text-sm font-mono font-bold min-w-[3rem] text-center">{iconSize || 80}px</span>
              <button 
                onClick={() => updateSectionProps(sectionId, { iconSize: Math.min(300, (Number(iconSize) || 80) + 10) })}
                className="p-2 hover:bg-primary/10 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 border-r border-slate-200">
            <Layout className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-slate-500 uppercase">Position</span>
            <div className="flex bg-slate-100 rounded-lg p-1 ml-2">
              {(['left', 'top', 'side'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => updateSectionProps(sectionId, { iconPosition: pos })}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    iconPosition === pos ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3">
            <MoveHorizontal className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-slate-500 uppercase">Spacing</span>
            <div className="flex items-center bg-slate-100 rounded-lg ml-2">
              <button 
                onClick={() => updateSectionProps(sectionId, { iconSpacing: Math.max(0, (Number(iconSpacing) || 24) - 4) })}
                className="p-2 hover:bg-primary/10 rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4 text-primary" />
              </button>
              <span className="px-2 text-sm font-mono font-bold min-w-[2rem] text-center">{iconSpacing || 24}px</span>
              <button 
                onClick={() => updateSectionProps(sectionId, { iconSpacing: Math.min(100, (Number(iconSpacing) || 24) + 4) })}
                className="p-2 hover:bg-primary/10 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-custom relative z-10">
        {(title || subtitle) && (
          <div className="max-w-3xl mx-auto mb-20">
            <EditableElement 
              tagName="h2" 
              fieldKey="title" 
              sectionId={sectionId} 
              defaultContent={title} 
              className="text-3xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight text-center" 
            />
            {subtitle && (
              <div className="flex justify-center">
                <div className="relative inline-block w-full">
                  <EditableElement 
                    tagName="div" 
                    fieldKey="subtitle" 
                    sectionId={sectionId} 
                    defaultContent={subtitle} 
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed" 
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {items.map((item, idx) => {
            const isTop = iconPosition === 'top';
            const isSide = iconPosition === 'side';
            const iconWidth = Number(iconSize) || 80;
            const spacing = Number(iconSpacing) || 24;

            return (
              <div 
                key={item.id} 
                className={`flex ${isSide ? 'flex-row' : 'flex-col'} p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden h-full`}
              >
                {/* Background accent on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
                
                <div className={`flex ${isTop ? 'flex-col items-center text-center' : 'flex-row items-center'} relative z-10 mb-6`} style={{ gap: spacing }}>
                  <div className="relative flex-shrink-0" style={{ width: iconWidth, height: iconWidth }}>
                    <EditableElement
                      type="image"
                      fieldKey={`items.${idx}.image`}
                      sectionId={sectionId}
                      defaultContent={item.icon || '/assets/icons/check.svg'}
                      onUpdate={(val) => handleUpdateItem(idx, 'icon' as any, val)}
                      className={`w-full h-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden ${getIconStyle()}`}
                    >
                      {item.icon && item.icon.startsWith('<svg') ? (
                        <div dangerouslySetInnerHTML={{ __html: item.icon }} style={{ width: '70%', height: '70%' }} />
                      ) : (
                        <img src={item.icon || '/assets/icons/check.svg'} className="w-full h-full object-contain p-2" alt="" />
                      )}
                    </EditableElement>
                    
                    {/* Decorative circle behind icon - only for non-plain style */}
                    {iconStyle !== 'plain' && (
                      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full scale-0 group-hover:scale-125 transition-transform duration-700 blur-xl" />
                    )}
                  </div>

                  <div className={isSide ? 'flex-grow' : ''}>
                    <EditableElement 
                      tagName="h3" 
                      fieldKey={`items.${idx}.title`} 
                      sectionId={sectionId} 
                      defaultContent={item.title} 
                      className={`text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors block leading-tight ${isTop ? 'mt-4' : ''}`} 
                      onUpdate={(val) => handleUpdateItem(idx, 'title', val)}
                    />
                    
                    {isSide && (
                      <div className="mt-4">
                        <EditableElement 
                          tagName="div" 
                          fieldKey={`items.${idx}.description`} 
                          sectionId={sectionId} 
                          defaultContent={item.description} 
                          className="text-muted-foreground leading-relaxed text-base md:text-lg block" 
                          onUpdate={(val) => handleUpdateItem(idx, 'description', val)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {!isSide && (
                  <div 
                    className="relative z-10" 
                    style={{ 
                      paddingLeft: iconPosition === 'left' ? (iconWidth + spacing) : 0,
                      textAlign: isTop ? 'center' : 'left'
                    }}
                  >
                    <EditableElement 
                      tagName="div" 
                      fieldKey={`items.${idx}.description`} 
                      sectionId={sectionId} 
                      defaultContent={item.description} 
                      className="text-muted-foreground leading-relaxed text-base md:text-lg block" 
                      onUpdate={(val) => handleUpdateItem(idx, 'description', val)}
                    />
                  </div>
                )}

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-700" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
