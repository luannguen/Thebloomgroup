import { useState, useEffect } from "react";
import { recruitmentService, JobApplication } from "@/services/recruitmentService";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Mail, Phone, Download, Trash2, ExternalLink, Calendar } from "lucide-react";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentApp, setCurrentApp] = useState<JobApplication | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await recruitmentService.getApplications();
            setApplications(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load applications",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (app: JobApplication) => {
        setCurrentApp(app);
        setIsDialogOpen(true);
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await recruitmentService.updateApplicationStatus(id, status);
            toast({ title: "Success", description: "Status updated successfully" });
            fetchApplications();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            await recruitmentService.deleteApplication(id);
            toast({ title: "Success", description: "Application deleted successfully" });
            fetchApplications();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete application",
                variant: "destructive",
            });
        }
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'reviewed': return 'bg-blue-100 text-blue-700';
            case 'interviewing': return 'bg-purple-100 text-purple-700';
            case 'hired': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Danh sách Ứng viên</h1>
                <Button variant="outline" onClick={fetchApplications}>
                    Làm mới
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ứng viên</TableHead>
                            <TableHead>Vị trí</TableHead>
                            <TableHead>Liên hệ</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : applications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Chưa có hồ sơ ứng tuyển nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="flex items-center font-bold">
                                                <User className="mr-2 h-4 w-4 text-blue-500" />
                                                {app.full_name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {app.job?.title || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-xs space-y-1">
                                        <div className="flex items-center">
                                            <Mail className="mr-1 h-3 w-3" /> {app.email}
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="mr-1 h-3 w-3" /> {app.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={app.status || "pending"}
                                            onValueChange={(value) => handleUpdateStatus(app.id, value)}
                                        >
                                            <SelectTrigger className={`w-[120px] h-8 text-xs ${getStatusColor(app.status)}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Chờ duyệt</SelectItem>
                                                <SelectItem value="reviewed">Đã xem</SelectItem>
                                                <SelectItem value="interviewing">Phỏng vấn</SelectItem>
                                                <SelectItem value="hired">Đã tuyển</SelectItem>
                                                <SelectItem value="rejected">Từ chối</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDetails(app)}
                                            title="Xem chi tiết"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <a href={app.cv_url} target="_blank" rel="noopener noreferrer" title="Tải CV">
                                                <Download className="h-4 w-4 text-blue-600" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(app.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thông tin ứng viên</DialogTitle>
                        <DialogDescription>
                            Chi tiết nộp hồ sơ cho vị trí: {currentApp?.job?.title}
                        </DialogDescription>
                    </DialogHeader>
                    {currentApp && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Họ và tên</h4>
                                        <p className="text-lg font-bold">{currentApp.full_name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</h4>
                                        <p className="font-medium text-blue-600">{currentApp.email}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại</h4>
                                        <p className="font-medium">{currentApp.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ngày nộp bộ hồ sơ</h4>
                                        <p className="font-medium">{new Date(currentApp.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hồ sơ đính kèm (CV)</h4>
                                        <Button asChild variant="outline" className="w-full justify-start mt-2">
                                            <a href={currentApp.cv_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" /> Xem & Tải CV
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lời nhắn / Giới thiệu</h4>
                                <div className="bg-slate-50 p-4 rounded-lg text-sm whitespace-pre-wrap italic text-slate-700">
                                    {currentApp.message || "Không có lời nhắn."}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-4">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Đóng</Button>
                                <Select
                                    value={currentApp.status || "pending"}
                                    onValueChange={(value) => handleUpdateStatus(currentApp.id, value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Cập nhật trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                                        <SelectItem value="reviewed">Đã xem</SelectItem>
                                        <SelectItem value="interviewing">Phỏng vấn</SelectItem>
                                        <SelectItem value="hired">Đã tuyển</SelectItem>
                                        <SelectItem value="rejected">Từ chối</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
