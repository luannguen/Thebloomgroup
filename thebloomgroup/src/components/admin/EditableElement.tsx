import React, { useRef, useEffect } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { useTranslation } from 'react-i18next';
import { getNestedValue } from '../../utils/objectUtils';

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
    slug 
  } = useVisualEditor();
  
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'vi';
  const isDefaultLang = currentLang === 'vi';
  
  // Logic mapping: title -> title_en, title_de, etc.
  const effectiveFieldKey = isDefaultLang ? fieldKey : `${fieldKey}_${currentLang}`;

  const [requesting, setRequesting] = React.useState(false);
  const contentRef = useRef<HTMLElement>(null);

  // Use explicit sectionId from props, fallback to context's selectedSectionId
  const effectiveSectionId = explicitSectionId || selectedSectionId;

  // Default tagName based on type if not provided
  const Tag = (tagName || (type === 'image' ? 'div' : 'span')) as any;

  // Find current content: try localized field first, then base field, then defaultContent
  let currentContent = defaultContent;
  
  // Helper to get value from props or global data
  const getValue = (key: string) => {
    // Try section props first
    if (effectiveSectionId && contentData.sections) {
      const section = contentData.sections.find((s: any) => s.id === effectiveSectionId);
      if (section && section.props) {
        const val = getNestedValue(section.props, key);
        if (val !== undefined) return val;
      }
    }
    // Then global contentData
    return getNestedValue(contentData, key);
  };

  const localizedValue = getValue(effectiveFieldKey);
  const baseValue = getValue(fieldKey);
  
  // Logic: localized > base > default
  currentContent = (localizedValue !== undefined && localizedValue !== "") ? localizedValue : (baseValue !== undefined ? baseValue : defaultContent);

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
    if (contentRef.current) {
      if (type === 'text' && contentRef.current.textContent !== currentContent) {
        contentRef.current.textContent = currentContent;
      } else if (type === 'rich-text' && contentRef.current.innerHTML !== currentContent) {
        contentRef.current.innerHTML = currentContent;
      }
    }
  }, [currentContent, type]);

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

  if (!editMode) {
    if (type === 'image') {
      const imgContent = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === 'img') {
          return React.cloneElement(child as React.ReactElement<any>, { src: currentContent });
        }
        return child;
      }) || <img src={currentContent} className="w-full h-full object-cover" alt="" />;
      
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
    if (type === 'rich-text') {
      return (
        <Tag 
          className={className} 
          dangerouslySetInnerHTML={{ __html: currentContent }} 
          style={style}
        />
      );
    }
    const displayContent = (type === 'text' && typeof currentContent === 'string') 
      ? t(currentContent, { defaultValue: currentContent }) 
      : currentContent;

    if (tagName === 'a') {
      return <Tag href={href} target={target} className={className} style={style}>{displayContent}</Tag>;
    }
    return <Tag className={className} style={style}>{displayContent}</Tag>;
  }

  // Edit Mode for Text / Rich Text
  if (type === 'text' || type === 'rich-text') {
    return (
      <Tag
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const newValue = type === 'rich-text' ? e.currentTarget.innerHTML : (e.currentTarget.textContent || '');
          handleContentUpdate(newValue);
        }}
        className={`outline-dashed outline-1 outline-blue-400 hover:outline-2 hover:bg-blue-50/50 transition-all cursor-text min-w-[20px] inline-block ${className}`}
        style={style}
      >
        {type === 'rich-text' ? null : currentContent}
      </Tag>
    );
  }

  // Edit Mode for Image
  return (
    <Tag
      className={`relative group cursor-pointer outline-dashed outline-1 outline-blue-400 hover:outline-2 transition-all ${className}`}
      style={style}
    >
      {/* Render children with dynamic updates for images */}
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;

        // Update <img> tags
        if (child.type === 'img') {
          return React.cloneElement(child as React.ReactElement<any>, { 
            src: currentContent 
          });
        }

        // Update <div> tags with backgroundImage if it's an image field
        if (type === 'image' && child.type === 'div') {
          const childStyle = (child.props as any).style || {};
          if (childStyle.backgroundImage) {
            return React.cloneElement(child as React.ReactElement<any>, {
              style: {
                ...childStyle,
                backgroundImage: `url(${currentContent})`
              }
            });
          }
        }

        return child;
      }) || (type === 'image' ? <img src={currentContent} className="w-full h-full object-cover" alt="" /> : null)}

      {/* Hover Overlay - Attached onClick here explicitly */}
      <div 
        onClick={handleImagePickerClick}
        className={`absolute inset-0 bg-blue-600/20 flex items-center justify-center transition-opacity z-30 ${requesting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
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
    </Tag>
  );
};
