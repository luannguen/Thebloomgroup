import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Map as MapIcon, ShieldCheck, Zap, Globe, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ConfigSettingsProps {
    settings: Record<string, string>;
    handleChange: (key: string, value: string) => void;
    branches: any[];
}

const SUPPORTED_LANGUAGES = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
    { code: 'sr', name: 'Српски', flag: '🇷🇸' },
];

const ConfigSettings: React.FC<ConfigSettingsProps> = ({ settings, handleChange, branches }) => {
    const { t } = useTranslation();

    const enabledLanguages = React.useMemo(() => {
        try {
            const val = settings['enabled_languages'];
            if (!val) return SUPPORTED_LANGUAGES.map(l => l.code);
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : SUPPORTED_LANGUAGES.map(l => l.code);
        } catch (e) {
            return SUPPORTED_LANGUAGES.map(l => l.code);
        }
    }, [settings['enabled_languages']]);

    const handleLanguageToggle = (code: string, checked: boolean) => {
        let newEnabled = [...enabledLanguages];
        if (checked) {
            if (!newEnabled.includes(code)) newEnabled.push(code);
        } else {
            if (code === 'vi') return; // Không cho phép tắt tiếng Việt
            newEnabled = newEnabled.filter(c => c !== code);
        }
        handleChange('enabled_languages', JSON.stringify(newEnabled));
    };

    return (
        <div className="space-y-6">
            {/* System Config */}
            <Card className="border-primary/20 shadow-sm">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Globe className="h-5 w-5" />
                        Cấu hình Hệ thống & Tên miền
                    </CardTitle>
                    <CardDescription>Các thông tin định danh chính xác của Website trên môi trường Internet.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                Tên miền Website (Domain URL)
                            </Label>
                            <Input
                                value={settings['site_url'] || ''}
                                onChange={(e) => handleChange('site_url', e.target.value)}
                                placeholder="https://thebloomgroup.vn"
                                className="font-mono text-sm"
                            />
                            <p className="text-[10px] text-muted-foreground">URL chính thức của website, dùng cho SEO và các liên kết tuyệt đối.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Địa chỉ Trụ sở chính
                            </Label>
                            <Input
                                value={branches[0]?.address || (typeof settings['contact_address'] === 'string' && !settings['contact_address']?.startsWith('[') ? settings['contact_address'] : '')}
                                readOnly
                                className="bg-muted/50 cursor-not-allowed"
                                placeholder="Số 123, Đường ABC, Quận XYZ..."
                            />
                            <p className="text-[10px] text-muted-foreground italic">
                                * Chỉnh sửa chi tiết tại tab <strong>Liên hệ & Chi nhánh</strong>.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Website Behavior */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Cấu hình Trang chủ
                        </CardTitle>
                        <CardDescription>Định cấu hình hành vi cơ bản của website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                            <div className="space-y-0.5">
                                <Label>Bảo trì Website</Label>
                                <p className="text-xs text-muted-foreground">Chế độ này sẽ tạm đóng web để bảo trì.</p>
                            </div>
                            <Switch
                                checked={settings['maintenance_mode'] === 'true'}
                                onCheckedChange={(checked) => handleChange('maintenance_mode', checked.toString())}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            {t('security_settings')}
                        </CardTitle>
                        <CardDescription>Các thiết lập bảo vệ website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                            <div className="space-y-0.5">
                                <Label>Chống sao chép nội dung</Label>
                                <p className="text-xs text-muted-foreground">Chặn chuột phải và phím tắt copy.</p>
                            </div>
                            <Switch
                                checked={settings['security_disable_copy'] === 'true'}
                                onCheckedChange={(checked) => handleChange('security_disable_copy', checked.toString())}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                            <div className="space-y-0.5">
                                <Label>{t('enable_captcha')}</Label>
                                <p className="text-xs text-muted-foreground">Bật Google reCAPTCHA cho form liên hệ.</p>
                            </div>
                            <Switch
                                checked={settings['enable_captcha'] === 'true'}
                                onCheckedChange={(checked) => handleChange('enable_captcha', checked.toString())}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Language Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Cấu hình Đa ngôn ngữ
                    </CardTitle>
                    <CardDescription>Bật hoặc tắt các ngôn ngữ hiển thị trên Website Client.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <div key={lang.code} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{lang.flag}</span>
                                    <div className="flex flex-col">
                                        <Label className="cursor-pointer">{lang.name}</Label>
                                        <span className="text-[10px] text-muted-foreground uppercase">{lang.code}</span>
                                    </div>
                                </div>
                                <Switch
                                    checked={enabledLanguages.includes(lang.code)}
                                    onCheckedChange={(checked) => handleLanguageToggle(lang.code, checked)}
                                    disabled={lang.code === 'vi'}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-xs text-muted-foreground">
                            <strong className="text-primary">Lưu ý:</strong> Ngôn ngữ Tiếng Việt là mặc định và không thể tắt. Việc tắt một ngôn ngữ sẽ ẩn nó khỏi menu chọn ngôn ngữ ở trang chủ.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Google Map */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapIcon className="h-5 w-5 text-primary" />
                        {t('google_map_embed')}
                    </CardTitle>
                    <CardDescription>Dán mã nhúng iframe từ Google Maps để hiển thị bản đồ trên trang liên hệ.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Mã nhúng (Iframe Code)</Label>
                        <Textarea
                            rows={4}
                            value={settings['map_embed_url'] || ''}
                            onChange={(e) => handleChange('map_embed_url', e.target.value)}
                            placeholder='<iframe src="..." ...></iframe>'
                            className="font-mono text-xs"
                        />
                    </div>
                    {settings['map_embed_url'] && (
                        <div className="pt-4 border-t">
                            <Label className="mb-2 block text-xs">Xem trước (Preview):</Label>
                            <div
                                className="w-full h-48 rounded-lg overflow-hidden border bg-muted"
                                dangerouslySetInnerHTML={{ __html: settings['map_embed_url'] }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Tính năng Website
                    </CardTitle>
                    <CardDescription>Bật/tắt các thành phần trên giao diện người dùng.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                        <div className="space-y-0.5">
                            <Label>Cho phép tải Hồ sơ năng lực</Label>
                            <p className="text-xs text-muted-foreground">Hiển thị nút tải Profile ở Header/Footer.</p>
                        </div>
                        <Switch
                            checked={settings['enable_profile_download'] === 'true'}
                            onCheckedChange={(checked) => handleChange('enable_profile_download', checked.toString())}
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                        <div className="space-y-0.5">
                            <Label>Hiển thị Nút Zalo</Label>
                            <p className="text-xs text-muted-foreground">Nút chat nhanh Zalo góc màn hình.</p>
                        </div>
                        <Switch
                            checked={settings['show_zalo_button'] === 'true'}
                            onCheckedChange={(checked) => handleChange('show_zalo_button', checked.toString())}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConfigSettings;

