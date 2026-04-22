import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { partnerService, Partner } from '@/services/partnerService';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { Edit, ImagePlus, Plus, Pencil, Trash2 } from 'lucide-react';

// --- About Hero Block ---
interface AboutHeroBlockProps {
  title: string;
  description: string;
  sectionId?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export const AboutHeroBlock = ({ 
  title, 
  description,
  sectionId,
  titleColor = 'var(--primary)',
  descriptionColor = 'var(--muted-foreground)'
}: AboutHeroBlockProps) => {
  const { t } = useTranslation();
  const defaultTitle = t('about_hero_title', "Giới thiệu");
  const defaultDescription = t('about_hero_desc', "Tổng công ty Kỹ thuật lạnh Việt Nam (VVC) - Đơn vị tiên phong trong giải pháp nhiệt lạnh công nghiệp.");

  return (
    <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-20">
      <div className="container-custom">
        <EditableElement 
          tagName="h1" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || defaultTitle} 
          className="text-3xl md:text-5xl font-bold text-primary mb-6" 
          style={{ color: titleColor }}
        />
        <EditableElement 
          tagName="p" 
          fieldKey="description" 
          sectionId={sectionId}
          defaultContent={description || defaultDescription} 
          className="text-lg text-muted-foreground max-w-3xl" 
          style={{ color: descriptionColor }}
        />
      </div>
    </div>
  );
};

