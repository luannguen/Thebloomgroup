import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, Globe, Contact, Share2, Settings, Code as CodeIcon, RotateCcw } from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { mediaService } from '@/services/mediaService';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sub-components
import GeneralSettings from './settings/GeneralSettings';
import ContactSettings from './settings/ContactSettings';
import SocialSettings from './settings/SocialSettings';
import ConfigSettings from './settings/ConfigSettings';
import AdvancedSettings from './settings/AdvancedSettings';

interface Branch {
    id: string;
    title: string;
    subtitle?: string;
    address: string;
    phone: string;
    email: string;
    map_url?: string;
}

const SettingsPage: React.FC = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [initialSettings, setInitialSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [activeTab, setActiveTab] = useState('general');

    // Uploading states
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);
    const [uploadingOgImage, setUploadingOgImage] = useState(false);
    const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const result = await settingsService.getSettings();
        if (result.success && result.data) {
            const settingsMap: Record<string, string> = {};
            result.data.forEach(item => {
                settingsMap[item.key] = item.value;
            });
            setSettings(settingsMap);
            setInitialSettings({ ...settingsMap });

            // Parse branches if exist in contact_address
            if (settingsMap.contact_address) {
                try {
                    const rawValue = settingsMap.contact_address;
                    if (rawValue.startsWith('[') || rawValue.startsWith('{')) {
                        const parsedBranches = JSON.parse(rawValue);
                        setBranches(Array.isArray(parsedBranches) ? parsedBranches : [parsedBranches]);
                    } else if (rawValue.trim()) {
                        // Fallback for legacy plain text address
                        setBranches([{
                            id: 'legacy-1',
                            title: 'Trụ sở chính',
                            address: rawValue,
                            phone: settingsMap.contact_phone || '',
                            email: settingsMap.contact_email || ''
                        }]);
                    }
                } catch (error) {
                    console.error('Error parsing branches:', error);
                }
            }
        } else {
            toast.error(t('failed_to_fetch_settings'));
        }
        setLoading(false);
    };

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        
        // Unify branches into contact_address key
        const finalSettings = { ...settings };
        finalSettings['contact_address'] = JSON.stringify(branches);

        const settingsArray = Object.entries(finalSettings).map(([key, value]) => ({
            key,
            value: value || ''
        }));

        const result = await settingsService.updateSettings(settingsArray);
        if (result.success) {
            toast.success(t('settings_updated_successfully'));
            setInitialSettings({ ...finalSettings });
        } else {
            toast.error(t('failed_to_update_settings'));
        }
        setSaving(false);
    };

    const handleReset = () => {
        setSettings({ ...initialSettings });
        if (initialSettings.contact_address) {
            try {
                const rawValue = initialSettings.contact_address;
                if (rawValue.startsWith('[') || rawValue.startsWith('{')) {
                    const parsed = JSON.parse(rawValue);
                    setBranches(Array.isArray(parsed) ? parsed : [parsed]);
                }
            } catch (e) {}
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, setUploading: (val: boolean) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error(t('file_size_too_large'));
            return;
        }

        setUploading(true);
        try {
            // Use mediaService instead of direct supabase to bypass RLS issues in admin panel
            const result = await mediaService.uploadImage(file, 'settings');
            
            if (result && result.url) {
                handleChange(key, result.url);
                toast.success(t('image_uploaded_successfully'));
            } else {
                throw new Error('Upload failed: No URL returned');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(t('failed_to_upload_image'));
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (key: string) => {
        handleChange(key, '');
    };

    const handleAddBranch = () => {
        setBranches([...branches, { 
            id: Date.now().toString(),
            title: '', 
            address: '', 
            phone: '',
            email: ''
        }]);
    };

    const handleBranchChange = (index: number, field: keyof Branch, value: string) => {
        const newBranches = [...branches];
        newBranches[index] = { ...newBranches[index], [field]: value };
        setBranches(newBranches);
    };

    const handleRemoveBranch = (index: number) => {
        const newBranches = branches.filter((_, i) => i !== index);
        setBranches(newBranches);
    };

    const hasChanges = JSON.stringify({ ...settings, contact_address: JSON.stringify(branches) }) !== 
                       JSON.stringify({ ...initialSettings, contact_address: initialSettings.contact_address || '[]' });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/60 backdrop-blur-md sticky top-0 z-10 py-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('system_settings')}</h1>
                    <p className="text-muted-foreground">Quản lý cấu hình toàn hệ thống, nhận diện thương hiệu và SEO.</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <Button 
                            variant="ghost" 
                            onClick={handleReset} 
                            disabled={saving}
                            className="text-muted-foreground"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            {t('reset')}
                        </Button>
                    )}
                    <Button 
                        onClick={handleSave} 
                        disabled={saving || !hasChanges}
                        className="min-w-[120px] shadow-lg shadow-primary/20"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {t('save_changes')}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex overflow-x-auto pb-2 mb-4">
                    <TabsList className="h-auto p-1 bg-muted/50 rounded-xl inline-flex w-full md:w-auto">
                        <TabsTrigger value="general" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="hidden sm:inline">Thông tin chung</span>
                            <span className="sm:hidden">Chung</span>
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                            <Contact className="h-4 w-4" />
                            <span className="hidden sm:inline">Liên hệ & Chi nhánh</span>
                            <span className="sm:hidden">Liên hệ</span>
                        </TabsTrigger>
                        <TabsTrigger value="social" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Mạng xã hội</span>
                            <span className="sm:hidden">MXH</span>
                        </TabsTrigger>
                        <TabsTrigger value="config" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Cấu hình Website</span>
                            <span className="sm:hidden">Cấu hình</span>
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                            <CodeIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Nâng cao</span>
                            <span className="sm:hidden">Script</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="mt-2">
                    <TabsContent value="general" className="focus-visible:outline-none animate-in slide-in-from-left-4 duration-300">
                        <GeneralSettings 
                            settings={settings}
                            handleChange={handleChange}
                            handleImageUpload={handleImageUpload}
                            handleRemoveImage={handleRemoveImage}
                            uploadingLogo={uploadingLogo}
                            setUploadingLogo={setUploadingLogo}
                            uploadingFavicon={uploadingFavicon}
                            setUploadingFavicon={setUploadingFavicon}
                            uploadingOgImage={uploadingOgImage}
                            setUploadingOgImage={setUploadingOgImage}
                            uploadingFooterLogo={uploadingFooterLogo}
                            setUploadingFooterLogo={setUploadingFooterLogo}
                        />
                    </TabsContent>

                    <TabsContent value="contact" className="focus-visible:outline-none animate-in slide-in-from-left-4 duration-300">
                        <ContactSettings 
                            settings={settings}
                            handleChange={handleChange}
                            branches={branches}
                            handleAddBranch={handleAddBranch}
                            handleBranchChange={handleBranchChange}
                            handleRemoveBranch={handleRemoveBranch}
                        />
                    </TabsContent>

                    <TabsContent value="social" className="focus-visible:outline-none animate-in slide-in-from-left-4 duration-300">
                        <SocialSettings 
                            settings={settings}
                            handleChange={handleChange}
                        />
                    </TabsContent>

                    <TabsContent value="config" className="focus-visible:outline-none animate-in slide-in-from-left-4 duration-300">
                        <ConfigSettings 
                            settings={settings}
                            handleChange={handleChange}
                            branches={branches}
                        />
                    </TabsContent>

                    <TabsContent value="advanced" className="focus-visible:outline-none animate-in slide-in-from-left-4 duration-300">
                        <AdvancedSettings 
                            settings={settings}
                            handleChange={handleChange}
                        />
                    </TabsContent>
                </div>
            </Tabs>
            
            {/* Footer space */}
            <div className="h-12"></div>
        </div>
    );
};

export default SettingsPage;
