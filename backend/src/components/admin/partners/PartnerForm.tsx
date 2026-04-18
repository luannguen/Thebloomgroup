import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Partner } from '@/services/partnerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, X, Globe, Image as ImageIcon } from 'lucide-react';
import { mediaService } from '@/services/mediaService';
import { toast } from 'react-hot-toast';

interface PartnerFormProps {
    initialData?: Partner;
    onSave: (data: Partial<Partner>) => Promise<void>;
    onCancel: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({ initialData, onSave, onCancel }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Partial<Partner>>(
        initialData || {
            name: '',
            logo_url: '',
            website_url: '',
            display_order: 0,
            is_active: true,
        }
    );
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, is_active: checked }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        setUploading(true);
        try {
            const result = await mediaService.uploadImage(file, 'partners');
            if (result) {
                setFormData((prev) => ({ ...prev, logo_url: result.url }));
                toast.success(t('logo_uploaded'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('upload_logo_fail'));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            toast.success(t('partner_saved'));
        } catch (error) {
            console.error(error);
            toast.error(t('save_partner_fail'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900">
                {initialData ? t('edit_partner') : t('add_partner')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('partner_name')}</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website_url">{t('partner_website')}</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                id="website_url"
                                name="website_url"
                                value={formData.website_url || ''}
                                onChange={handleChange}
                                className="pl-9"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="display_order">{t('order')}</Label>
                        <Input
                            id="display_order"
                            name="display_order"
                            type="number"
                            value={formData.display_order || 0}
                            onChange={(e) => setFormData(p => ({ ...p, display_order: parseInt(e.target.value) }))}
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={handleSwitchChange}
                        />
                        <Label htmlFor="is_active">{t('is_active')}</Label>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label>{t('partner_logo')}</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 min-h-[200px]">
                        {formData.logo_url ? (
                            <div className="relative group">
                                <img
                                    src={formData.logo_url}
                                    alt="Logo preview"
                                    className="max-h-40 max-w-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, logo_url: '' }))}
                                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                {uploading ? (
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
                                ) : (
                                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto" />
                                )}
                                <div className="mt-4">
                                    <label htmlFor="logo-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                                        {uploading ? t('uploading') : t('click_to_upload')}
                                    </label>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG, SVG up to 2MB</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    {t('cancel')}
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save')}
                </Button>
            </div>
        </form>
    );
};

export default PartnerForm;
