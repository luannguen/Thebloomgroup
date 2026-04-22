import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { teamService } from '@/services/teamService';
import { TeamMember } from '@/components/data/types';
import { Linkedin, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { EditableElement } from '../admin/EditableElement';

// --- Team Hero Block ---
interface TeamHeroBlockProps {
  title: string;
  description: string;
  sectionId?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export const TeamHeroBlock = ({ 
  title = "ĐỘI NGŨ CHUYÊN GIA THEBLOOMGROUP", 
  description = "Hội tụ những tinh hoa trong ngành kỹ thuật lạnh...",
  sectionId,
  titleColor = 'var(--primary)',
  descriptionColor = 'var(--muted-foreground)'
}: TeamHeroBlockProps) => (
  <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-20">
    <div className="container mx-auto px-4 text-center">
      <EditableElement 
        tagName="h1" 
        fieldKey="title" 
        sectionId={sectionId}
        defaultContent={title} 
        className="text-3xl md:text-5xl font-bold text-primary mb-6" 
        style={{ color: titleColor }}
      />
      <EditableElement 
        tagName="p" 
        fieldKey="description" 
        sectionId={sectionId}
        defaultContent={description} 
        className="text-lg text-muted-foreground max-w-3xl mx-auto" 
        style={{ color: descriptionColor }}
      />
    </div>
  </div>
);

// --- Team Grid Block ---
interface TeamGridBlockProps {
  title: string;
  description: string;
  sectionId?: string;
}

export const TeamGridBlock = ({ 
  title = "GẶP GỠ ĐỘI NGŨ CỦA CHÚNG TÔI", 
  description = "Đội ngũ kỹ sư và chuyên viên dày dặn kinh nghiệm...",
  sectionId
}: TeamGridBlockProps) => {
    const { t } = useTranslation();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            setLoading(true);
            const result = await teamService.getAll();
            if (result.success) {
                setMembers(result.data);
            }
            setLoading(false);
        };

        fetchTeam();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <EditableElement 
                    tagName="h2" 
                    fieldKey="title" 
                    sectionId={sectionId}
                    defaultContent={title} 
                    className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4" 
                />
                <EditableElement 
                    tagName="p" 
                    fieldKey="description" 
                    sectionId={sectionId}
                    defaultContent={description} 
                    className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto" 
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {members.map((member) => (
                        <div key={member.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                            <div className="relative h-64 overflow-hidden">
                                {member.image_url ? (
                                    <img
                                        src={member.image_url}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        <span className="text-4xl">?</span>
                                    </div>
                                )}
                                {/* Overlay with social links */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                                    {member.social_links?.linkedin && (
                                        <a href={member.social_links.linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                    {member.social_links?.twitter && (
                                        <a href={member.social_links.twitter} target="_blank" rel="noreferrer" className="text-white hover:text-blue-300 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                    )}
                                    {member.social_links?.facebook && (
                                        <a href={member.social_links.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-blue-600 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                    )}
                                    {member.social_links?.instagram && (
                                        <a href={member.social_links.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-pink-500 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                    )}
                                    {member.social_links?.email && (
                                        <a href={`mailto:${member.social_links.email}`} className="text-white hover:text-red-400 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20">
                                            <Mail className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                                <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                                {member.bio && (
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                        {member.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
