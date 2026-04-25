
import React, { useState } from "react";
import { Plus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { pageService, StaticPage, PageFormData } from "@/services/pageService";
import { usePages } from "@/hooks/usePages";
import { PageFilters } from "./components/PageFilters";
import { PageTable } from "./components/PageTable";
import { PagePagination } from "./components/PagePagination";
import { PageFormDialog } from "./components/PageFormDialog";

export default function PagesPage() {
    const { 
        pages, 
        loading, 
        fetchPages, 
        searchTerm, 
        setSearchTerm, 
        statusFilter, 
        setStatusFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        pagination
    } = usePages();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<StaticPage | null>(null);
    const [formData, setFormData] = useState<PageFormData>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image_url: "",
        is_active: true,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showRawJson, setShowRawJson] = useState(false);
    
    const { toast } = useToast();

    const handleCreate = () => {
        setCurrentPage(null);
        setFormData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            image_url: "",
            is_active: true,
        });
        setSelectedFile(null);
        setShowRawJson(false);
        setIsDialogOpen(true);
    };

    const handleEdit = (page: StaticPage) => {
        setCurrentPage(page);
        setFormData({
            title: page.title,
            slug: page.slug,
            content: page.content,
            excerpt: page.excerpt,
            image_url: page.image_url,
            is_active: page.is_active,
        });
        setSelectedFile(null);
        setShowRawJson(false);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await pageService.deletePage(id);
            toast({
                title: "Thành công",
                description: "Đã xóa trang thành công",
            });
            fetchPages();
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể xóa trang",
                variant: "destructive",
            });
        }
    };

    const handleToggleActive = async (page: StaticPage) => {
        try {
            await pageService.updatePage(page.id, { is_active: !page.is_active });
            toast({
                title: "Thành công",
                description: `Đã ${!page.is_active ? "hiện" : "ẩn"} trang thành công`,
            });
            fetchPages();
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật trạng thái",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let image_url = formData.image_url;

            if (selectedFile) {
                image_url = await pageService.uploadImage(selectedFile);
            }

            const dataToSubmit = { 
                ...formData, 
                image_url,
                // Sanitize slug: remove leading/trailing slashes
                slug: formData.slug.replace(/^\/+|\/+$/g, '')
            };

            if (currentPage) {
                await pageService.updatePage(currentPage.id, dataToSubmit);
                toast({
                    title: "Thành công",
                    description: "Đã cập nhật trang thành công",
                });
            } else {
                await pageService.createPage(dataToSubmit);
                toast({
                    title: "Thành công",
                    description: "Đã tạo trang mới thành công",
                });
            }

            setIsDialogOpen(false);
            fetchPages();
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
                            <Layout className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản lý Trang</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Quản lý các trang tĩnh, Landing Page và nội dung Visual Editor.</p>
                </div>
                
                <Button 
                    onClick={handleCreate} 
                    className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Thêm trang mới
                </Button>
            </div>

            {/* Filters Section */}
            <PageFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
            />

            {/* Table Section */}
            <PageTable
                pages={pages}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
            />

            {/* Pagination Section */}
            <PagePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                onPageChange={pagination.handlePageChange}
                onPageSizeChange={pagination.handlePageSizeChange}
            />

            {/* Dialog Form */}
            <PageFormDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                currentPage={currentPage}
                formData={formData}
                setFormData={setFormData}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                showRawJson={showRawJson}
                setShowRawJson={setShowRawJson}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
