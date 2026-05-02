import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, FileCheck, Wrench, Cog, Shield, Clock, HelpCircle, LucideIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { serviceService, Service, ServiceCategory } from '@/services/serviceService';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';

const iconMap: Record<string, LucideIcon> = {
  FileCheck,
  Wrench,
  Cog,
  Shield,
  Clock,
  HelpCircle,
  default: FileCheck
};

interface ServiceGridBlockProps {
  title?: string;
  description?: string;
  sectionId?: string;
}

export const ServiceGridBlock = ({ 
  title: propTitle, 
  description: propDescription,
  sectionId 
}: ServiceGridBlockProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, servicesRes] = await Promise.all([
          serviceService.getCategories(),
          serviceService.getServices()
        ]);

        if (catRes.success) setCategories(catRes.data || []);
        if (servicesRes.success) setServices(servicesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch services data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return iconMap.default;
    return iconMap[iconName] || iconMap.default;
  };

  const filteredServices = selectedCategoryId 
    ? services.filter(s => s.category_id === selectedCategoryId)
    : services;

  const title = propTitle || t('service_cat_title');
  const description = propDescription || t('service_cat_desc', "Chúng tôi cung cấp đầy đủ các dịch vụ điện lạnh công nghiệp và dân dụng, từ tư vấn thiết kế đến lắp đặt, bảo trì và sửa chữa.");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <EditableElement
            tagName="h2"
            fieldKey="title"
            sectionId={sectionId}
            defaultContent={title}
            className="mb-4 text-3xl md:text-4xl font-bold"
          />
          <EditableElement
            tagName="p"
            fieldKey="description"
            sectionId={sectionId}
            defaultContent={description}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button 
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => setSelectedCategoryId(null)}
              className="rounded-full px-6"
            >
              {t('all')}
            </Button>
            {categories.map((cat) => (
              <Button 
                key={cat.id}
                variant={selectedCategoryId === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(cat.id)}
                className="rounded-full px-6"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl animate-pulse shadow-sm" />
            ))
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Card key={service.id} className="group transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col border-none shadow-sm overflow-hidden">
                  <div className="h-2 w-0 bg-primary group-hover:w-full transition-all duration-300" />
                  <CardHeader className="pb-4">
                    <div 
                      className="bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                      style={{ 
                        width: service.icon_size ? `${service.icon_size + 16}px` : '56px',
                        height: service.icon_size ? `${service.icon_size + 16}px` : '56px'
                      }}
                    >
                      <Icon 
                        className="h-7 w-7" 
                        style={{ 
                          width: service.icon_size ? `${service.icon_size}px` : '28px',
                          height: service.icon_size ? `${service.icon_size}px` : '28px'
                        }}
                      />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description || "Xem chi tiết để biết thêm thông tin."}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <span className="text-xs font-medium text-primary/60 uppercase tracking-wider">
                      {service.service_categories?.name || t('services')}
                    </span>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-primary font-semibold hover:text-accent flex items-center gap-1 group/link"
                    >
                      {t('view_details')}
                      <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-inner border border-dashed">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground text-lg italic">{t('no_services', 'Hiện chưa có dịch vụ nào trong danh mục này.')}</p>
              <Button variant="link" onClick={() => setSelectedCategoryId(null)}>{t('view_all_services', 'Xem tất cả dịch vụ')}</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
