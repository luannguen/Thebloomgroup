import React, { useRef, useState } from 'react';
import { EditableElement } from '../admin/EditableElement';
import { FileDown, CheckCircle2, ShieldCheck, Zap, Upload, Loader2, Check, FileText, Info } from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { supabase } from '../../supabase';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../hooks/useSettings';

interface CapabilityProfileBlockProps {
  sectionId?: string;
  title?: string;
  description?: string;
  previewImage?: string;
  pdfUrl?: string;
  downloadText?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  features?: { id: string; text: string }[];
}

export const CapabilityProfileBlock = ({
  sectionId,
  title = "Hồ sơ năng lực Thebloomgroup",
  description = "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của Thebloomgroup.",
  previewImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  pdfUrl = "#",
  downloadText = "Tải xuống Hồ sơ năng lực (PDF)",
  pdfFileName = "",
  pdfFileSize = "",
  features = [
    { id: '1', text: '20+ năm kinh nghiệm trong ngành điện lạnh' },
    { id: '2', text: 'Đội ngũ kỹ sư chuyên môn cao, trải qua đào tạo quốc tế' },
    { id: '3', text: 'Hệ thống quản lý chất lượng đạt chuẩn ISO' },
    { id: '4', text: 'Đối tác chiến lược của các tập đoàn hàng đầu thế giới' }
  ]
}: CapabilityProfileBlockProps) => {
  const { editMode, updateSectionProps } = useVisualEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const isEnabled = getSetting('enable_profile_download', 'true') !== 'false';

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sectionId) return;

    if (file.type !== 'application/pdf') {
      alert(t('Vui lòng chỉ tải lên file định dạng PDF.', { defaultValue: 'Vui lòng chỉ tải lên file định dạng PDF.' }));
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const fileName = `capability-profile-${Date.now()}.pdf`;
      const filePath = `documents/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Update section props in Visual Editor context with metadata
      updateSectionProps(sectionId, { 
        pdfUrl: publicUrl,
        pdfFileName: file.name,
        pdfFileSize: formatSize(file.size)
      });
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(t('Lỗi tải lên: ', { defaultValue: 'Lỗi tải lên: ' }) + error.message);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            <EditableElement
              tagName="h2"
              fieldKey="title"
              sectionId={sectionId}
              defaultContent={t(title, { defaultValue: title })}
              className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight"
            />
            
            <EditableElement
              tagName="p"
              fieldKey="description"
              sectionId={sectionId}
              defaultContent={t(description, { defaultValue: description })}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            />

            <div className="space-y-4 mb-10">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-gray-700 font-medium">{t(feature.text, { defaultValue: feature.text })}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a
                href={isEnabled ? pdfUrl : undefined}
                download={isEnabled}
                target={isEnabled ? "_blank" : undefined}
                rel={isEnabled ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-xl transition-all shadow-lg ${
                  isEnabled 
                    ? "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-1 active:scale-95" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-100"
                }`}
                onClick={(e) => !isEnabled && e.preventDefault()}
                title={!isEnabled ? t('Tính năng tải về hiện đang tạm khóa', { defaultValue: 'Tính năng tải về hiện đang tạm khóa' }) : undefined}
              >
                <FileDown className={`w-6 h-6 ${!isEnabled ? 'text-gray-300' : ''}`} />
                <EditableElement
                  tagName="span"
                  fieldKey="downloadText"
                  sectionId={sectionId}
                  defaultContent={t(downloadText, { defaultValue: downloadText })}
                />
              </a>

              {/* Admin Upload Trigger with Metadata Display */}
              {editMode && (
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all border-2 ${
                      uploadStatus === 'success' 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'bg-white border-primary/20 text-primary hover:bg-primary/5'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang tải lên...</span>
                      </>
                    ) : uploadStatus === 'success' ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Đã tải lên!</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Thay đổi file PDF</span>
                      </>
                    )}
                  </button>
                  
                  {/* Metadata display for Admin */}
                  {(pdfFileName || pdfFileSize) && (
                    <div className="flex items-start gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                      <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-tight text-primary/80 overflow-hidden">
                        <p className="font-bold truncate" title={pdfFileName}>{pdfFileName || 'Chưa rõ tên'}</p>
                        <p className="opacity-70">{pdfFileSize || 'Không xác định size'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!editMode && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>{t('Bản cập nhật 2024 (PDF, ', { defaultValue: 'Bản cập nhật 2024 (PDF, ' })}{pdfFileSize || '~5MB'})</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview Image / Mockup */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white group">
              <EditableElement
                type="image"
                fieldKey="previewImage"
                sectionId={sectionId}
                defaultContent={previewImage}
                className="aspect-[3/4] w-full h-full"
              >
                <img src={previewImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Hồ sơ năng lực Thebloomgroup" />
              </EditableElement>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-bold uppercase tracking-wider">Professional Profile</span>
                </div>
                <p className="text-sm opacity-90 font-medium">Thebloomgroup Engineering & Refrigeration Corp</p>
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full -z-0 blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/5 rounded-full -z-0 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};
