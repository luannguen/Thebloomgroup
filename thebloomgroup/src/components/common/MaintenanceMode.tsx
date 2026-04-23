
import React from 'react';
import { Cog, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const MaintenanceMode: React.FC = () => {
  const { settings } = useSettings();
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container max-w-2xl px-6 py-12 relative z-10 text-center">
        <div className="mb-12 inline-flex items-center justify-center p-6 bg-primary/10 rounded-3xl animate-bounce-slow">
          <Cog size={80} className="text-primary animate-spin-slow" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Website đang được <span className="text-primary italic">Bảo trì</span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-lg mx-auto">
          Chúng tôi đang nâng cấp hệ thống để mang lại trải nghiệm tốt nhất cho bạn. 
          Vui lòng quay lại sau một ít phút nữa. Xin lỗi vì sự bất tiện này!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center md:items-start transition-all hover:shadow-md">
            <div className="p-3 bg-white rounded-xl shadow-sm mb-4">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Hotline</span>
            <span className="text-sm font-semibold text-slate-800">{settings['contact_hotline'] || settings['contact_phone'] || 'Đang cập nhật'}</span>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center md:items-start transition-all hover:shadow-md">
            <div className="p-3 bg-white rounded-xl shadow-sm mb-4">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</span>
            <span className="text-sm font-semibold text-slate-800 truncate w-full text-center md:text-left">{settings['contact_email'] || 'contact@thebloomgroup.vn'}</span>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center md:items-start transition-all hover:shadow-md">
            <div className="p-3 bg-white rounded-xl shadow-sm mb-4">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Thời gian</span>
            <span className="text-sm font-semibold text-slate-800">{settings['contact_working_hours'] || '8:00 - 17:00'}</span>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100">
          <div className="text-2xl font-black tracking-tighter text-slate-900 opacity-20 select-none">
            THE BLOOM GROUP
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MaintenanceMode;
