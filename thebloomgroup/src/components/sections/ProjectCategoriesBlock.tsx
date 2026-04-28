import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Factory, Building, Building2, ArrowUpRight, Loader2 } from "lucide-react";
import { projectService } from "@/services/projectService";
import { Category } from "@/components/data/types";
import { EditableElement } from '../admin/EditableElement';

export const ProjectCategoriesBlock = ({
  title,
  subtitle,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await projectService.getProjectCategories();
      if (result.success) {
        setCategories(result.data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("công nghiệp") || name.includes("nhà máy")) return <Factory className="text-primary w-6 h-6" />;
    if (name.includes("thương mại") || name.includes("tòa nhà")) return <Building className="text-primary w-6 h-6" />;
    return <Building2 className="text-primary w-6 h-6" />;
  };

  const displayTitle = title || t('project_cat_title', "Lĩnh vực hoạt động");
  const displaySubtitle = subtitle || t('project_cat_desc_list', 'Thebloomgrouporation tự hào thực hiện các dự án đa dạng với quy mô khác nhau, từ hệ thống điều hòa không khí trung tâm đến các hệ thống làm lạnh công nghiệp phức tạp.');

  return (
    <section className="py-20 bg-slate-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto mb-16">
          <EditableElement 
            tagName="h2" 
            fieldKey="title" 
            sectionId={sectionId}
            defaultContent={displayTitle} 
            className="text-3xl md:text-4xl font-bold mb-6 text-center" 
          />
          <EditableElement 
            tagName="div" 
            fieldKey="subtitle" 
            sectionId={sectionId}
            defaultContent={displaySubtitle} 
            className="text-lg text-muted-foreground" 
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary h-10 w-10" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className="bg-primary/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {getCategoryIcon(category.name)}
                  </div>
                  <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[3rem]">
                    {category.description || `Các giải pháp kỹ thuật chuyên sâu trong lĩnh vực ${category.name}`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Link 
                    to={`/projects/category/${category.slug || category.id}`} 
                    className="text-primary font-bold inline-flex items-center group/link"
                  >
                    {t('view_project', 'Xem dự án')}
                    <ArrowUpRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
