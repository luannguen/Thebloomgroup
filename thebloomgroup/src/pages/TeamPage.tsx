import { VisualEditorProvider } from '../context/VisualEditorContext';
import { VisualPageRenderer } from '../components/admin/builder/VisualPageRenderer';

const DEFAULT_TEAM_SECTIONS = [
  {
    id: 'team-hero',
    type: 'team_hero',
    props: { 
      title: 'ĐỘI NGŨ CHUYÊN GIA Thebloomgroup', 
      description: 'Hội tụ những tinh hoa trong ngành kỹ thuật lạnh, tâm huyết với từng giải pháp của khách hàng.' 
    }
  },
  {
    id: 'team-grid',
    type: 'team_grid',
    props: {
      title: 'GẶP GỠ ĐỘI NGŨ CỦA CHÚNG TÔI',
      description: 'Đội ngũ kỹ sư và chuyên viên dày dặn kinh nghiệm, luôn sẵn sàng đồng hành cùng dự án của bạn.'
    }
  }
];

const TeamContent = () => {
  return (
    <main className="flex-grow">
      <VisualPageRenderer customSections={DEFAULT_TEAM_SECTIONS} />
    </main>
  );
};

const TeamPage = () => {
  // Team page maps to 'team' slug in database
  const effectiveSlug = 'team';

  return (
    <VisualEditorProvider slug={effectiveSlug}>
      <TeamContent />
    </VisualEditorProvider>
  );
};

export default TeamPage;
