import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { serviceService, Service } from "@/services/serviceService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, Calendar, ShieldCheck, HelpCircle } from "lucide-react";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";

export default function ServiceDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            if (!slug) return;
            setLoading(true);
            const result = await serviceService.getServiceBySlug(slug);
            if (result.success) {
                setService(result.data);
            } else {
                setError((result as any).error?.message || "Service not found");
            }
            setLoading(false);
        };

        fetchService();
    }, [slug]);

    if (loading) {
        return (
            <div className="container-custom py-16">
                <Skeleton className="h-10 w-2/3 mb-6" />
                <Skeleton className="h-64 w-full mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="container-custom py-24 text-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Không tìm thấy dịch vụ</h1>
                    <p className="text-muted-foreground mb-8">Dịch vụ bạn tìm kiếm "{slug}" không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/services">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Dịch vụ
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button>
                                Trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-grow bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-slate-900">
                <img
                    src={service.image_url || "/assets/images/service-overview.jpg"}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                        e.currentTarget.src = "/assets/images/service-overview.jpg";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white container-custom">
                    <div className="max-w-4xl">
                        <Link to="/services" className="inline-flex items-center text-slate-300 hover:text-white mb-4 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Tất cả dịch vụ
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{service.title}</h1>
                        <p className="text-lg md:text-xl text-slate-200 line-clamp-2 max-w-2xl">{service.description}</p>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: service.content }} />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin dịch vụ</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center text-slate-600">
                                <CheckCircle className="text-primary h-5 w-5 mr-3 shrink-0" />
                                <span>Tư vấn miễn phí</span>
                            </li>
                            <li className="flex items-center text-slate-600">
                                <Clock className="text-primary h-5 w-5 mr-3 shrink-0" />
                                <span>Hỗ trợ 24/7</span>
                            </li>
                            <li className="flex items-center text-slate-600">
                                <Calendar className="text-primary h-5 w-5 mr-3 shrink-0" />
                                <span>Đặt lịch linh hoạt</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link to="/contact">
                                <Button className="w-full">Liên hệ ngay</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-primary/20 sticky top-24">
                        <h3 className="text-xl font-bold mb-2 text-primary flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Đăng ký Tư vấn
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">Để lại thông tin, chúng tôi sẽ liên hệ trong vòng 30 phút.</p>
                        <ServiceInquiryForm serviceId={service.id} />
                        
                        <div className="mt-8 pt-6 border-t border-gray-100">
                             <div className="flex items-center gap-3 text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                                <ShieldCheck className="text-green-600 h-5 w-5 shrink-0" />
                                <span className="text-xs font-medium">Cam kết bảo mật thông tin khách hàng tuyệt đối.</span>
                             </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
