import React from "react";
import { CheckCircle } from "lucide-react";
import { EditableElement } from "../admin/EditableElement";

interface MediaSectionProps {
  title?: string;
  description?: string;
  image?: string;
  layout?: "image-left" | "image-right" | "image-top" | "image-bottom";
  imageWidth?: number; // percentage (e.g. 50 for 50%)
  padding?: "none" | "small" | "medium" | "large";
  bgColor?: "white" | "muted" | "primary-light";
  sectionId?: string;
  features?: string[];
  content?: string; // Legacy support from ContentBlock
}

export const MediaSectionBlock = ({
  title = "Section Title",
  description = "Content for this media section goes here.",
  content,
  image = "https://via.placeholder.com/800x450",
  layout = "image-right",
  imageWidth = 50,
  padding = "medium",
  bgColor = "white",
  sectionId,
  features = []
}: MediaSectionProps) => {
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

  const isVertical = layout === "image-top" || layout === "image-bottom";
  const isImageRight = layout === "image-right";

  // Use either new description or legacy content
  const displayDescription = description || content || "Content for this media section goes here.";

  return (
    <section className={`${bgClasses[bgColor as keyof typeof bgClasses]} ${paddingClasses[padding as keyof typeof paddingClasses]}`}>
      <div className="container-custom">
        <div 
          className={`flex ${isVertical ? "flex-col" : "grid"} gap-8 md:gap-12 items-center`}
          style={!isVertical ? { gridTemplateColumns: isImageRight ? `1fr ${imageWidth}%` : `${imageWidth}% 1fr` } : {}}
        >
          {/* Media Column */}
          <div className={`${isVertical ? "w-full" : ""} ${layout === "image-bottom" ? "order-2" : (layout === "image-right" ? "order-2" : "order-1")}`}>
            <EditableElement
              type="image"
              fieldKey="image"
              sectionId={sectionId}
              defaultContent={image}
              className="shadow-xl overflow-hidden w-full h-full min-h-[300px]"
            >
              <img src={image} className="w-full h-full object-cover" alt={title} />
            </EditableElement>
          </div>

          {/* Content Column */}
          <div className={`${isVertical ? "w-full text-center" : ""} ${layout === "image-bottom" ? "order-1" : (layout === "image-right" ? "order-1" : "order-2")}`}>
            {title && (
              <EditableElement
                tagName="h2"
                fieldKey="title"
                sectionId={sectionId}
                defaultContent={title}
                className="text-3xl md:text-4xl font-bold text-primary mb-6"
              />
            )}
            <EditableElement
              tagName="div"
              fieldKey="description"
              type="rich-text"
              sectionId={sectionId}
              defaultContent={displayDescription}
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-secondary text-muted-foreground leading-relaxed"
            />

            {/* Features list (Legacy & New support) */}
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
        </div>
      </div>
    </section>
  );
};
