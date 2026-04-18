import { useEffect, useState } from "react";
import { Trash2, Search, MoreHorizontal, Mail, Phone, Building2, User, Clock, CheckCircle2, XCircle } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { serviceService, ServiceInquiry } from "@/services/serviceService";

export default function ServiceInquiriesPage() {
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ServiceInquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    const result = await serviceService.getInquiries();
    if (result.success) {
      setInquiries(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, status: ServiceInquiry['status']) => {
    const result = await serviceService.updateInquiryStatus(id, status);
    if (result.success) {
      toast({ title: "Thành công", description: `Đã cập nhật trạng thái thành: ${status}` });
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này không?")) return;
    const result = await serviceService.deleteInquiry(id);
    if (result.success) {
      toast({ title: "Thành công", description: "Đã xóa yêu cầu" });
      fetchInquiries();
      setIsDetailOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge className="bg-blue-500">Mới</Badge>;
      case 'processing': return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case 'completed': return <Badge className="bg-green-600">Hoàn tất</Badge>;
      case 'cancelled': return <Badge variant="destructive">Đã hủy</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.services?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yêu cầu Dịch vụ</h1>
          <p className="text-muted-foreground">Quản lý các yêu cầu liên hệ và tư vấn dịch vụ từ khách hàng.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc dịch vụ..."
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
              <TableHead>Khách hàng</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Đang tải...</TableCell></TableRow>
            ) : filteredInquiries.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Không có yêu cầu nào.</TableCell></TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{inquiry.name}</span>
                      <span className="text-xs text-muted-foreground">{inquiry.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.services?.title || "Dịch vụ khác"}</TableCell>
                  <TableCell>{new Date(inquiry.created_at).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedInquiry(inquiry); setIsDetailOpen(true); }}>
                        Chi tiết
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'processing')}>
                             <Clock className="mr-2 h-4 w-4" /> Đang xử lý
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'completed')}>
                             <CheckCircle2 className="mr-2 h-4 w-4" /> Hoàn tất
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'cancelled')}>
                             <XCircle className="mr-2 h-4 w-4" /> Hủy bỏ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(inquiry.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu dịch vụ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết từ khách hàng {selectedInquiry?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2"><User className="h-4 w-4" /> Họ tên</p>
                    <p className="text-sm text-muted-foreground">{selectedInquiry.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4" /> Email</p>
                    <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4" /> Điện thoại</p>
                    <p className="text-sm text-muted-foreground">{selectedInquiry.phone || "N/A"}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2"><Building2 className="h-4 w-4" /> Công ty</p>
                    <p className="text-sm text-muted-foreground">{selectedInquiry.company || "Cá nhân"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Dịch vụ quan tâm</p>
                <p className="text-sm text-muted-foreground">{selectedInquiry.services?.title || "Thông tin khác"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Lời nhắn</p>
                <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {selectedInquiry.message || "Không có lời nhắn."}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
