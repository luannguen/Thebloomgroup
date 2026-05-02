import { EditableElement } from '../admin/EditableElement';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { FloatingToolbar } from '../admin/FloatingToolbar';

interface CardItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  link?: string;
  layout?: string;
}

interface CardBlockProps {
  items: CardItem[];
  columns?: 1 | 2 | 3 | 4;
  style?: 'elevated' | 'bordered' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  title?: string;
  sectionId?: string;
  iconSize?: number;
  iconSpacing?: number;
  layout?: 'top' | 'bottom' | 'left' | 'right' | 'middle' | 'image-left' | 'image-right' | 'image-top' | 'image-bottom' | 'image-middle';
}

export const CardBlock = ({ 
  items = [], 
  columns = 3, 
  style = 'elevated', 
  padding = 'medium',
  title,
  sectionId,
  iconSize = 48,
  iconSpacing = 24,
  layout = 'image-top'
}: CardBlockProps) => {
  const { updateSectionProps, editMode } = useVisualEditor();
  
  const paddingClasses = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const cardStyles = {
    elevated: 'bg-white shadow-md hover:shadow-xl',
    bordered: 'bg-white border border-gray-200 hover:border-primary/50',
    flat: 'bg-gray-50'
  };

  const handleUpdateItem = (index: number, key: string, value: any) => {
    if (!sectionId) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    updateSectionProps(sectionId, { items: newItems });
  };

  const iconWidth = Number(iconSize) || 48;
  const spacing = Number(iconSpacing) || 24;

  // Map legacy layout names to image- prefixed names for FloatingToolbar support
  const currentLayout = layout?.startsWith('image-') ? layout : `image-${layout || 'top'}`;


  return (
    <div className={`container-custom ${paddingClasses[padding]}`}>
      {title !== undefined && (
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId} 
          defaultContent={title} 
          className="text-3xl font-bold text-primary mb-12" 
        />
      )}
      <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-8`}>
        {items.map((item, idx) => {
          const itemLayout = (item.layout && item.layout !== 'default') ? item.layout : (layout || 'image-top');
          const isHorizontal = itemLayout === 'image-left' || itemLayout === 'left' || itemLayout === 'image-right' || itemLayout === 'right';
          const isReverse = itemLayout === 'image-right' || itemLayout === 'right' || itemLayout === 'image-bottom' || itemLayout === 'bottom';
          
          const renderItemMedia = () => (
            <div 
              className={`overflow-hidden transition-all duration-500 flex-shrink-0 flex items-center justify-center ${itemLayout === 'image-left' || itemLayout === 'left' ? 'mr-4' : (itemLayout === 'image-right' || itemLayout === 'right' ? 'ml-4' : '')}`}
              style={{ 
                height: item.image ? 'auto' : (iconWidth + 40), 
                width: isHorizontal ? (item.image ? '40%' : iconWidth + 40) : '100%',
                aspectRatio: item.image ? '16/9' : 'auto' 
              }}
            >
              <EditableElement 
                type="image" 
                fieldKey={`items.${idx}.image`} 
                sectionId={sectionId} 
                defaultContent={item.image || item.icon || '/assets/placeholder.svg'}
                onUpdate={(val) => handleUpdateItem(idx, item.image ? 'image' : 'icon' as any, val)}
                className="w-full h-full"
              >
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                ) : item.icon && item.icon.startsWith('<svg') ? (
                  <div dangerouslySetInnerHTML={{ __html: item.icon }} style={{ width: iconWidth, height: iconWidth }} className="text-primary" />
                ) : (
                  <img src={item.icon || '/assets/placeholder.svg'} style={{ width: iconWidth, height: iconWidth }} className="object-contain text-primary" alt="" />
                )}
              </EditableElement>
            </div>
          );

          return (
            <div 
              key={item.id || idx} 
              className={`rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group relative ${cardStyles[style as keyof typeof cardStyles]} 
                flex ${isHorizontal ? 'flex-row items-center p-4' : 'flex-col'}`}
            >
              {editMode && (
                <FloatingToolbar 
                  iconSize={iconWidth}
                  onIconSizeChange={(size) => updateSectionProps(sectionId!, { iconSize: size })}
                  iconSpacing={spacing}
                  onIconSpacingChange={(s) => updateSectionProps(sectionId!, { iconSpacing: s })}
                  iconPosition={itemLayout || layout || 'image-top'}
                  onIconPositionChange={(pos) => handleUpdateItem(idx, 'layout', pos)}
                  className="top-4"
                />
              )}

              {/* Media Rendering (Top or Left) */}
              {((itemLayout === 'image-top' || itemLayout === 'top' || !itemLayout) || (itemLayout === 'image-left' || itemLayout === 'left')) && renderItemMedia()}

              <div className={`flex-1 ${isHorizontal ? '' : 'p-6'}`} style={{ paddingTop: (!isHorizontal && !isReverse) ? spacing : undefined, paddingBottom: (!isHorizontal && isReverse) ? spacing : undefined }}>
                <EditableElement 
                  tagName="h3" 
                  fieldKey={`items.${idx}.title`} 
                  sectionId={sectionId} 
                  defaultContent={item.title} 
                  className="text-xl font-bold text-primary mb-3 block" 
                  onUpdate={(val) => handleUpdateItem(idx, 'title', val)}
                />

                {/* Middle Layout */}
                {(itemLayout === 'image-middle' || itemLayout === 'middle') && (
                  <div className="my-4">
                    {renderItemMedia()}
                  </div>
                )}

                <EditableElement 
                  tagName="p" 
                  fieldKey={`items.${idx}.description`} 
                  sectionId={sectionId} 
                  defaultContent={item.description} 
                  className="text-muted-foreground leading-relaxed block" 
                  onUpdate={(val) => handleUpdateItem(idx, 'description', val)}
                />
                
                {item.link && (
                  <div className="mt-4 inline-flex items-center text-secondary font-semibold hover:gap-2 transition-all cursor-pointer">
                    Chi tiết <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                )}
              </div>

              {/* Media Rendering (Bottom or Right) */}
              {((itemLayout === 'image-bottom' || itemLayout === 'bottom') || (itemLayout === 'image-right' || itemLayout === 'right')) && renderItemMedia()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

