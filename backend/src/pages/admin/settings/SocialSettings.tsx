import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Youtube, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocialSettingsProps {
    settings: Record<string, string>;
    handleChange: (key: string, value: string) => void;
}

const SocialSettings: React.FC<SocialSettingsProps> = ({ settings, handleChange }) => {
    const { t } = useTranslation();

    const socialPlatforms = [
        {
            id: 'social_facebook',
            name: 'Facebook',
            icon: Facebook,
            placeholder: 'https://facebook.com/yourpage',
            color: 'text-blue-600'
        },
        {
            id: 'social_zalo',
            name: 'Zalo',
            icon: MessageCircle,
            placeholder: 'Link OA hoặc số điện thoại Zalo',
            color: 'text-blue-400'
        },
        {
            id: 'social_youtube',
            name: 'Youtube',
            icon: Youtube,
            placeholder: 'https://youtube.com/@yourchannel',
            color: 'text-red-600'
        },
        {
            id: 'social_tiktok',
            name: 'TikTok',
            icon: Send, // Using Send as a placeholder if TikTok icon is missing, but let's just use it for Telegram
            placeholder: 'https://tiktok.com/@yourprofile',
            color: 'text-black'
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('social_links')}</CardTitle>
                <CardDescription>Cấu hình các liên kết mạng xã hội hiển thị ở Footer và trang liên hệ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {socialPlatforms.map((platform) => (
                        <div key={platform.id} className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <platform.icon className={`h-4 w-4 ${platform.color}`} />
                                {platform.name}
                            </Label>
                            <Input
                                value={settings[platform.id] || ''}
                                onChange={(e) => handleChange(platform.id, e.target.value)}
                                placeholder={platform.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default SocialSettings;
