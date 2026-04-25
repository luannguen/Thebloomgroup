import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruitmentService, Job } from '@/services/recruitmentService';
import { 
  Loader2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Upload,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAntiSpam } from '@/hooks/useAntiSpam';
import { useTranslation } from 'react-i18next';

export default function JobDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { HoneypotField, isBot } = useAntiSpam();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await recruitmentService.getJobBySlug(slug);
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'Lỗi file',
          description: 'Dung lượng file không được vượt quá 10MB',
          variant: 'destructive'
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBot()) {
      // Fake success for bots
      setSubmitted(true);
      toast({
        title: 'Thành công',
        description: 'Hồ sơ của bạn đã được gửi đi. Chúng tôi sẽ sớm liên hệ!'
      });
      return;
    }
    if (!job) return;
    if (!file) {
      console.warn('Submission blocked: No file selected');
      toast({
        title: t('Thiếu hồ sơ', 'Thiếu hồ sơ'),
        description: t('Vui lòng đính kèm CV của bạn', 'Vui lòng đính kèm CV của bạn'),
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // 1. Upload CV
      const cv_url = await recruitmentService.uploadCV(file);
      
      // 2. Submit Application
      await recruitmentService.submitApplication({
        job_id: job.id,
        cv_url,
        ...formData
      });

      setSubmitted(true);
      toast({
        title: 'Thành công',
        description: 'Hồ sơ của bạn đã được gửi đi. Chúng tôi sẽ sớm liên hệ!'
      });
    } catch (error: any) {
      console.error('Submission failed deep check:', error);
      const errorMessage = error?.message || error?.error_description || 'Unknown error';
      
      toast({
        title: t('Lỗi', 'Lỗi'),
        description: `${t('Gửi hồ sơ thất bại. Vui lòng thử lại sau.', 'Gửi hồ sơ thất bại. Vui lòng thử lại sau.')} (${errorMessage})`,
        variant: 'destructive'
      });
      
      // Fallback alert if toast is not visible for some reason
      if (process.env.NODE_ENV === 'development') {
        alert(`Lỗi gửi hồ sơ: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Không tìm thấy vị trí tuyển dụng</h2>
        <Link to="/recruitment">
           <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="pb-24">
      {/* Header */}
      <div className="bg-primary text-white py-16 md:py-24">
        <div className="container-custom">
          <Link to="/recruitment" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách tuyển dụng
          </Link>
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{job.title}</h1>
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  {job.type}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-secondary" />
                  {job.salary}
                </div>
                {job.deadline && (
                  <div className="flex items-center gap-2">
                     <Calendar className="w-5 h-5 text-secondary" />
                     Hạn nộp: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:block text-right">
               <a href="#apply-form">
                 <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-primary border-none font-bold px-8">Ứng tuyển ngay</Button>
               </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-12 grid lg:grid-cols-3 gap-12">
        {/* Content */}
        <div className="lg:col-span-2 space-y-12">
          {job.description && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Mô tả công việc</h3>
               <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
            </section>
          )}

          {job.requirements && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Yêu cầu ứng viên</h3>
               <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </section>
          )}

          {job.benefits && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Quyền lợi</h3>
               <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: job.benefits }} />
            </section>
          )}
        </div>

        {/* Form */}
        <div id="apply-form" className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 sticky top-24">
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Nộp hồ sơ thành công!</h3>
                <p className="text-slate-500 italic">Cảm ơn bạn đã quan tâm. Bộ phận nhân sự sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">Gửi hồ sơ khác</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <HoneypotField />
                <h3 className="text-2xl font-bold text-primary text-center">Nộp hồ sơ ứng tuyển</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">Họ và tên</Label>
                  <Input 
                    id="full_name" 
                    required 
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Nguyễn Văn A" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.com" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">Đính kèm CV (PDF, DOC, DOCX - Max 10MB)</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      file ? 'border-secondary bg-secondary/5' : 'border-slate-200 hover:border-secondary/50'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,image/*"
                    />
                    {file ? (
                      <div className="text-sm font-medium">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        {file.name}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        Nhấp để tải lên hoặc kéo thả file
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Giới thiệu ngắn (Tùy chọn)</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Vài dòng giới thiệu..." 
                    rows={4} 
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 font-bold text-lg" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {submitting ? 'Đang gửi...' : 'Gửi hồ sơ'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
