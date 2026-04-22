import React, { useEffect, useState } from 'react';
import { recruitmentService, Job } from '@/services/recruitmentService';
import { Briefcase, MapPin, Clock, DollarSign, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditableElement } from '../admin/EditableElement';

interface JobsListBlockProps {
  title?: string;
  subtitle?: string;
  sectionId?: string;
}

export const JobsListBlock = ({
  title = 'Cơ hội nghề nghiệp',
  subtitle = 'Gia nhập đội ngũ Thebloomgroup để cùng xây dựng những giá trị bền vững.',
  sectionId
}: JobsListBlockProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await recruitmentService.getActiveJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-20 bg-slate-50">
      <div className="container-custom">
        <div className="max-w-3xl mb-16">
          <EditableElement
            tagName="h2"
            fieldKey="title"
            sectionId={sectionId}
            defaultContent={title}
            className="text-4xl font-bold text-primary mb-4"
          />
          <EditableElement
            tagName="p"
            fieldKey="subtitle"
            sectionId={sectionId}
            defaultContent={subtitle}
            className="text-xl text-muted-foreground"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-100">
            <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-xl text-slate-500 font-medium">Hiện tại chưa có vị trí nào đang tuyển dụng.</p>
            <p className="text-slate-400 mt-2">Vui lòng quay lại sau hoặc gửi hồ sơ dự phòng cho chúng tôi.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Link 
                key={job.id} 
                to={`/recruitment/${job.slug}`}
                className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      {job.location || 'TP. Hồ Chí Minh'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary" />
                      {job.type || 'Full-time'}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-secondary" />
                      {job.salary || 'Thỏa thuận'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-secondary font-bold gap-2 self-start md:self-center">
                  <span>Ứng tuyển ngay</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
