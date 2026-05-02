import React from "react";
import { CheckCircle } from "lucide-react";
import { EditableElement } from "../admin/EditableElement";
import { useVisualEditor } from "../../context/VisualEditorContext";
import { FloatingToolbar } from "../admin/FloatingToolbar";

interface ImageItem {
  url: string;
}

interface MediaSectionProps {
  title?: string;
  description?: string;
  image?: string;
  images?: ImageItem[];
  layout?: "image-left" | "image-right" | "image-top" | "image-bottom" | "image-middle";
  imageWidth?: number; // percentage (e.g. 50 for 50%)
  padding?: "none" | "small" | "medium" | "large";
  bgColor?: "white" | "muted" | "primary-light";
  sectionId?: string;
  features?: string[];
  content?: string; // Legacy support from ContentBlock
  iconSize?: number;
}

export const MediaSectionBlock = ({
  title = "Section Title",
  description = "Content for this media section goes here.",
  content,
  image = "https://via.placeholder.com/800x450",
  images = [],
  layout = "image-right",
  imageWidth = 50,
  padding = "medium",
  bgColor = "white",
  sectionId,
  features = [],
  iconSize = 400
}: MediaSectionProps) => {
  const { editMode, updateSectionProps } = useVisualEditor();
  const paddingClasses = {
    none: "py-0",
    small: "py-8",
    medium: "py-16",
    large: "py-24"
  };

  const bgClasses = {
    white: "bg-white",
    muted: "bg-muted",
    "primary-light": "bg-primary/5"
  };

  const isVertical = layout === "image-top" || layout === "image-bottom" || layout === "image-middle";
  const isImageRight = layout === "image-right";

  // Combine image and images for backward compatibility
  const displayImages = images && images.length > 0 
    ? images 
    : (image ? [{ url: image }] : []);

  // Use either new description or legacy content
  const displayDescription = description || content || "Content for this media section goes here.";

  const renderMediaGrid = () => {
    if (displayImages.length === 0) return null;

    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-2" // 2x2 grid for 4 images
    }[displayImages.length] || "grid-cols-1";

    return (
      <div className={`grid ${gridCols} gap-4 w-full h-full`}>
        {displayImages.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative group">
            {editMode && (
              <FloatingToolbar 
                iconSize={iconSize || 400}
                onIconSizeChange={(s) => updateSectionProps(sectionId!, { iconSize: s })}
                iconPosition={layout}
                onIconPositionChange={(pos) => updateSectionProps(sectionId!, { layout: pos })}
                className="-top-16 left-1/2 -translate-x-1/2"
              />
            )}
            <EditableElement
              type="image"
              fieldKey={images && images.length > 0 ? `images.${idx}.url` : "image"}
              sectionId={sectionId}
              defaultContent={img.url}
              className="shadow-xl overflow-hidden mx-auto rounded-lg"
              style={{ 
                width: isVertical ? '100%' : (iconSize ? `${iconSize}px` : '100%'),
                maxWidth: '100%'
              }}
            >
              <img src={img.url} className="w-full h-auto object-cover" alt={`${title} ${idx + 1}`} />
            </EditableElement>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => (
    <div className={`${isVertical ? "w-full" : ""} ${layout === "image-bottom" ? "order-1" : (layout === "image-right" ? "order-1" : "order-2")}`}>
      {title && (
        <EditableElement
          tagName="h2"
          fieldKey="title"
          sectionId={sectionId}
          defaultContent={title}
          className="text-3xl md:text-4xl font-bold text-primary mb-6"
        />
      )}

      {/* Middle layout special rendering */}
      {layout === 'image-middle' && (
        <div className="mb-8">
          {renderMediaGrid()}
        </div>
      )}

      <EditableElement
        tagName="div"
        fieldKey="description"
        type="rich-text"
        sectionId={sectionId}
        defaultContent={displayDescription}
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-secondary text-muted-foreground leading-relaxed"
      />

      {/* Features list */}
      {features && Array.isArray(features) && features.length > 0 && (
        <ul className="grid sm:grid-cols-2 gap-4 mt-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start bg-gray-50/50 p-3 border border-transparent hover:border-primary/10 transition-colors text-left">
              <CheckCircle size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section className={`${bgClasses[bgColor as keyof typeof bgClasses]} ${paddingClasses[padding as keyof typeof paddingClasses]}`}>
      <div className="container-custom">
        {layout === 'image-middle' ? (
          renderContent()
        ) : (
          <div 
            className={`flex ${isVertical ? "flex-col" : "grid"} gap-8 md:gap-12 items-center`}
            style={!isVertical ? { gridTemplateColumns: isImageRight ? `1fr ${imageWidth}%` : `${imageWidth}% 1fr` } : {}}
          >
            {/* Media Column */}
            <div className={`${isVertical ? "w-full" : ""} ${layout === "image-bottom" ? "order-2" : (layout === "image-right" ? "order-2" : "order-1")}`}>
              {renderMediaGrid()}
            </div>

            {/* Content Column */}
            {renderContent()}
          </div>
        )}
      </div>
    </section>
  );
};
