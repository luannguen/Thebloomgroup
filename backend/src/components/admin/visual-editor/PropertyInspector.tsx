import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Settings2, Zap, X, Info, ExternalLink, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BLOCK_LIBRARY } from './BlockLibraryDef';
import { RichTextEditorWidget } from './RichTextEditorWidget';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Accordion } from "@/components/ui/accordion";

interface PropertyInspectorProps {
    selectedSectionId: string | null;
    sections: any[];
    updateSection: (id: string, updates: any) => void;
    setSelectedSectionId: (id: string | null) => void;
    onPickImage: (fieldId: string, parentPath?: string) => void;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
    selectedSectionId,
    sections,
    updateSection,
    setSelectedSectionId,
    onPickImage
}) => {
    const navigate = useNavigate();
    const section = sections?.find(s => s.id === selectedSectionId);
    const blockDef = BLOCK_LIBRARY.find(b => b.type === section?.type);

    const [focusedFieldKey, setFocusedFieldKey] = React.useState<string | null>(null);

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data?.data || event.data;
            if (data?.type === 'VISUAL_EDIT_FIELD_FOCUSED') {
                // If it's a different section, selectedSectionId will update soon. 
                // We set the focused field key and let the other effect handle scrolling once rendered.
                setFocusedFieldKey(data.fieldKey);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    React.useEffect(() => {
        if (focusedFieldKey && section) {
            // Need a slight delay to ensure DOM is updated and rendered
            const timer = setTimeout(() => {
                const element = document.getElementById(`property-field-${focusedFieldKey}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50/50', 'rounded-md', 'p-2', '-m-2', 'transition-all');
                    setTimeout(() => {
                        element.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50/50', 'rounded-md', 'p-2', '-m-2');
                    }, 2000);
                }
                setFocusedFieldKey(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [focusedFieldKey, section]);

    const renderField = (field: any, props: any, onChange: (value: any) => void, path: string = '') => {
        const value = props?.[field.id] !== undefined ? props[field.id] : field.default;

        if (field.type === 'list') {
            const list = Array.isArray(value) ? value : [];
            
            const handleAdd = () => {
                const newItem = {};
                field.itemSchema?.forEach((f: any) => {
                    // @ts-ignore
                    newItem[f.id] = f.type === 'number' ? 0 : '';
                });
                onChange([...list, newItem]);
            };

            const handleRemove = (index: number) => {
                const newList = [...list];
                newList.splice(index, 1);
                onChange(newList);
            };

            const handleUpdateItem = (index: number, itemUpdates: any) => {
                const newList = [...list];
                newList[index] = { ...newList[index], ...itemUpdates };
                onChange(newList);
            };

            const onDragEnd = (result: any) => {
                if (!result.destination) return;
                const newList = [...list];
                const [reorderedItem] = newList.splice(result.source.index, 1);
                newList.splice(result.destination.index, 0, reorderedItem);
                onChange(newList);
            };

            return (
                <div className="space-y-3">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={`list-${field.id}`}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    <Accordion type="multiple" className="space-y-2">
                                        {list.map((item, index) => (
                                            <Draggable key={`${field.id}-${index}`} draggableId={`${field.id}-${index}`} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="bg-slate-50 border rounded-lg overflow-hidden shadow-sm"
                                                    >
                                                        <div className="flex items-center px-2 py-1 bg-slate-100/50 border-b">
                                                            <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-slate-400">
                                                                <GripVertical className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                                                                #{index + 1}
                                                            </span>
                                                            <div className="flex-grow" />
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-6 w-6 text-slate-400 hover:text-red-500"
                                                                onClick={() => handleRemove(index)}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-3 space-y-4">
                                                            {field.itemSchema?.map((subField: any) => {
                                                                const fullPath = `${path ? path + '.' : ''}${field.id}.${index}.${subField.id}`;
                                                                return (
                                                                <div key={subField.id} className="space-y-1.5" id={`property-field-${fullPath}`}>
                                                                    <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                        {subField.label}
                                                                    </Label>
                                                                    {renderField(
                                                                        subField, 
                                                                        item, 
                                                                        (val) => handleUpdateItem(index, { [subField.id]: val }),
                                                                        `${path ? path + '.' : ''}${field.id}.${index}`
                                                                    )}
                                                                </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    </Accordion>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-9 text-[10px] font-bold uppercase border-dashed border-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5"
                        onClick={handleAdd}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Thêm {field.label}
                    </Button>
                </div>
            );
        }

        switch (field.type) {
            case 'text':
                return (
                    <Input 
                        className="h-10 border-slate-200 focus-visible:ring-primary text-sm shadow-sm"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Nhập ${field.label.toLowerCase()}...`}
                    />
                );
            case 'textarea':
            case 'rich-text':
                return (
                    <RichTextEditorWidget 
                        value={value} 
                        onChange={onChange} 
                        label={field.label}
                    />
                );
            case 'color':
                return (
                    <div className="flex gap-2 items-center">
                        <Input 
                            type="color"
                            className="h-10 w-12 p-1 border-slate-200 cursor-pointer shadow-sm"
                            value={value || '#000000'}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        <Input 
                            className="h-10 flex-grow border-slate-200 focus-visible:ring-primary text-sm shadow-sm"
                            value={value || '#000000'}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                );
            case 'number':
                return (
                    <Input 
                        type="number"
                        className="h-10 border-slate-200 focus-visible:ring-primary text-sm shadow-sm"
                        value={value || 0}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                    />
                );
            case 'select':
                return (
                    <Select 
                        value={value || ''}
                        onValueChange={onChange}
                    >
                        <SelectTrigger className="h-10 border-slate-200 focus-visible:ring-primary shadow-sm bg-white">
                            <SelectValue placeholder="Chọn giá trị..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'image':
                return (
                    <div className="space-y-2">
                        {value ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-slate-50 group">
                                <img 
                                    src={value} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        className="h-7 text-[10px] font-bold uppercase"
                                        onClick={() => onPickImage(field.id, path)}
                                    >
                                        Thay đổi ảnh
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="aspect-video rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-400"
                                onClick={() => onPickImage(field.id, path)}
                            >
                                <Zap className="h-6 w-6 opacity-20" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Chọn hình ảnh</span>
                            </div>
                        )}
                        <Input 
                            className="h-8 text-[10px] border-slate-100 bg-slate-50 focus-visible:ring-primary truncate"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Hoặc dán URL ảnh tại đây..."
                        />
                    </div>
                );
            case 'info':
                return (
                    <Alert className="bg-blue-50/50 border-blue-200 shadow-sm">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertTitle className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                            {field.label}
                        </AlertTitle>
                        <AlertDescription className="text-xs text-blue-600 leading-relaxed mb-3">
                            {field.description}
                        </AlertDescription>
                        {field.action && (
                            <Button 
                                size="sm" 
                                className="w-full h-8 text-[10px] font-bold uppercase bg-blue-600 hover:bg-blue-700 shadow-sm"
                                onClick={() => field.action.url ? (field.action.url.startsWith('http') ? window.open(field.action.url, '_blank') : navigate(field.action.url)) : null}
                            >
                                <ExternalLink className="w-3 h-3 mr-1.5" />
                                {field.action.label}
                            </Button>
                        )}
                    </Alert>
                );
            // rich-text case has been merged with textarea case above
            default:
                return null;
        }
    };

    if (!section) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/10">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                    <Settings2 className="h-8 w-8 text-slate-300" />
                </div>
                <h4 className="text-sm font-bold text-slate-400">Chưa chọn phần tử</h4>
                <p className="text-[11px] text-slate-400 mt-1">Bấm vào các khối trên trang hoặc trong danh sách cấu trúc để chỉnh sửa thuộc tính.</p>
            </div>
        );
    }

    const handleFieldChange = (fieldId: string, value: any) => {
        const newProps = { ...(section.props || {}), [fieldId]: value };
        updateSection(section.id, { props: newProps });
    };

    return (
        <div className="flex-grow flex flex-col overflow-hidden bg-white">
            <div className="p-4 flex items-center justify-between border-b bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Thuộc tính: {blockDef?.name || section.type}
                    </h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedSectionId(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-6">
                {blockDef?.fields?.map((field: any) => (
                    <div key={field.id} className="space-y-2.5" id={`property-field-${field.id}`}>
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                            {field.label}
                        </Label>
                        
                        {renderField(field, section.props, (value) => handleFieldChange(field.id, value))}
                    </div>
                ))}
                
                {(!blockDef?.fields || blockDef.fields.length === 0) && (
                    <div className="text-center py-10 opacity-40 grayscale flex flex-col items-center">
                        <Settings2 className="h-8 w-8 mb-2" />
                        <p className="text-[10px] font-bold">Khối này chưa có thuộc tính tùy chỉnh</p>
                    </div>
                )}
            </div>
        </div>
    );
};
