-- 10_sync_me_to_visual_editor.sql
-- Chuyển đổi trang Hệ Thống Cơ Điện sang định dạng Visual Editor

DO $$
DECLARE
    me_content JSONB;
BEGIN
    me_content := '{
        "sections": [
            {
                "id": "hero",
                "type": "hero",
                "props": { 
                    "badge": "Giải pháp Kỹ thuật Toàn diện",
                    "title": "Hệ Thống Cơ Điện (M&E)", 
                    "description": "VietVinhCorp cung cấp các giải pháp cơ điện hiện đại, từ khâu tư vấn thiết kế đến thi công và bảo trì, cam kết chất lượng vượt trội và hiệu quả vận hành tối ưu cho dự án của bạn.",
                    "alignment": "left",
                    "backgroundImage": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80",
                    "buttonText": "Nhận báo giá ngay",
                    "buttonLink": "/contact",
                    "button2Text": "Xem dự án tiêu biểu",
                    "button2Link": "/projects"
                }
            },
            {
                "id": "systems-title",
                "type": "rich_text",
                "props": {
                    "content": "<div class=\"text-center mb-12\"><h2 class=\"text-3xl md:text-4xl font-bold mb-4\">Các Giải Pháp Hệ Thống</h2><div class=\"w-20 h-1 bg-yellow-500 mx-auto\"></div></div>"
                }
            },
            {
                "id": "systems-grid",
                "type": "rich_text",
                "props": {
                    "content": "
                    <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;\">
                        <!-- Hệ thống điện -->
                        <div style=\"padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); background: white;\">
                            <h3 style=\"color: #0c4a6e; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;\">HỆ THỐNG ĐIỆN</h3>
                            <p style=\"color: #4b5563; font-size: 0.875rem; margin-bottom: 1rem;\">Trạm biến áp, tủ điện tổng, chiếu sáng và nguồn dự phòng.</p>
                            <ul style=\"color: #6b7280; font-size: 0.875rem; list-style: none; padding: 0;\">
                                <li style=\"margin-bottom: 0.5rem;\">✓ Trạm biến áp trung thế</li>
                                <li style=\"margin-bottom: 0.5rem;\">✓ Tủ điện MSB/DB</li>
                                <li style=\"margin-bottom: 0.5rem;\">✓ Máy phát điện & UPS</li>
                            </ul>
                        </div>
                        <!-- Hệ thống phòng sạch -->
                        <div style=\"padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); background: white;\">
                            <h3 style=\"color: #0c4a6e; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;\">HỆ THỐNG PHÒNG SẠCH</h3>
                            <p style=\"color: #4b5563; font-size: 0.875rem; margin-bottom: 1rem;\">Thiết kế đạt chuẩn GMP, ISO cho dược phẩm và thực phẩm.</p>
                            <ul style=\"color: #6b7280; font-size: 0.875rem; list-style: none; padding: 0;\">
                                <li style=\"margin-bottom: 0.5rem;\">✓ Panel chuyên dụng</li>
                                <li style=\"margin-bottom: 0.5rem;\">✓ Lọc HEPA/ULPA</li>
                                <li style=\"margin-bottom: 0.5rem;\">✓ Kiểm soát áp suất</li>
                            </ul>
                        </div>
                        <!-- Hệ thống HVAC -->
                        <div style=\"padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); background: white;\">
                            <h3 style=\"color: #0c4a6e; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;\">HỆ THỐNG ĐIỀU HÒA (HVAC)</h3>
                            <p style=\"color: #4b5563; font-size: 0.875rem; margin-bottom: 1rem;\">Tối ưu nhiệt độ và chất lượng không khí nhà xưởng.</p>
                            <ul style=\"color: #6b7280; font-size: 0.875rem; list-style: none; padding: 0;\">
                                <li style=\"margin-bottom: 0.5rem;\">✓ Chiller/VRV trung tâm</li>
                                <li style=\"margin-bottom: 0.5rem;\">✓ Thông gió nhà xưởng</li>
                                <li style=\"margin-bottom: 0.5rem;\">✓ Hút bụi & khí thải</li>
                            </ul>
                        </div>
                    </div>"
                }
            },
            {
                "id": "why-choose-us",
                "type": "features",
                "props": {
                    "title": "Tại sao chọn dịch vụ M&E của chúng tôi?",
                    "subtitle": "VietVinhCorp cam kết mang lại giá trị bền vững thông qua các giải pháp tích hợp thông minh.",
                    "items": [
                        { "id": "1", "title": "Đồng bộ & Tích hợp", "description": "Giải pháp thiết kế đồng bộ giữa cơ điện và lạnh." },
                        { "id": "2", "title": "Tiêu chuẩn Quốc tế", "description": "Tuân thủ TCVN, IEC, ASHRAE và các quy chuẩn an toàn." },
                        { "id": "3", "title": "Tiết kiệm Năng lượng", "description": "Ứng dụng Inverter và BMS tối ưu hóa chi phí vận hành." }
                    ]
                }
            },
            {
                "id": "cta",
                "type": "hero",
                "props": {
                    "title": "Sẵn sàng triển khai cho dự án của bạn?",
                    "description": "Liên hệ với đội ngũ chuyên gia của chúng tôi để được khảo sát và tư vấn giải pháp cơ điện tối ưu nhất.",
                    "alignment": "center",
                    "buttonText": "Yêu cầu khảo sát",
                    "buttonLink": "/contact",
                    "button2Text": "Gọi ngay: 028 3833 3333",
                    "button2Link": "tel:02838333333"
                }
            }
        ]
    }';

    -- Upsert vào static_pages
    INSERT INTO public.static_pages (slug, title, content, is_active)
    VALUES ('he-thong-co-dien', 'Hệ Thống Cơ Điện (M&E)', me_content::text, true)
    ON CONFLICT (slug) 
    DO UPDATE SET 
        content = EXCLUDED.content,
        updated_at = NOW();

    -- Cập nhật đường dẫn menu nếu cần (đảm bảo nó khớp với slug)
    UPDATE public.navigation 
    SET path = '/he-thong-co-dien'
    WHERE path = '/he-thong-co-dien';

END $$;
