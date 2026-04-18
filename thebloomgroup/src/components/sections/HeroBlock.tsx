import { EditableElement } from '../admin/EditableElement';

interface HeroBlockProps {
  title: string;
  description: string;
  backgroundImage?: string;
  alignment?: 'left' | 'center';
  buttonText?: string;
  buttonLink?: string;
  button2Text?: string;
  button2Link?: string;
  badge?: string;
  sectionId?: string;
}

export const HeroBlock = ({ 
  title = "Hero Title", 
  description = "Hero description content goes here.",
  backgroundImage,
  alignment = 'left',
  sectionId,
  badge,
  buttonText,
  buttonLink,
  button2Text,
  button2Link
}: HeroBlockProps) => {
  return (
    <div className={`relative py-20 md:py-32 overflow-hidden ${backgroundImage ? 'text-white' : ''}`}>
      <div className="absolute inset-0 z-0">
        <EditableElement 
          type="image" 
          fieldKey="backgroundImage" 
          sectionId={sectionId} 
          defaultContent={backgroundImage || ""}
          className="w-full h-full"
        >
          <img src={backgroundImage || ""} className="w-full h-full object-cover" alt="" />
        </EditableElement>
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>
      <div className={`container-custom relative z-10 ${alignment === 'center' ? 'text-center items-center' : 'text-left'}`}>
        <div className={`max-w-3xl ${alignment === 'center' ? 'mx-auto' : ''}`}>
          {badge && (
            <EditableElement 
              tagName="span" 
              fieldKey="badge" 
              sectionId={sectionId} 
              defaultContent={badge} 
              className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10" 
            />
          )}
          <EditableElement 
            tagName="h1" 
            fieldKey="title" 
            sectionId={sectionId} 
            defaultContent={title} 
            className="text-4xl md:text-6xl font-extrabold mb-6 transition-all tracking-tight leading-tight" 
          />
          <EditableElement 
            tagName="p" 
            fieldKey="description" 
            sectionId={sectionId} 
            defaultContent={description} 
            className={`text-lg md:text-xl mb-8 opacity-90 max-w-2xl leading-relaxed ${alignment === 'center' ? 'mx-auto' : ''}`} 
          />
          <div className={`flex flex-wrap gap-4 items-center ${alignment === 'center' ? 'justify-center' : ''}`}>
            {buttonText && (
              <div className="inline-flex items-center">
                <EditableElement 
                  tagName="a" 
                  href={buttonLink}
                  fieldKey="buttonText" 
                  sectionId={sectionId} 
                  defaultContent={buttonText}
                  className="px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
                />
              </div>
            )}
            {button2Text && (
              <div className="inline-flex items-center">
                <EditableElement 
                  tagName="a" 
                  href={button2Link}
                  fieldKey="button2Text" 
                  sectionId={sectionId} 
                  defaultContent={button2Text}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/20 active:scale-95 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
