import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { partnerService, Partner } from '@/services/partnerService';
import { Button } from '@/components/ui/button';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Search, 
    Loader2, 
    ExternalLink, 
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PartnerForm from '@/components/admin/partners/PartnerForm';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PartnersPage: React.FC = () => {
    const { t } = useTranslation();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPartner, setCurrentPartner] = useState<Partner | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        setLoading(true);
        try {
            const data = await partnerService.getAll();
            setPartners(data);
        } catch (error) {
            console.error(error);
            toast.error(t('error_loading_partners'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setCurrentPartner(undefined);
        setIsEditing(true);
    };

    const handleEdit = (partner: Partner) => {
        setCurrentPartner(partner);
        setIsEditing(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const result = await partnerService.delete(deleteId);
            if (result.success) {
                toast.success(t('delete_success'));
                loadPartners();
            } else {
                toast.error((result as any).error.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('delete_error'));
        } finally {
            setDeleteId(null);
        }
    };

    const handleSave = async (data: Partial<Partner>) => {
        try {
            let result;
            if (currentPartner) {
                result = await partnerService.update(currentPartner.id, data);
            } else {
                result = await partnerService.create(data);
            }

            if (result.success) {
                setIsEditing(false);
                loadPartners();
            } else {
                toast.error((result as any).error.message);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const filteredPartners = partners.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && partners.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('partners_management')}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('manage_partners_description', 'Quản lý danh sách các đối tác và khách hàng chiến lược.')}
                    </p>
                </div>
                {!isEditing && (
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> {t('add_partner')}
                    </Button>
                )}
            </div>

            {isEditing ? (
                <PartnerForm 
                    initialData={currentPartner}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-2">
                        <Search className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search_partners', 'Tìm kiếm đối tác...')}
                            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPartners.length > 0 ? (
                            filteredPartners.map((partner) => (
                                <div key={partner.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="aspect-video bg-gray-50 flex items-center justify-center p-6 border-b relative group">
                                        {partner.logo_url ? (
                                            <img 
                                                src={partner.logo_url} 
                                                alt={partner.name} 
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-gray-300 flex flex-col items-center">
                                                <ImageIcon className="h-10 w-10 mb-2" />
                                                <span className="text-xs">No Logo</span>
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-2 right-2">
                                            {partner.is_active ? (
                                                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                            ) : (
                                                <span className="flex h-2 w-2 rounded-full bg-gray-300"></span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 truncate">{partner.name}</h3>
                                        <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
                                            <span>{t('order')}: {partner.display_order}</span>
                                            {partner.website_url && (
                                                <a 
                                                    href={partner.website_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center hover:text-blue-600 ml-auto"
                                                >
                                                    <ExternalLink className="h-3 w-3 mr-1" />
                                                    {t('visit_website', 'Website')}
                                                </a>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleEdit(partner)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => setDeleteId(partner.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
                                <p className="text-gray-500">{searchTerm ? t('no_search_results') : t('no_partners')}</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('confirm_delete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('confirm_delete_partner')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PartnersPage;
