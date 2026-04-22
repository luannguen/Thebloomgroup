import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { EditableElement } from '../admin/EditableElement';

export const ProjectOverviewBlock = ({
  title,
  description,
  image = "/assets/images/projects-overview.jpg",
  sectionId,
  ...props
}: any) => {
  const { t } = useTranslation();
  
  const defaultTitle = t('capability_experience', 'Năng lực và kinh nghiệm');
  const defaultDesc = t('projects_overview_desc', 'Với hơn 20 năm kinh nghiệm, Thebloomgrouporation đã thực hiện hàng trăm dự án lớn nhỏ trong lĩnh vực điện lạnh công nghiệp và dân dụng. Chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn lớn và các đơn vị hàng đầu trong các ngành công nghiệp.');
  
  const items = [
    { key: 'item1', defaultText: t('completed_projects_stat', 'Hơn 500 dự án lớn nhỏ đã hoàn thành') },
    { key: 'item2', defaultText: t('trusted_partner_stat', 'Đối tác của các tập đoàn và doanh nghiệp hàng đầu') },
    { key: 'item3', defaultText: t('expert_team_stat', 'Đội ngũ kỹ sư và chuyên viên giàu kinh nghiệm') },
    { key: 'item4', defaultText: t('quality_commitment_stat', 'Cam kết chất lượng và tiến độ thi công') }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <EditableElement 
              tagName="h2" 
              fieldKey="title" 
              sectionId={sectionId}
              defaultContent={title || defaultTitle} 
              className="text-3xl md:text-4xl font-bold mb-8" 
            />
            <EditableElement 
              tagName="p" 
              fieldKey="description" 
              sectionId={sectionId}
              defaultContent={description || defaultDesc} 
              className="text-lg text-muted-foreground mb-8 leading-relaxed" 
            />
            <ul className="space-y-4">
              {items.map((item) => {
                const content = (props as any)[item.key] || item.defaultText;
                return (
                  <li key={item.key} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1 mr-4">
                      <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <EditableElement 
                      tagName="span" 
                      fieldKey={item.key} 
                      sectionId={sectionId}
                      defaultContent={content} 
                      className="text-slate-700 font-medium" 
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-2xl -rotate-2" />
            <EditableElement
              type="image"
              fieldKey="image"
              sectionId={sectionId}
              defaultContent={image}
              className="relative z-10 w-full h-auto rounded-xl shadow-2xl overflow-hidden"
            >
              <img 
                src={image} 
                alt={title || defaultTitle} 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </EditableElement>
          </div>
        </div>
      </div>
    </section>
  );
};
