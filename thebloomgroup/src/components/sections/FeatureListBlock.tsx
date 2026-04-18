import { EditableElement } from '../admin/EditableElement';
import { useVisualEditor } from '../../context/VisualEditorContext';

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
}

export const FeatureListBlock = ({ 
  title = "Features", 
  subtitle,
  items = [], 
  columns = 3, 
  padding = 'medium',
  sectionId
}: FeatureListProps) => {
  const { updateSectionProps } = useVisualEditor();
  
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

  return (
    <div className={`relative bg-slate-50/50 ${paddingClasses[padding]} overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="container-custom relative z-10">
        {(title || subtitle) && (
          <div className="max-w-3xl mx-auto text-center mb-20">
            <EditableElement 
              tagName="h2" 
              fieldKey="title" 
              sectionId={sectionId} 
              defaultContent={title} 
              className="text-3xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight" 
            />
            {subtitle && (
              <div className="relative inline-block">
                <EditableElement 
                  tagName="p" 
                  fieldKey="subtitle" 
                  sectionId={sectionId} 
                  defaultContent={subtitle} 
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed" 
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
              </div>
            )}
          </div>
        )}

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {items.map((item, idx) => (
            <div 
              key={item.id} 
              className="flex flex-col p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Background accent on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
              
              <div className="flex items-center gap-6 mb-6 relative z-10">
                <div className="relative flex-shrink-0">
                  <EditableElement
                    type="image"
                    fieldKey={`items.${idx}.image`}
                    sectionId={sectionId}
                    defaultContent={item.icon || '/assets/icons/check.svg'}
                    onUpdate={(val) => handleUpdateItem(idx, 'icon' as any, val)}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner overflow-hidden border border-primary/5"
                  >
                    {item.icon && item.icon.startsWith('<svg') ? (
                      <div dangerouslySetInnerHTML={{ __html: item.icon }} className="w-8 h-8 md:w-10 md:h-10" />
                    ) : (
                      <img src={item.icon || '/assets/icons/check.svg'} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="" />
                    )}
                  </EditableElement>
                  
                  {/* Decorative circle behind icon */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 blur-xl" />
                </div>

                <EditableElement 
                  tagName="h3" 
                  fieldKey={`items.${idx}.title`} 
                  sectionId={sectionId} 
                  defaultContent={item.title} 
                  className="text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors block leading-tight" 
                  onUpdate={(val) => handleUpdateItem(idx, 'title', val)}
                />
              </div>

              <div className="relative z-10 lg:pl-[calc(5rem+1.5rem)] md:pl-[calc(4rem+1.5rem)]">
                <EditableElement 
                  tagName="p" 
                  fieldKey={`items.${idx}.description`} 
                  sectionId={sectionId} 
                  defaultContent={item.description} 
                  className="text-muted-foreground leading-relaxed text-base md:text-lg block" 
                  onUpdate={(val) => handleUpdateItem(idx, 'description', val)}
                />
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
