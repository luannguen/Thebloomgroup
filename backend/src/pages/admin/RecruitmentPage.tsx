import { useState, useEffect } from "react";
import { recruitmentService, Job, JobFormData } from "@/services/recruitmentService";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2, Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RecruitmentPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState<JobFormData>({
        title: "",
        slug: "",
        description: "",
        requirements: "",
        benefits: "",
        location: "TP. Hồ Chí Minh",
        type: "Full-time",
        salary: "Thỏa thuận",
        status: "open",
        deadline: "",
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await recruitmentService.getJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load jobs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (job?: Job) => {
        if (job) {
            setCurrentJob(job);
            setFormData({
                title: job.title,
                slug: job.slug,
                description: job.description || "",
                requirements: job.requirements || "",
                benefits: job.benefits || "",
                location: job.location || "TP. Hồ Chí Minh",
                type: job.type || "Full-time",
                salary: job.salary || "Thỏa thuận",
                status: job.status || "open",
                deadline: job.deadline || "",
            });
        } else {
            setCurrentJob(null);
            setFormData({
                title: "",
                slug: "",
                description: "",
                requirements: "",
                benefits: "",
                location: "TP. Hồ Chí Minh",
                type: "Full-time",
                salary: "Thỏa thuận",
                status: "open",
                deadline: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentJob) {
                await recruitmentService.updateJob(currentJob.id, formData);
                toast({ title: "Success", description: "Job updated successfully" });
            } else {
                await recruitmentService.createJob(formData);
                toast({ title: "Success", description: "Job created successfully" });
            }
            setIsDialogOpen(false);
            fetchJobs();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save job",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await recruitmentService.deleteJob(id);
            toast({ title: "Success", description: "Job deleted successfully" });
            fetchJobs();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete job",
                variant: "destructive",
            });
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^a-z0-9\s-]|[\t\n\r])/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: currentJob ? formData.slug : generateSlug(title),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý Tuyển dụng</h1>
                <Button onClick={() => handleOpenDialog()} className="rounded-full bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200">
                    <Plus className="mr-2 h-4 w-4" /> Đăng tin mới
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vị trí tuyển dụng</TableHead>
                            <TableHead>Địa điểm</TableHead>
                            <TableHead>Loại hình</TableHead>
                            <TableHead>Mức lương</TableHead>
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
                        ) : jobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Chưa có tin tuyển dụng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {job.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-center">
                                            <MapPin className="mr-1 h-3 w-3" /> {job.location}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-center">
                                            <Clock className="mr-1 h-3 w-3" /> {job.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-center">
                                            <DollarSign className="mr-1 h-3 w-3" /> {job.salary}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(job)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(job.id)}
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentJob ? "Chỉnh sửa tin tuyển dụng" : "Thêm tin tuyển dụng mới"}</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin chi tiết về vị trí cần tuyển dụng.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Vị trí (Tiêu đề)</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g. Kỹ sư Điện lạnh"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Đường dẫn (Slug)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g. ky-su-dien-lanh"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Địa điểm</Label>
                                <Input
                                    id="location"
                                    value={formData.location || ""}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="TP. Hồ Chí Minh"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Loại hình công việc</Label>
                                <Select
                                    value={formData.type || "Full-time"}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại hình" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Mức lương</Label>
                                <Input
                                    id="salary"
                                    value={formData.salary || ""}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder="Thỏa thuận"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="status">Trạng thái</Label>
                                <Select
                                    value={formData.status || "open"}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Đang tuyển</SelectItem>
                                        <SelectItem value="closed">Đã đóng</SelectItem>
                                        <SelectItem value="draft">Bản nháp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="deadline">Hạn nộp hồ sơ</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={formData.deadline || ""}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Mô tả công việc</Label>
                            <div className="h-[200px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description || ""}
                                    onChange={(content) => setFormData({ ...formData, description: content })}
                                    className="h-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Yêu cầu công việc</Label>
                            <div className="h-[200px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.requirements || ""}
                                    onChange={(content) => setFormData({ ...formData, requirements: content })}
                                    className="h-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Quyền lợi</Label>
                            <div className="h-[200px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.benefits || ""}
                                    onChange={(content) => setFormData({ ...formData, benefits: content })}
                                    className="h-full"
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-8">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                            <Button type="submit">Lưu tin tuyển dụng</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