// --- History Block ---
export const HistoryBlock = ({
  title,
  p1,
  p2,
  p3,
  image = "/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png",
  expYears = "20+",
  expText,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const defaultTitle = t('history_title', "Lịch sử phát triển");
  const defaultP1 = t('history_p1', "Được thành lập vào năm 2003, VietVinhCorp bắt đầu hành trình với khát vọng chinh phục đỉnh cao công nghệ lạnh.");
  const defaultP2 = t('history_p2', "Từ một đơn vị chuyên về lắp đặt, chúng tôi đã mở rộng sang tư vấn thiết kế và sản xuất cấu kiện cơ khí lạnh chính xác.");
  const defaultP3 = t('history_p3', "Ngày nay, VVC tự hào là đối tác chiến lược của nhiều tập đoàn đa quốc gia và các dự án hạ tầng trọng điểm.");
  const defaultExpText = t('years_experience', "Năm kinh nghiệm");

  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <EditableElement 
              tagName="h2" 
              fieldKey="title" 
              sectionId={sectionId}
              defaultContent={title || defaultTitle} 
              className="text-2xl md:text-3xl font-bold text-primary mb-4" 
            />
            <EditableElement tagName="p" fieldKey="p1" sectionId={sectionId} defaultContent={p1 || defaultP1} className="mb-4" />
            <EditableElement tagName="p" fieldKey="p2" sectionId={sectionId} defaultContent={p2 || defaultP2} className="mb-4" />
            <EditableElement tagName="p" fieldKey="p3" sectionId={sectionId} defaultContent={p3 || defaultP3} />
          </div>
          <div className="relative">
            <EditableElement
              type="image"
              fieldKey="image"
              sectionId={sectionId}
              defaultContent={image}
              className="w-full h-auto"
            >
              <img alt={title || defaultTitle} src={image} className="w-full h-auto" />
            </EditableElement>
            <div className="absolute -bottom-6 -left-6 bg-secondary p-4 shadow-lg">
              <EditableElement tagName="p" fieldKey="expYears" sectionId={sectionId} defaultContent={expYears} className="text-xl font-bold" />
              <EditableElement tagName="p" fieldKey="expText" sectionId={sectionId} defaultContent={expText || defaultExpText} className="text-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Vision & Mission Block ---
export const VisionMissionBlock = ({
  visionTitle,
  visionDesc1,
  visionDesc2,
  missionTitle,
  missionDesc1,
  missionDesc2,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const defaultVisionTitle = t('vision_title', "Tầm nhìn");
  const defaultVisionDesc1 = t('vision_desc1', "Trở thành đơn vị hàng đầu Đông Nam Á trong lĩnh vực kỹ thuật lạnh công nghiệp.");
  const defaultVisionDesc2 = t('vision_desc2', "Chúng tôi không ngừng đổi mới để mang lại giá trị bền vững cho khách hàng và cộng đồng.");
  
  const defaultMissionTitle = t('mission_title', "Sứ mệnh");
  const defaultMissionDesc1 = t('mission_desc1', "Cung cấp các giải pháp điện lạnh tối ưu, tiết kiệm năng lượng và thân thiện môi trường.");
  const defaultMissionDesc2 = t('mission_desc2', "Mang đến những không gian sống và làm việc an toàn, tiện nghi qua công nghệ kiểm soát nhiệt độ.");

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <EditableElement fieldKey="visionTitle" sectionId={sectionId} defaultContent={visionTitle || defaultVisionTitle} />
            </h2>
            <EditableElement tagName="p" fieldKey="visionDesc1" sectionId={sectionId} defaultContent={visionDesc1 || defaultVisionDesc1} className="mb-4" />
            <EditableElement tagName="p" fieldKey="visionDesc2" sectionId={sectionId} defaultContent={visionDesc2 || defaultVisionDesc2} />
          </div>
          <div className="bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
              <EditableElement fieldKey="missionTitle" sectionId={sectionId} defaultContent={missionTitle || defaultMissionTitle} />
            </h2>
            <EditableElement tagName="p" fieldKey="missionDesc1" sectionId={sectionId} defaultContent={missionDesc1 || defaultMissionDesc1} className="mb-4" />
            <EditableElement tagName="p" fieldKey="missionDesc2" sectionId={sectionId} defaultContent={missionDesc2 || defaultMissionDesc2} />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Core Values Block ---
export const CoreValuesBlock = ({ title, sectionId, ...props }: any) => {
  const { t } = useTranslation();
  const defaultTitle = t('core_values_title', "Giá trị cốt lõi");
  const values = [
    { key: 'v1', icon: 'M3 7h18 M3 11h18 M3 15h14 M3 19h4', title: props.v1_title || t('value1_title', 'Chất lượng hàng đầu'), desc: props.v1_desc || t('value1_desc', 'Chúng tôi cam kết mang đến những sản phẩm đạt tiêu chuẩn quốc tế.') },
    { key: 'v2', icon: 'M12 2v20 m17 5-5-3-5 3 m17 19-5 3-5-3 M2 12h20 m5 7-3 5 3 5 m19 7 3 5-3 5', title: props.v2_title || t('value2_title', 'Đổi mới sáng tạo'), desc: props.v2_desc || t('value2_desc', 'Không ngừng cải tiến quy trình và áp dụng công nghệ mới.') },
    { key: 'v3', icon: 'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z', title: props.v3_title || t('value3_title', 'Khách hàng là trọng tâm'), desc: props.v3_desc || t('value3_desc', 'Luôn lắng nghe và thấu hiểu nhu cầu của từng khách hàng.') }
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || defaultTitle} 
          className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center" 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(val => (
            <div key={val.key} className="bg-white p-6 shadow-md border-t-4 border-primary">
              <div className="mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={val.icon}></path></svg>
              </div>
              <EditableElement tagName="h3" fieldKey={`${val.key}_title`} sectionId={sectionId} defaultContent={val.title} className="text-xl font-semibold mb-2" />
              <EditableElement tagName="p" fieldKey={`${val.key}_desc`} sectionId={sectionId} defaultContent={val.desc} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Leadership Block ---
interface Leader {
  name: string;
  position: string;
  photo: string;
  keyPrefix: string;
}

export const LeadershipBlock = ({ title, sectionId, ...props }: any) => {
  const { t } = useTranslation();
  const defaultTitle = t('leadership_team_title', "Đội ngũ lãnh đạo");
  const leaders: Leader[] = [
    { name: props.l1_name || "Nguyễn Văn A", position: props.l1_pos || t('role_chairman', "Chủ tịch Hội đồng Quản trị"), photo: props.l1_image || "https://i.pravatar.cc/300?img=1", keyPrefix: "l1" },
    { name: props.l2_name || "Trần Thị B", position: props.l2_pos || t('role_ceo', "Tổng Giám đốc"), photo: props.l2_image || "https://i.pravatar.cc/300?img=5", keyPrefix: "l2" },
    { name: props.l3_name || "Lê Văn C", position: props.l3_pos || t('role_v_ceo', "Phó Tổng Giám đốc"), photo: props.l3_image || "https://i.pravatar.cc/300?img=3", keyPrefix: "l3" },
    { name: props.l4_name || "Phạm Thị D", position: props.l4_pos || t('role_cfo', "Giám đốc Tài chính"), photo: props.l4_image || "https://i.pravatar.cc/300?img=4", keyPrefix: "l4" }
  ];

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container-custom">
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || defaultTitle} 
          className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center" 
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {leaders.map((leader) => (
            <div key={leader.keyPrefix} className="bg-white overflow-hidden shadow-md">
              <EditableElement
                type="image"
                fieldKey={`${leader.keyPrefix}_image`}
                sectionId={sectionId}
                defaultContent={leader.photo}
                className="w-full h-64"
              >
                <img alt={leader.name} src={leader.photo} className="w-full h-full object-cover object-center" />
              </EditableElement>
              <div className="p-4">
                <EditableElement tagName="h3" fieldKey={`${leader.keyPrefix}_name`} sectionId={sectionId} defaultContent={leader.name} className="text-xl font-semibold text-primary" />
                <EditableElement tagName="p" fieldKey={`${leader.keyPrefix}_pos`} sectionId={sectionId} defaultContent={leader.position} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Achievements Block ---
export const AchievementsBlock = ({ title, sectionId }: { title?: string; sectionId?: string }) => {
  const { t } = useTranslation();
  const defaultTitle = t('notable_achievements', "Thành tựu nổi bật");
  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || defaultTitle} 
          className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center" 
        />
        <div className="bg-primary/5 p-8 rounded-none text-center">
          <p className="text-lg text-primary font-medium italic">{t('achievements_quote', '"Chặng đường 20 năm khẳng định vị thế và niềm tin của khách hàng."')}</p>
        </div>
      </div>
    </section>
  );
};

// --- Production Facilities Block ---
export const ProductionFacilitiesBlock = ({ 
  title,
  description,
  image1 = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  image2 = "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80",
  sectionId,
  ...props
}: any) => {
  const { t } = useTranslation();
  const defaultTitle = t('facilities_title', "Cơ sở hạ tầng & Trung tâm sản xuất");
  const defaultDescription = t('facilities_desc', "VVC đầu tư mạnh mẽ vào hệ thống nhà xưởng hiện đại, kho bãi quy mô lớn và trung tâm điều chuyển hàng hóa tại các địa bàn trọng điểm.");

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableElement 
            tagName="h2" 
            fieldKey="title" 
            sectionId={sectionId}
            defaultContent={title || defaultTitle} 
            className="text-3xl md:text-4xl font-bold text-primary mb-6" 
          />
          <EditableElement 
            tagName="p" 
            fieldKey="description" 
            sectionId={sectionId}
            defaultContent={description || defaultDescription} 
            className="text-lg text-muted-foreground leading-relaxed" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col space-y-6">
            <EditableElement
              type="image"
              fieldKey="image1"
              sectionId={sectionId}
              defaultContent={image1}
              className="shadow-xl overflow-hidden h-[300px] md:h-[350px]"
            >
              <img alt="Facility 1" src={image1} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </EditableElement>
            <div className="bg-primary/5 p-8 border border-primary/10 shadow-sm flex-grow">
              <h3 className="font-bold text-xl mb-3 text-primary">{t('storage_capacity', 'Năng lực lưu kho')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('storage_desc', 'Hệ thống kho bảo quản gas lạnh và vật tư thiết bị đạt chuẩn quốc tế, đảm bảo nguồn cung liên tục cho các dự án lớn.')}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 shadow-sm flex-grow order-2 md:order-1">
              <h3 className="font-bold text-xl mb-3 text-primary">{t('technical_center', 'Trung tâm kỹ thuật')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('tech_center_desc', 'Sở hữu phòng LAB và xưởng lắp ráp với máy móc CNC hiện đại, cho phép sản xuất các cấu kiện cơ khí lạnh chính xác cao.')}</p>
            </div>
            <EditableElement
              type="image"
              fieldKey="image2"
              sectionId={sectionId}
              defaultContent={image2}
              className="rounded-2xl shadow-xl overflow-hidden h-[300px] md:h-[350px] order-1 md:order-2"
            >
              <img alt="Facility 2" src={image2} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </EditableElement>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Quality Principles Block ---
export const QualityPrinciplesBlock = ({
  title,
  sectionId,
  ...props
}: any) => {
  const { t } = useTranslation();
  const defaultTitle = t('quality_principles_title', "Nguyên tắc chất lượng của VVC");
  const principles = [
    { key: 'q1', title: props.q1_title || t('q_principle1_title', 'Chất lượng là sống còn'), desc: props.q1_desc || t('q_principle1_desc', 'Mọi sản phẩm và giải pháp đều phải trải qua quy trình kiểm soát 3 lớp nghiêm ngặt.') },
    { key: 'q2', title: props.q2_title || t('q_principle2_title', 'Sáng tạo & Đổi mới'), desc: props.q2_desc || t('q_principle2_desc', 'Không ngừng cập nhật công nghệ làm mát tiên tiến nhất từ Nhật Bản và Châu Âu.') },
    { key: 'q3', title: props.q3_title || t('q_principle3_title', 'Trách nhiệm cộng đồng'), desc: props.q3_desc || t('q_principle3_desc', 'Cam kết sử dụng môi chất lạnh thân thiện với môi trường, góp phần giảm hiệu ứng nhà kính.') },
    { key: 'q4', title: props.q4_title || t('q_principle4_title', 'Đối tác tin cậy'), desc: props.q4_desc || t('q_principle4_desc', 'Xây dựng mối quan hệ dựa trên sự trung thực, minh bạch và hiệu quả kinh tế bền vững.') }
  ];

  return (
    <section className="py-12 md:py-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="container-custom relative z-10">
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || defaultTitle} 
          className="text-3xl md:text-4xl font-bold mb-12 text-center" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map(p => (
            <div key={p.key} className="border-l-2 border-primary pl-6 py-2 hover:bg-white/5 transition-colors duration-300">
              <EditableElement tagName="h3" fieldKey={`${p.key}_title`} sectionId={sectionId} defaultContent={p.title} className="text-xl font-bold mb-3 text-secondary" />
              <EditableElement tagName="p" fieldKey={`${p.key}_desc`} sectionId={sectionId} defaultContent={p.desc} className="text-slate-400 text-sm leading-relaxed" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Partners Block ---
export const PartnersBlock = ({ title, sectionId }: { title?: string; sectionId?: string }) => {
  const { t } = useTranslation();
  const { editMode } = useVisualEditor();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const defaultTitle = t('partners_clients_title', "Đối tác & Khách hàng");

    const fetchPartners = React.useCallback(async () => {
      setLoading(true);
      const result = await partnerService.getAll();
      if (result.success) {
        setPartners(result.data.filter(p => p.is_active));
      }
      setLoading(false);
    }, []);

    useEffect(() => {
        const handleMsg = (e: MessageEvent) => {
            if (e.data?.type === 'VISUAL_EDIT_REFRESH_PARTNERS') {
                fetchPartners();
            }
        };
        window.addEventListener('message', handleMsg);
        return () => window.removeEventListener('message', handleMsg);
    }, [fetchPartners]);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container-custom">
        <EditableElement 
          tagName="h2" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || defaultTitle} 
          className="text-2xl md:text-3xl font-bold text-primary mb-12 text-center" 
        />
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <div key={partner.id} className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center aspect-[3/2] group border border-transparent hover:border-primary/20">
                  {partner.logo_url ? (
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name} 
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">{partner.name}</span>
                  )}

                  {/* Edit/Delete Overlay */}
                  {editMode && (
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl z-20">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.parent.postMessage({ type: 'VISUAL_EDIT_EDIT_PARTNER', partner }, '*');
                        }}
                        className="p-2 bg-white text-primary rounded-full shadow-lg hover:bg-primary hover:text-white transition-all transform scale-90 group-hover:scale-100"
                        title="Sửa đối tác"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Bạn có chắc muốn xóa đối tác "${partner.name}"?`)) {
                            window.parent.postMessage({ type: 'VISUAL_EDIT_DELETE_PARTNER', partnerId: partner.id }, '*');
                          }
                        }}
                        className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                        title="Xóa đối tác"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : null}

            {editMode && (
              <div 
                onClick={() => window.parent.postMessage({ type: 'VISUAL_EDIT_QUICK_ADD_PARTNER' }, '*')}
                className="bg-white/50 p-6 rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center aspect-[3/2] cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mb-2">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Thêm đối tác</span>
              </div>
            )}

            {!editMode && partners.length === 0 && (
               Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/50 p-6 rounded-xl border border-dashed border-gray-200 flex items-center justify-center aspect-[3/2]">
                  <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};
