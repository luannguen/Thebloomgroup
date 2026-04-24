import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Product } from "@/components/data/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
    ArrowLeft, 
    CheckCircle, 
    ShieldCheck, 
    HelpCircle, 
    Info, 
    ListChecks, 
    Package,
    ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppLink } from "@/components/common/AppLink";

export default function ProductDetail() {
    const { t } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const result = await productService.getProduct(slug);
                if (result.success) {
                    setProduct(result.data);
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                setError("An error occurred while fetching product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Skeleton className="h-10 w-2/3 mb-6" />
                <Skeleton className="h-[400px] w-full mb-8 rounded-2xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="max-w-md mx-auto">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <Package size={40} />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{t('product_not_found', 'Không tìm thấy sản phẩm')}</h1>
                    <p className="text-muted-foreground mb-8">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị thay đổi đường dẫn.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/products">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('all_products', 'Tất cả sản phẩm')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-grow bg-slate-50/50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-slate-900">
                <img
                    src={product.image_url || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1280"}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white container mx-auto">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link to="/products" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors group">
                                <div className="bg-white/10 p-2 rounded-full mr-3 group-hover:bg-primary transition-colors">
                                    <ArrowLeft size={16} />
                                </div>
                                {t('back_to_products', 'Quay lại danh mục')}
                            </Link>
                            {product.category && (
                                <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{product.name}</h1>
                            <p className="text-lg md:text-xl text-slate-200 max-w-3xl leading-relaxed">{product.description}</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Features Section */}
                    {product.features && product.features.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <ListChecks size={24} />
                                </div>
                                {t('product_features', 'Tính năng nổi bật')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.features.map((feature, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all group"
                                    >
                                        <div className="bg-primary/5 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="text-slate-700 leading-relaxed font-medium">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Specifications Section */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Info size={24} />
                                </div>
                                {t('product_specs', 'Thông số kỹ thuật')}
                            </h2>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <tbody className="divide-y divide-slate-200">
                                        {Object.entries(product.specifications).map(([key, value], idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50 transition-colors'}>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900 w-1/3 border-r border-slate-100">{key}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{value as string}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    {/* Inquiry Card */}
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all" />
                        <h3 className="text-2xl font-bold mb-4 relative z-10">{t('inquiry_title', 'Yêu cầu báo giá')}</h3>
                        <p className="text-slate-400 text-sm mb-8 relative z-10">Liên hệ với đội ngũ kỹ sư của chúng tôi để nhận giải pháp và báo giá chính xác cho dự án của bạn.</p>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                                <ShieldCheck className="text-primary h-5 w-5" />
                                <span>Cam kết bảo mật thông tin</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                                <HelpCircle className="text-primary h-5 w-5" />
                                <span>Tư vấn kỹ thuật chuyên sâu</span>
                            </div>
                        </div>

                        <div className="mt-10 relative z-10">
                            <Button className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20" asChild>
                                <AppLink routeKey="CONTACT" query={{ product: product.id.toString(), name: product.name }}>
                                    {t('contact_us_now', 'Liên hệ ngay')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </AppLink>
                            </Button>
                        </div>
                    </div>

                    {/* Related Products placeholder or Category info */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Package size={20} className="text-primary" />
                            {t('category_info', 'Về danh mục')}
                        </h3>
                        {product.category && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Sản phẩm này thuộc danh mục <span className="font-bold text-slate-900">{product.category.name}</span>.
                                </p>
                                <Link to={`/products?category=${product.category.slug}`}>
                                    <Button variant="link" className="px-0 text-primary font-bold">
                                        Xem thêm sản phẩm cùng loại
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}
