import React, { useRef, useEffect } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { useTranslation } from 'react-i18next';
import { getNestedValue } from '../../utils/objectUtils';

const escapeHtml = (unsafe: any) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
};

interface EditableElementProps {
  fieldKey: string;
  defaultContent: string;
  type?: 'text' | 'image' | 'rich-text';
  className?: string;
  tagName?: keyof JSX.IntrinsicElements;
  sectionId?: string; // Explicit section ID prop
  children?: React.ReactNode;
  onUpdate?: (value: string) => void; // Optional custom update handler
  href?: string; // Tích hợp link
  target?: string;
  style?: React.CSSProperties;
}

export const EditableElement = ({
  fieldKey,
  defaultContent,
  type = 'text',
  className = '',
  tagName,
  sectionId: explicitSectionId,
  children,
  onUpdate,
  href,
  target,
  style,
}: EditableElementProps) => {
  const { 
    editMode, 
    contentData, 
    updateField, 
    updateSectionProps,
    requestImageChange, 
    selectedSectionId, 
    selectSection,
    slug 
  } = useVisualEditor();
  
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'vi';
  const isDefaultLang = currentLang === 'vi';
  
  // Logic mapping: title -> title_en, title_de, etc.
  const effectiveFieldKey = isDefaultLang ? fieldKey : `${fieldKey}_${currentLang}`;

  const [requesting, setRequesting] = React.useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const isFocused = useRef<boolean>(false);

  // Use explicit sectionId from props, fallback to context's selectedSectionId
  const effectiveSectionId = explicitSectionId || selectedSectionId;

  // Default tagName based on type if not provided
  const Tag = (tagName || (type === 'image' ? 'div' : 'span')) as any;

  // Helper to get value from context's contentData
  const getValue = (key: string) => {
    if (!contentData) return undefined;
    
    // 1. Try finding in Global contentData FIRST (like Title/Subtitle)
    const globalVal = getNestedValue(contentData, key);
    if (globalVal !== undefined && globalVal !== null && globalVal !== "") return globalVal;

    // 2. Try finding in sections array if we have an ID
    if (effectiveSectionId && contentData.sections) {
      const section = contentData.sections.find((s: any) => s.id === effectiveSectionId || s._id === effectiveSectionId);
      if (section) {
        const val = getNestedValue(section.props || section.data || {}, key);
        if (val !== undefined) return val;
      }
    }
    
    return undefined;
  };

  const baseValue = getValue(fieldKey);
  const localizedValue = isDefaultLang ? undefined : getValue(effectiveFieldKey);
  
  // Validation function
  const isValid = (val: any) => val !== undefined && val !== null && val !== "" && val !== "undefined";
  
  // CRITICAL: Priority resolution
  let currentContent = defaultContent;
  if (isValid(localizedValue)) {
    currentContent = localizedValue;
  } else if (isValid(baseValue)) {
    currentContent = baseValue;
  }

  // Auto-upgrade text to rich-text if it contains HTML (from new Admin Quill Editor)
  const isHtml = typeof currentContent === 'string' && /<[a-z][\s\S]*>/i.test(currentContent);
  const effectiveType = (type === 'text' && isHtml) ? 'rich-text' : type;

  // Use initial content to prevent React from re-rendering the text node and losing cursor position
  const [initialContent] = React.useState(currentContent);

  // Handle data updates
  const handleContentUpdate = (value: string) => {
    if (onUpdate) {
      onUpdate(value);
      return;
    }

    if (effectiveSectionId) {
      updateSectionProps(effectiveSectionId, { [effectiveFieldKey]: value });
    } else {
      updateField(effectiveFieldKey, value);
    }
  };

  const handleImagePickerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`[EditableElement] Clicked for:`, {
      fieldKey,
      sectionId: effectiveSectionId,
      slug
    });

    if (effectiveSectionId) {
      selectSection(effectiveSectionId);
    }

    setRequesting(true);
    
    try {
      const messageData = {
        type: 'VISUAL_EDIT_PICK_IMAGE',
        fieldKey,
        sectionId: effectiveSectionId,
        slug
      };

      // Call standard requestImageChange
      if (typeof requestImageChange === 'function') {
        requestImageChange(fieldKey, effectiveSectionId);
      }
      
      // Dispatch to parent & top as backup
      window.parent.postMessage(messageData, '*');
      if (window.top !== window.parent) {
        window.top?.postMessage(messageData, '*');
      }

      // alert('Đã gửi yêu cầu thay ảnh tới hệ thống cha. Đang chờ phản hồi...');

      // Auto-reset requesting if it takes too long
      setTimeout(() => setRequesting(false), 8000);
    } catch (err) {
      console.error('[EditableElement] Failed to request image change:', err);
      alert('Không thể mở trình chọn ảnh: ' + (err as Error).message);
      setRequesting(false);
    }
  };

  // Sync ref when not in focus (only for text and rich-text)
  useEffect(() => {
    if (contentRef.current && !isFocused.current) {
      if (effectiveType === 'text' && contentRef.current.textContent !== currentContent) {
        contentRef.current.textContent = currentContent;
      } else if (effectiveType === 'rich-text' && contentRef.current.innerHTML !== currentContent) {
        contentRef.current.innerHTML = currentContent;
      }
    }
  }, [currentContent, effectiveType]);

  // Reset requesting when image is selected via message
  useEffect(() => {
    if (!requesting || type !== 'image') return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data?.data || event.data || {};
      const { type: msgType } = event.data || {};
      const { fieldKey: respKey, sectionId: respId, id: respIdAlt, section_id: respSid, sections } = data;
      const effectiveRespId = respId || respIdAlt || respSid;
      
      // Stop requesting on image selection confirmation OR on general data updates
      const isImageSelected = msgType === 'VISUAL_EDIT_IMAGE_SELECTED' && respKey === fieldKey;
      const isDataUpdate = msgType === 'VISUAL_EDIT_UPDATE_DATA' || msgType === 'VISUAL_EDIT_UPDATE_SECTION_PROPS';
      
      if (isImageSelected || isDataUpdate) {
        // If it's a specific image selection, match ID and key
        if (isImageSelected && (!effectiveRespId || effectiveRespId === effectiveSectionId)) {
          setRequesting(false);
        } 
        // If it's a general data update, if it targets our section or is a global update (sections array present)
        else if (isDataUpdate && (effectiveRespId === effectiveSectionId || !!sections)) {
          setRequesting(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [requesting, fieldKey, effectiveSectionId, type]);

  // Reset requesting if content changed (as a fallback)
  useEffect(() => {
    if (type === 'image' && currentContent !== defaultContent) {
      setRequesting(false);
    }
  }, [currentContent, defaultContent, type]);
  
  // Helper to recursively update children props (e.g. for images/backgrounds)
  const injectContentProps = (nodes: React.ReactNode): React.ReactNode => {
    return React.Children.map(nodes, (child) => {
      if (!React.isValidElement(child)) return child;

      let updatedProps: any = { ...child.props };
      let hasUpdates = false;

      // 1. Check for <img> tags
      if (child.type === 'img') {
        updatedProps.src = currentContent;
        hasUpdates = true;
      }

      // 2. Check for <div> with backgroundImage
      if (child.type === 'div' && updatedProps.style?.backgroundImage) {
        updatedProps.style = {
          ...updatedProps.style,
          backgroundImage: `url(${currentContent})`
        };
        hasUpdates = true;
      }

      // 3. Recursively check children
      if (child.props.children) {
        const updatedChildren = injectContentProps(child.props.children);
        if (updatedChildren !== child.props.children) {
          updatedProps.children = updatedChildren;
          hasUpdates = true;
        }
      }

      return hasUpdates ? React.cloneElement(child, updatedProps) : child;
    });
  };

  if (!editMode) {
    if (effectiveType === 'image') {
      const imgContent = injectContentProps(children) || <img src={currentContent} className="w-full h-full object-cover" alt="" />;
      
      // If no className is provided, avoid extra wrapper which might break some layouts (like RefrigerationBlock)
      if (!className) {
        return imgContent;
      }

      return (
        <Tag className={`relative w-full h-full ${className}`} style={style}>
          {imgContent}
        </Tag>
      );
    }
    if (effectiveType === 'rich-text') {
      return (
        <Tag 
          className={className} 
          dangerouslySetInnerHTML={{ __html: currentContent }} 
          style={style}
        />
      );
    }
    const displayContent = (effectiveType === 'text' && typeof currentContent === 'string') 
      ? t(currentContent, { defaultValue: currentContent }) 
      : currentContent;

    if (tagName === 'a') {
      return <Tag href={href} target={target} className={className} style={style}>{displayContent}</Tag>;
    }
    return <Tag className={className} style={style}>{displayContent}</Tag>;
  }

  // Edit Mode for Text / Rich Text
  if (effectiveType === 'text' || effectiveType === 'rich-text') {
    // If children are provided, we want to render them but make them editable
    // This allows the component to react to external prop changes (like from the Parent Block)
    return (
      <Tag
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onClick={(e: React.MouseEvent) => {
          if (!editMode) return;
          e.stopPropagation();
          if (effectiveSectionId) {
            selectSection(effectiveSectionId);
          }
        }}
        onFocus={() => {
          isFocused.current = true;
        }}
        onInput={(e: React.FormEvent<HTMLElement>) => {
          const newValue = effectiveType === 'rich-text' ? e.currentTarget.innerHTML : (e.currentTarget.textContent || '');
          handleContentUpdate(newValue);
        }}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          isFocused.current = false;
          const newValue = effectiveType === 'rich-text' ? e.currentTarget.innerHTML : (e.currentTarget.textContent || '');
          handleContentUpdate(newValue);
        }}
        className={`${className} outline-none focus:ring-2 focus:ring-primary/50 focus:bg-primary/5 transition-all min-w-[20px] min-h-[1em]`}
        style={style}
        dangerouslySetInnerHTML={{ __html: effectiveType === 'rich-text' ? initialContent : escapeHtml(initialContent) }}
      />
    );
  }

  // Edit Mode for Image
  // Nếu Tag là 'img', chúng ta phải đổi nó thành 'div' vì <img> không thể chứa children (overlay)
  const ImageWrapperTag = Tag === 'img' ? 'div' : Tag;

  return (
    <ImageWrapperTag
      data-field-key={fieldKey}
      data-section-id={effectiveSectionId}
      className={`relative group cursor-pointer outline-dashed outline-2 transition-all ${
        selectedSectionId === effectiveSectionId 
          ? 'outline-blue-500 bg-blue-50/10' 
          : 'outline-green-500/50 hover:outline-green-600 hover:bg-green-50/20'
      } ${className}`}
      style={{ ...style, minHeight: Tag === 'img' ? '40px' : undefined }}
    >
      {/* Render children with dynamic updates for images */}
      {injectContentProps(children) || (effectiveType === 'image' ? <img src={currentContent} className="w-full h-full object-cover" alt="" /> : null)}

      {/* Hover Overlay - Attached onClick here explicitly */}
      <div 
        onClick={handleImagePickerClick}
        className={`absolute inset-0 bg-blue-600/20 flex items-center justify-center transition-opacity z-[9999] cursor-pointer pointer-events-auto ${requesting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <div className="bg-white/90 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105 active:scale-95 border-2 border-blue-500">
          {requesting ? (
            <>
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-blue-600">Đang chuẩn bị...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-tight">Thay đổi ảnh</span>
            </>
          )}
        </div>
      </div>
    </ImageWrapperTag>
  );
};
