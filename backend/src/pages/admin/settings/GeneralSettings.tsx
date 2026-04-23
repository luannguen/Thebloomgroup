import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GeneralSettingsProps {
    settings: Record<string, string>;
    handleChange: (key: string, value: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string, setUploading: (val: boolean) => void) => Promise<void>;
    handleRemoveImage: (key: string) => void;
    uploadingLogo: boolean;
    setUploadingLogo: (val: boolean) => void;
    uploadingFavicon: boolean;
    setUploadingFavicon: (val: boolean) => void;
    uploadingOgImage: boolean;
    setUploadingOgImage: (val: boolean) => void;
    uploadingFooterLogo: boolean;
    setUploadingFooterLogo: (val: boolean) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    settings,
    handleChange,
    handleImageUpload,
    handleRemoveImage,
    uploadingLogo,
    setUploadingLogo,
    uploadingFavicon,
    setUploadingFavicon,
    uploadingOgImage,
    setUploadingOgImage,
    uploadingFooterLogo,
    setUploadingFooterLogo
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Brand Identity */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('brand_identity')}</CardTitle>
                    <CardDescription>Quản lý Logo, Favicon và hình ảnh nhận diện thương hiệu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Website Logo */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <Label className="mb-2 block">{t('website_logo')}</Label>
                            {settings['site_logo'] ? (
                                <div className="relative group w-32">
                                    <img
                                        src={settings['site_logo']}
                                        alt="Site Logo"
                                        className="h-32 w-32 object-contain bg-gray-50 border rounded-lg p-2"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage('site_logo')}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-32 w-32 border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/30">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                </div>
                            )}
                            <div className="mt-3">
                                <Label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center justify-center w-full px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-xs font-medium transition-colors">
                                    {uploadingLogo ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Upload className="h-3 w-3 mr-2" />}
                                    {uploadingLogo ? t('uploading') : t('change_logo')}
                                </Label>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'site_logo', setUploadingLogo)}
                                    disabled={uploadingLogo}
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 pt-6 md:pt-8">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    {t('logo_recommendation')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                        {/* Footer Logo */}
                        <div className="space-y-4">
                            <Label>{t('footer_logo_label')}</Label>
                            <div className="flex gap-4">
                                {settings['footer_logo'] ? (
                                    <div className="relative group">
                                        <img
                                            src={settings['footer_logo']}
                                            alt="Footer Logo"
                                            className="h-20 w-32 object-contain bg-primary border rounded-md p-2"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage('footer_logo')}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-20 w-32 border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/30">
                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <p className="text-xs text-muted-foreground">Sử dụng cho phần dưới trang. Nếu để trống sẽ sử dụng Logo Header.</p>
                                    <Label htmlFor="footer-logo-upload" className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-input bg-background hover:bg-accent rounded-md text-xs font-medium transition-colors">
                                        {uploadingFooterLogo ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Upload className="h-3 w-3 mr-2" />}
                                        {uploadingFooterLogo ? t('uploading') : t('change_logo')}
                                    </Label>
                                    <input
                                        id="footer-logo-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'footer_logo', setUploadingFooterLogo)}
                                        disabled={uploadingFooterLogo}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Favicon */}
                        <div className="space-y-4">
                            <Label>Favicon (Biểu tượng trình duyệt)</Label>
                            <div className="flex gap-4">
                                {settings['favicon_url'] ? (
                                    <div className="relative group">
                                        <img
                                            src={settings['favicon_url']}
                                            alt="Favicon"
                                            className="h-16 w-16 object-contain bg-gray-50 border rounded-md p-1"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage('favicon_url')}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/30">
                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <p className="text-xs text-muted-foreground">Khuyên dùng ảnh vuông, .ico hoặc .png (32x32px).</p>
                                    <Label htmlFor="favicon-upload" className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-input bg-background hover:bg-accent rounded-md text-xs font-medium transition-colors">
                                        {uploadingFavicon ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Upload className="h-3 w-3 mr-2" />}
                                        {uploadingFavicon ? t('uploading') : 'Đổi Favicon'}
                                    </Label>
                                    <input
                                        id="favicon-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*,.ico"
                                        onChange={(e) => handleImageUpload(e, 'favicon_url', setUploadingFavicon)}
                                        disabled={uploadingFavicon}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OG Image */}
                    <div className="pt-6 border-t space-y-4">
                        <Label>Ảnh Mạng Xã Hội (OG Image)</Label>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                {settings['og_image_url'] ? (
                                    <div className="relative group">
                                        <img
                                            src={settings['og_image_url']}
                                            alt="OG Image"
                                            className="h-32 w-auto max-w-[240px] object-cover bg-gray-50 border rounded-md p-1"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage('og_image_url')}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-32 w-56 border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/30">
                                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Ảnh hiển thị khi chia sẻ link lên Facebook, Zalo, Twitter. Khuyên dùng tỉ lệ 1200x630px.
                                </p>
                                <Label htmlFor="og-image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent rounded-md text-sm font-medium transition-colors">
                                    {uploadingOgImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                                    {uploadingOgImage ? t('uploading') : 'Cập nhật Ảnh chia sẻ'}
                                </Label>
                                <input
                                    id="og-image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'og_image_url', setUploadingOgImage)}
                                    disabled={uploadingOgImage}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* General Info & SEO */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('general_info_seo')}</CardTitle>
                    <CardDescription>Cấu hình các thông tin cơ bản và tối ưu hóa tìm kiếm (SEO) cho Website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>{t('company_name')}</Label>
                            <Input
                                value={settings['company_name'] || ''}
                                onChange={(e) => handleChange('company_name', e.target.value)}
                                placeholder="Tên công ty"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('slogan')}</Label>
                            <Input
                                value={settings['company_slogan'] || ''}
                                onChange={(e) => handleChange('company_slogan', e.target.value)}
                                placeholder="Slogan công ty"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('meta_title')}</Label>
                        <Input
                            value={settings['site_title'] || ''}
                            onChange={(e) => handleChange('site_title', e.target.value)}
                            placeholder="Tiêu đề trang web"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('meta_description')}</Label>
                        <Textarea
                            rows={3}
                            value={settings['site_description'] || ''}
                            onChange={(e) => handleChange('site_description', e.target.value)}
                            placeholder="Mô tả trang web cho SEO"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Từ Khóa SEO (Meta Keywords)</Label>
                        <Input
                            value={settings['site_keywords'] || ''}
                            onChange={(e) => handleChange('site_keywords', e.target.value)}
                            placeholder="từ khóa 1, từ khóa 2..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('copyright_text_label')}</Label>
                        <Textarea
                            rows={2}
                            value={settings['copyright_text'] || ''}
                            onChange={(e) => handleChange('copyright_text', e.target.value)}
                            placeholder={t('copyright_text_placeholder')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GeneralSettings;
