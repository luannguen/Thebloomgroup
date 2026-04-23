import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Branch {
    id: string;
    title: string;
    subtitle?: string;
    address: string;
    phone: string;
    email: string;
    map_url?: string;
}

interface ContactSettingsProps {
    settings: Record<string, string>;
    handleChange: (key: string, value: string) => void;
    branches: Branch[];
    handleAddBranch: () => void;
    handleBranchChange: (index: number, field: keyof Branch, value: string) => void;
    handleRemoveBranch: (index: number) => void;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({
    settings,
    handleChange,
    branches,
    handleAddBranch,
    handleBranchChange,
    handleRemoveBranch
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Main Contact Info */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('contact_details')}</CardTitle>
                    <CardDescription>Cấu hình thông tin liên hệ chính của công ty.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                {t('phone')}
                            </Label>
                            <Input
                                value={settings['contact_phone'] || ''}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                placeholder="+84..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                {t('hotline')}
                            </Label>
                            <Input
                                value={settings['contact_hotline'] || ''}
                                onChange={(e) => handleChange('contact_hotline', e.target.value)}
                                placeholder="1800..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                {t('email')}
                            </Label>
                            <Input
                                value={settings['contact_email'] || ''}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                placeholder="info@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                {t('working_hours')}
                            </Label>
                            <Input
                                value={settings['contact_working_hours'] || ''}
                                onChange={(e) => handleChange('contact_working_hours', e.target.value)}
                                placeholder="8:00 - 17:30..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Branches Management */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Địa chỉ & Hệ thống Chi nhánh</CardTitle>
                        <CardDescription>Quản lý danh sách các văn phòng, chi nhánh hiển thị trên Website.</CardDescription>
                    </div>
                    <Button onClick={handleAddBranch} variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm chi nhánh
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {branches.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {branches.map((branch, index) => (
                                <div key={branch.id || index} className="relative p-6 border rounded-xl bg-muted/10 space-y-6">
                                    <button
                                        onClick={() => handleRemoveBranch(index)}
                                        className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                        title={t('delete')}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tên Chi nhánh / Văn phòng</Label>
                                            <Input
                                                value={branch.title}
                                                onChange={(e) => handleBranchChange(index, 'title', e.target.value)}
                                                placeholder="e.g. Trụ sở chính, Văn phòng đại diện..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tiêu đề phụ (Vị trí)</Label>
                                            <Input
                                                value={branch.subtitle || ''}
                                                onChange={(e) => handleBranchChange(index, 'subtitle', e.target.value)}
                                                placeholder="e.g. TP. Hồ Chí Minh, Vũng Tàu..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Địa chỉ chi tiết</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-10"
                                                value={branch.address}
                                                onChange={(e) => handleBranchChange(index, 'address', e.target.value)}
                                                placeholder="Số nhà, tên đường, quận/huyện..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Số điện thoại</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-10"
                                                    value={branch.phone}
                                                    onChange={(e) => handleBranchChange(index, 'phone', e.target.value)}
                                                    placeholder="+84..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-10"
                                                    value={branch.email}
                                                    onChange={(e) => handleBranchChange(index, 'email', e.target.value)}
                                                    placeholder="branch@company.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Google Maps Link (Tùy chọn)</Label>
                                        <Input
                                            value={branch.map_url || ''}
                                            onChange={(e) => handleBranchChange(index, 'map_url', e.target.value)}
                                            placeholder="https://maps.app.goo.gl/..."
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/5">
                            <MapPin className="h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-sm text-muted-foreground">Chưa có chi nhánh nào được thêm.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactSettings;
