import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusFilter, SortField, SortOrder } from "@/hooks/usePages";

interface PageFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: StatusFilter;
    onStatusChange: (value: StatusFilter) => void;
    sortBy: SortField;
    onSortByChange: (value: SortField) => void;
    sortOrder: SortOrder;
    onSortOrderChange: (value: SortOrder) => void;
}

export function PageFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange
}: PageFiltersProps) {
    
    const handleClearFilters = () => {
        onSearchChange("");
        onStatusChange("all");
        onSortByChange("updated_at");
        onSortOrderChange("desc");
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
            <div className="flex-1 w-full space-y-2">
                <label className="text-sm font-medium text-slate-700">Tìm kiếm</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tiêu đề hoặc slug..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="w-full md:w-48 space-y-2">
                <label className="text-sm font-medium text-slate-700">Trạng thái</label>
                <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white/50">
                        <div className="flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Tất cả trạng thái" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="inactive">Đang ẩn</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-64 space-y-2">
                <label className="text-sm font-medium text-slate-700">Sắp xếp</label>
                <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortField)}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white/50 flex-1">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title">Tên trang</SelectItem>
                            <SelectItem value="updated_at">Ngày cập nhật</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as SortOrder)}>
                        <SelectTrigger className="h-10 w-24 rounded-xl border-slate-200 bg-white/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">A-Z / Cũ</SelectItem>
                            <SelectItem value="desc">Z-A / Mới</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClearFilters}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-500"
                title="Làm mới bộ lọc"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
    );
}
