import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Maximize2, Minimize2, Pin, PinOff, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorWidgetProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    placeholder?: string;
}

export const RichTextEditorWidget: React.FC<RichTextEditorWidgetProps> = ({
    value,
    onChange,
    label,
    placeholder
}) => {
    const [originalValue] = useState(value);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    const handleRestore = () => {
        onChange(originalValue);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        if (isFullscreen) {
            setIsPinned(false); // Turn off pin if exiting fullscreen
        }
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
        if (!isPinned) setIsFullscreen(true); // Force floating when pinned
    };

    const handleClose = () => {
        setIsActive(false);
        setIsFullscreen(false);
        setIsPinned(false);
    };

    if (!isActive && !isFullscreen && !isPinned) {
        return (
            <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label || 'Văn bản'}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2 rounded-md"
                        onClick={() => setIsActive(true)}
                    >
                        Mở soạn thảo
                    </Button>
                </div>
                <div 
                    className="border border-slate-200 rounded-md bg-white p-2.5 min-h-[42px] max-h-[100px] overflow-hidden cursor-text hover:border-blue-400 hover:shadow-sm transition-all relative group"
                    onClick={() => setIsActive(true)}
                >
                    <div 
                        className="text-xs text-slate-700 line-clamp-3 prose prose-sm max-w-none" 
                        dangerouslySetInnerHTML={{ __html: value || '<span class="text-slate-400 italic">Nhập nội dung...</span>' }} 
                    />
                    {value && value.length > 50 && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent" />
                    )}
                </div>
            </div>
        );
    }

    const editorContent = (
        <div className={`bg-white flex flex-col h-full border border-slate-200 ${isFullscreen || isPinned ? 'rounded-xl overflow-hidden' : 'rounded-md'}`}>
            <style>{`
                .custom-quill-wrapper .ql-container {
                    flex-grow: 1;
                    overflow-y: auto;
                    min-height: 120px;
                    border-bottom-left-radius: inherit;
                    border-bottom-right-radius: inherit;
                    border-bottom: none;
                    border-left: none;
                    border-right: none;
                }
                .custom-quill-wrapper .ql-editor {
                    min-height: 100%;
                }
                .custom-quill-wrapper .ql-toolbar {
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    background-color: #f8fafc;
                }
            `}</style>
            
            {/* Header / Toolbar actions */}
            <div className="flex items-center justify-between p-2 bg-slate-100 border-b border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex-grow">
                    {label || 'Soạn thảo văn bản'}
                </div>
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-400 hover:text-amber-600 hover:bg-amber-50" 
                        onClick={handleRestore}
                        title="Khôi phục trạng thái ban đầu"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-6 w-6 ${isPinned ? 'text-blue-600 bg-blue-100' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        onClick={togglePin}
                        title={isPinned ? "Bỏ ghim" : "Ghim cửa sổ (Floating Mode)"}
                    >
                        {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-blue-50" 
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Thu nhỏ" : "Phóng to toàn màn hình"}
                    >
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-1 text-slate-400 hover:text-red-600 hover:bg-red-50" 
                        onClick={handleClose}
                        title="Đóng trình soạn thảo"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className={`flex-grow relative flex flex-col custom-quill-wrapper ${isFullscreen ? 'min-h-[300px]' : 'min-h-[120px]'}`}>
                <ReactQuill 
                    theme="snow" 
                    value={value || ''} 
                    onChange={onChange}
                    modules={modules}
                    placeholder={placeholder || 'Nhập nội dung...'}
                    className="h-full flex flex-col"
                />
            </div>
        </div>
    );

    if (isFullscreen || isPinned) {
        return (
            <>
                {/* Placeholder where the editor used to be */}
                <div 
                    className="p-6 bg-slate-50 border-2 border-slate-200 border-dashed rounded-lg text-xs text-slate-400 font-bold text-center flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors" 
                    onClick={() => { setIsFullscreen(false); setIsPinned(false); }}
                >
                    <Pin className="h-5 w-5 text-blue-500" />
                    ĐANG SOẠN THẢO Ở CỬA SỔ NỔI...
                    <span className="text-[10px] font-normal text-slate-400">Click vào đây để thu nhỏ</span>
                </div>

                {/* Overlay only if fullscreen and not pinned */}
                {isFullscreen && !isPinned && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99998]" onClick={() => setIsFullscreen(false)} />
                )}

                {/* Floating Modal / Pinned Window */}
                <div className={`fixed z-[99999] transition-all duration-300 shadow-2xl ${
                    isPinned 
                        ? 'bottom-6 right-6 w-[450px] h-[550px]' 
                        : 'inset-10 flex flex-col md:inset-20'
                }`}>
                    <div className="absolute -inset-4 bg-black/5 blur-2xl -z-10 rounded-3xl" />
                    {editorContent}
                </div>
            </>
        );
    }

    return editorContent;
};
