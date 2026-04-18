import { EditableElement } from '../admin/EditableElement';

interface RichTextBlockProps {
  content: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: string;
  className?: string;
  sectionId?: string;
}

export const RichTextBlock = ({ 
  content = "Enter content here...", 
  padding = 'medium',
  maxWidth = '800px',
  className = '',
  sectionId
}: RichTextBlockProps) => {
  const paddingClasses = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  };

  return (
    <div className={`container-custom ${paddingClasses[padding]} ${className}`}>
      <div style={{ maxWidth: maxWidth }} className="mx-auto">
        <EditableElement 
          tagName="div" 
          fieldKey="content" 
          type="rich-text"
          sectionId={sectionId} 
          defaultContent={content}
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-secondary"
        />
      </div>
    </div>
  );
};
