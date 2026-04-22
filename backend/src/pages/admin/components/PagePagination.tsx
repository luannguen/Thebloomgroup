import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from "@/components/ui/pagination";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

interface PagePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function PagePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange
}: PagePaginationProps) {
    
    if (totalItems === 0) return null;

    const renderPageLinks = () => {
        const links = [];
        const maxVisible = 5;
        
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            links.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        onClick={() => onPageChange(i)}
                        isActive={currentPage === i}
                        className="rounded-lg h-9 w-9 cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return links;
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 px-2">
            <div className="flex items-center gap-4 order-2 md:order-1">
                <p className="text-sm text-slate-500 font-medium">
                    Hiển thị <span className="text-slate-900">{(currentPage - 1) * pageSize + 1}</span> - <span className="text-slate-900">{Math.min(currentPage * pageSize, totalItems)}</span> trong tổng số <span className="text-slate-900">{totalItems}</span> trang
                </p>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Số dòng:</span>
                    <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(parseInt(v))}>
                        <SelectTrigger className="h-8 w-20 rounded-lg border-slate-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="order-1 md:order-2">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                                className={`rounded-lg cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                        </PaginationItem>
                        
                        {renderPageLinks()}

                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                                className={`rounded-lg cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
