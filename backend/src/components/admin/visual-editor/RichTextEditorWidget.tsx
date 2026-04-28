import React, { useState, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Maximize2, Minimize2, Pin, PinOff, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Cấu hình Quill Alignment dùng inline style
// Thực hiện một lần duy nhất
let alignRegistered = false;
const registerQuillStyles = () => {
    if (alignRegistered) return;
    try {
        const AlignStyle = Quill.import('attributors/style/align') as any;
        AlignStyle.whitelist = ['left', 'center', 'right', 'justify'];
        Quill.register(AlignStyle, true);

        const ColorStyle = Quill.import('attributors/style/color') as any;
        Quill.register(ColorStyle, true);

        const BackgroundStyle = Quill.import('attributors/style/background') as any;
        Quill.register(BackgroundStyle, true);

        alignRegistered = true;
    } catch (e) {
        console.error('Failed to register Quill styles:', e);
    }
};

const QUILL_FORMATS = ['bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'link', 'color', 'background'];

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
    // Register style-based attributors when component is first used
    registerQuillStyles();

    const [originalValue] = useState(value);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': ['', 'center', 'right', 'justify'] }],
                ['link', 'clean']
            ],
            handlers: {
                align: function(this: any, val: string) {
                    this.quill.format('align', val === '' ? 'left' : val);
                }
            }
        }
    }), []);

    const handleRestore = () => {
        onChange(originalValue);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        if (isFullscreen) {
            setIsPinned(false);
        }
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
        if (!isPinned) setIsFullscreen(true);
    };

    const handleClose = () => {
        setIsActive(false);
        setIsFullscreen(false);
        setIsPinned(false);
    };

    // Chế độ xem trước (Preview Mode)
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

    // Giao diện Editor
    const EditorUI = (
        <div className={`bg-white flex flex-col h-full border border-slate-200 ${isFullscreen || isPinned ? 'rounded-xl overflow-hidden' : 'rounded-md shadow-lg'}`}>
            <style>{`
                .custom-quill-wrapper .ql-container {
                    flex-grow: 1;
                    overflow-y: auto;
                    min-height: 150px;
                    border-bottom-left-radius: inherit;
                    border-bottom-right-radius: inherit;
                    border: none !important;
                }
                .custom-quill-wrapper .ql-editor {
                    min-height: 150px;
                }
                .custom-quill-wrapper .ql-toolbar {
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    background-color: #f8fafc;
                }
            `}</style>
            
            <div className="flex items-center justify-between p-2 bg-slate-100 border-b border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex-grow">
                    {label || 'Soạn thảo văn bản'}
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-amber-600 hover:bg-amber-50" onClick={handleRestore} title="Khôi phục">
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`h-6 w-6 ${isPinned ? 'text-blue-600 bg-blue-100' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`} onClick={togglePin} title="Ghim">
                        {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={toggleFullscreen} title="Toàn màn hình">
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={handleClose} title="Đóng">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className={`flex-grow flex flex-col custom-quill-wrapper ${isFullscreen ? 'min-h-[300px]' : 'min-h-[150px]'}`}>
                <ReactQuill 
                    theme="snow" 
                    value={value || ''} 
                    onChange={onChange}
                    modules={modules}
                    formats={QUILL_FORMATS}
                    placeholder={placeholder || 'Nhập nội dung...'}
                    className="flex-grow flex flex-col h-full"
                />
            </div>
        </div>
    );

    if (isFullscreen || isPinned) {
        return (
            <>
                <div 
                    className="p-6 bg-slate-50 border-2 border-slate-200 border-dashed rounded-lg text-xs text-slate-400 font-bold text-center flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors" 
                    onClick={() => { setIsFullscreen(false); setIsPinned(false); }}
                >
                    <Pin className="h-5 w-5 text-blue-500" />
                    ĐANG SOẠN THẢO Ở CỬA SỔ NỔI...
                </div>

                {isFullscreen && !isPinned && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99998]" onClick={() => setIsFullscreen(false)} />
                )}

                <div className={`fixed z-[99999] transition-all duration-300 shadow-2xl ${
                    isPinned 
                        ? 'bottom-6 right-6 w-[450px] h-[550px]' 
                        : 'inset-10 flex flex-col md:inset-20'
                }`}>
                    {EditorUI}
                </div>
            </>
        );
    }

    return (
        <div className="w-full h-fit min-h-[200px]">
            {EditorUI}
        </div>
    );
};
