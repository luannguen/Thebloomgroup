import { EditableElement } from '../admin/EditableElement';
import { useVisualEditor } from '../../context/VisualEditorContext';

interface CardItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  link?: string;
}

interface CardBlockProps {
  items: CardItem[];
  columns?: 1 | 2 | 3 | 4;
  style?: 'elevated' | 'bordered' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  title?: string;
  sectionId?: string;
}

export const CardBlock = ({ 
  items = [], 
  columns = 3, 
  style = 'elevated', 
  padding = 'medium',
  title,
  sectionId
}: CardBlockProps) => {
  const { updateSectionProps } = useVisualEditor();
  
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

  const handleUpdateItem = (index: number, key: keyof CardItem, value: string) => {
    if (!sectionId) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    updateSectionProps(sectionId, { items: newItems });
  };

  return (
    <div className={`container-custom ${paddingClasses[padding]}`}>
      {title !== undefined && (
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId} 
          defaultContent={title} 
          className="text-3xl font-bold text-primary mb-12 text-center" 
        />
      )}
      <div className={`grid ${gridCols[columns]} gap-8`}>
        {items.map((item, idx) => (
          <div 
            key={item.id || idx} 
            className={`rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${cardStyles[style]}`}
          >
            <div className="aspect-video overflow-hidden bg-primary/5 flex items-center justify-center">
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
                  <div dangerouslySetInnerHTML={{ __html: item.icon }} className="w-12 h-12 text-primary" />
                ) : (
                  <img src={item.icon || '/assets/placeholder.svg'} className="w-12 h-12 object-contain text-primary" alt="" />
                )}
              </EditableElement>
            </div>
            <div className="p-6">
              <EditableElement 
                tagName="h3" 
                fieldKey={`items.${idx}.title`} 
                sectionId={sectionId} 
                defaultContent={item.title} 
                className="text-xl font-bold text-primary mb-3 block" 
                onUpdate={(val) => handleUpdateItem(idx, 'title', val)}
              />
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
          </div>
        ))}
      </div>
    </div>
  );
};
