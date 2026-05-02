import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, MoreHorizontal, Pin, Maximize2, Minimize2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { serviceService, Service } from "@/services/serviceService";
import ServiceForm from "@/components/admin/services/ServiceForm";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [modalSize, setModalSize] = useState<'normal' | 'large' | 'full'>('normal');
  const [isPinned, setIsPinned] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    const result = await serviceService.getServices();
    if (result.success) {
      setServices(result.data || []);
    } else {
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: result.error || "Có lỗi xảy ra",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;

    const result = await serviceService.deleteService(id);
    if (result.success) {
      toast({ title: "Thành công", description: "Đã xóa dịch vụ" });
      fetchServices();
    } else {
      toast({ variant: "destructive", title: "Lỗi", description: result.error || "Có lỗi xảy ra" });
    }
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    fetchServices();
  };

  const getModalClassName = () => {
    switch (modalSize) {
      case 'full': 
        return "max-w-none w-screen h-screen m-0 p-0 rounded-none top-0 left-0 translate-x-0 translate-y-0 border-none z-[100] overflow-y-auto";
      case 'large': 
        return "max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto transition-all duration-300 shadow-2xl border-slate-200 sm:max-w-7xl";
      default: 
        return "max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto transition-all duration-300 shadow-xl border-slate-200 sm:max-w-4xl";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Dịch vụ</h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa các dịch vụ hiển thị trên website.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open && isPinned) return;
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Thêm dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent 
            className={getModalClassName()}
            onPointerDownOutside={(e) => {
              if (isPinned) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (isPinned) e.preventDefault();
            }}
          >
            <DialogHeader className="relative pr-24">
              <DialogTitle className="flex items-center gap-2">
                {editingService ? (
                  <Pencil className="h-5 w-5 text-primary" />
                ) : (
                  <Plus className="h-5 w-5 text-primary" />
                )}
                {editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho dịch vụ của bạn.
              </DialogDescription>
              
              {/* Modal Controls */}
              <div className="absolute right-8 top-0 flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-md transition-colors ${isPinned ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-slate-200'}`}
                  onClick={() => setIsPinned(!isPinned)}
                  title={isPinned ? "Bỏ ghim cửa sổ" : "Ghim cửa sổ (Không đóng khi click ngoài)"}
                >
                  <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
                </Button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md hover:bg-slate-200"
                  onClick={() => setModalSize(modalSize === 'normal' ? 'large' : 'normal')}
                  disabled={modalSize === 'full'}
                  title="Phóng to / Thu nhỏ"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-md transition-colors ${modalSize === 'full' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'hover:bg-slate-200'}`}
                  onClick={() => setModalSize(modalSize === 'full' ? 'normal' : 'full')}
                  title="Toàn màn hình"
                >
                  {modalSize === 'full' ? <Minimize2 className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>
              </div>
            </DialogHeader>
            <div className={`mt-4 ${modalSize === 'full' ? 'px-8 pb-12' : ''}`}>
              <ServiceForm
                initialData={editingService}
                onSuccess={handleSuccess}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm dịch vụ..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Không có dịch vụ nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {service.service_categories?.name || "Không có"}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.slug}</TableCell>
                  <TableCell>
                    {service.is_active ? (
                      <Badge variant="default" className="bg-green-600">Hiển thị</Badge>
                    ) : (
                      <Badge variant="secondary">Ẩn</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(service.created_at).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
