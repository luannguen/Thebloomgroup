import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

export const BLOCK_LIBRARY = [
    { 
        type: 'hero', 
        name: 'Hero Banner', 
        icon: '🎨',
        category: 'Basic',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'backgroundImage', label: 'Ảnh nền', type: 'image' },
            { id: 'titleColor', label: 'Màu tiêu đề', type: 'color' },
            { id: 'descriptionColor', label: 'Màu mô tả', type: 'color' },
            { id: 'alignment', label: 'Căn lề', type: 'select', options: [
                { label: 'Trái', value: 'left' },
                { label: 'Giữa', value: 'center' },
                { label: 'Phải', value: 'right' }
            ]},
            { id: 'buttonText', label: 'Chữ trên nút 1', type: 'textarea' },
            { id: 'buttonLink', label: 'Liên kết nút 1', type: 'text' },
            { id: 'badge', label: 'Badge/Tagline', type: 'text' }
        ]
    },
    { 
        type: 'image', 
        name: 'Hình ảnh đơn', 
        icon: '🖼️',
        category: 'Basic',
        fields: [
            { id: 'url', label: 'Đường dẫn ảnh', type: 'image' },
            { id: 'alt', label: 'Mô tả ảnh (Alt)', type: 'textarea' },
            { id: 'caption', label: 'Chú thích', type: 'textarea' },
            { id: 'width', label: 'Độ rộng (%)', type: 'number' }
        ]
    },
    {
        type: 'rich_text',
        name: 'Nội dung văn bản',
        icon: '📝',
        category: 'Basic',
        fields: [
            { id: 'content', label: 'Nội dung', type: 'rich-text' }
        ]
    },
    { 
        type: 'grid', 
        name: 'Lưới Layout', 
        icon: '⊞',
        category: 'Basic',
        fields: [
            { id: 'columns', label: 'Số cột', type: 'number' },
            { id: 'gap', label: 'Khoảng cách', type: 'number' },
            { id: 'padding', label: 'Lề (Padding)', type: 'select', options: [
                { label: 'Nhỏ', value: 'small' },
                { label: 'Vừa', value: 'medium' },
                { label: 'Lớn', value: 'large' }
            ]}
        ]
    },
    { 
        type: 'cards', 
        name: 'Danh sách Card', 
        icon: '🎴',
        category: 'Basic',
        fields: [
            { id: 'title', label: 'Tiêu đề lưới card', type: 'textarea' },
            { id: 'image_url', label: 'Ảnh mặc định', type: 'image' },
            { id: 'columns', label: 'Số cột hiển thị', type: 'number' },
            { 
                id: 'items', 
                label: 'Danh sách thẻ (Cards)', 
                type: 'list', 
                itemSchema: [ 
                    { id: 'image', label: 'Ảnh/Icon', type: 'image' }, 
                    { id: 'title', label: 'Tiêu đề', type: 'textarea' }, 
                    { id: 'description', label: 'Mô tả', type: 'textarea' } 
                ] 
            }
        ]
    },
    { 
        type: 'features', 
        name: 'Tính năng', 
        icon: '✨',
        category: 'Basic',
        fields: [
            { id: 'title', label: 'Tiêu đề chính', type: 'textarea' },
            { id: 'subtitle', label: 'Tiêu đề phụ', type: 'textarea' },
            { id: 'icon_image', label: 'Icon/Ảnh minh họa', type: 'image' },
            { id: 'items', label: 'Danh sách tính năng', type: 'list', itemSchema: [ { id: 'icon', label: 'Icon', type: 'image' }, { id: 'title', label: 'Tiêu đề', type: 'textarea' }, { id: 'description', label: 'Mô tả', type: 'textarea' } ] }
        ]
    },
    {
        type: 'media_section',
        name: 'Media & Content',
        icon: '🖼️',
        category: 'Basic',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'layout', label: 'Bố cục', type: 'select', options: [
                { label: 'Ảnh bên Trái', value: 'image-left' },
                { label: 'Ảnh bên Phải', value: 'image-right' },
                { label: 'Ảnh trên Đầu', value: 'image-top' },
                { label: 'Ảnh dưới Cùng', value: 'image-bottom' }
            ]},
            { id: 'image', label: 'Hình ảnh', type: 'image' },
            { id: 'imageWidth', label: 'Độ rộng ảnh (%)', type: 'number' },
            { id: 'description', label: 'Mô tả', type: 'textarea' }
        ]
    },
    {
        type: 'refrigeration',
        name: 'Hệ thống lạnh',
        icon: '❄️',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'image', label: 'Hình ảnh', type: 'image' },
            { id: 'feature1_title', label: 'Tính năng 1: Tiêu đề', type: 'textarea' },
            { id: 'feature1_desc', label: 'Tính năng 1: Mô tả', type: 'textarea' },
            { id: 'feature2_title', label: 'Tính năng 2: Tiêu đề', type: 'textarea' },
            { id: 'feature2_desc', label: 'Tính năng 2: Mô tả', type: 'textarea' },
            { id: 'feature3_title', label: 'Tính năng 3: Tiêu đề', type: 'textarea' },
            { id: 'feature3_desc', label: 'Tính năng 3: Mô tả', type: 'textarea' }
        ]
    },
    {
        type: 'service_hero',
        name: 'Service: Hero',
        icon: '🛠️',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'primaryButtonLabel', label: 'Nút chính', type: 'text' },
            { id: 'primaryButtonLink', label: 'Link nút chính', type: 'text' },
            { id: 'secondaryButtonLabel', label: 'Nút phụ', type: 'text' },
            { id: 'secondaryButtonLink', label: 'Link nút phụ', type: 'text' },
            { id: 'titleColor', label: 'Màu tiêu đề', type: 'color' },
            { id: 'descriptionColor', label: 'Màu mô tả', type: 'color' }
        ]
    },
    {
        type: 'cold_storage_catalog',
        name: 'Phân loại kho lạnh',
        icon: '🏢',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề lưới', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả lưới', type: 'textarea' },
            { id: 'item1_name', label: 'Loại 1: Tên', type: 'textarea' },
            { id: 'item1_range', label: 'Loại 1: Dải nhiệt', type: 'text' },
            { id: 'item2_name', label: 'Loại 2: Tên', type: 'textarea' },
            { id: 'item2_range', label: 'Loại 2: Dải nhiệt', type: 'text' },
            { id: 'item3_name', label: 'Loại 3: Tên', type: 'textarea' },
            { id: 'item3_range', label: 'Loại 3: Dải nhiệt', type: 'text' },
            { id: 'item4_name', label: 'Loại 4: Tên', type: 'textarea' },
            { id: 'item4_range', label: 'Loại 4: Dải nhiệt', type: 'text' },
            { id: 'item5_name', label: 'Loại 5: Tên', type: 'textarea' },
            { id: 'item5_range', label: 'Loại 5: Dải nhiệt', type: 'text' },
            { id: 'item6_name', label: 'Loại 6: Tên', type: 'textarea' },
            { id: 'item6_range', label: 'Loại 6: Dải nhiệt', type: 'text' }
        ]
    },
    {
        type: 'industrial_expertise',
        name: 'Chuyên gia công nghiệp',
        icon: '👷',
        category: 'Industry & Tech',
        fields: [
            { id: 'diff_title', label: 'Khác biệt: Tiêu đề', type: 'textarea' },
            { id: 'diff_desc', label: 'Khác biệt: Mô tả', type: 'textarea' },
            { id: 'diff_feat1_title', label: 'K.Biệt 1: Tiêu đề', type: 'textarea' },
            { id: 'diff_feat1_desc', label: 'K.Biệt 1: Mô tả', type: 'textarea' },
            { id: 'diff_feat2_title', label: 'K.Biệt 2: Tiêu đề', type: 'textarea' },
            { id: 'diff_feat2_desc', label: 'K.Biệt 2: Mô tả', type: 'textarea' },
            { id: 'diff_feat3_title', label: 'K.Biệt 3: Tiêu đề', type: 'textarea' },
            { id: 'diff_feat3_desc', label: 'K.Biệt 3: Mô tả', type: 'textarea' },
            { id: 'refrig_title', label: 'Môi chất: Tiêu đề', type: 'textarea' },
            { id: 'refrig1_title', label: 'Môi chất 1: Tiêu đề', type: 'textarea' },
            { id: 'refrig1_desc', label: 'Môi chất 1: Mô tả', type: 'textarea' },
            { id: 'refrig2_title', label: 'Môi chất 2: Tiêu đề', type: 'textarea' },
            { id: 'refrig2_desc', label: 'Môi chất 2: Mô tả', type: 'textarea' }
        ]
    },
    {
        type: 'advanced_tech_showcase',
        name: 'Công nghệ chuyên sâu',
        icon: '🚀',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' },
            { id: 'badge', label: 'Nhãn (Badge)', type: 'text' },
            { id: 'item1_title', label: 'CN 1: Tiêu đề', type: 'textarea' },
            { id: 'item1_desc', label: 'CN 1: Mô tả', type: 'textarea' },
            { id: 'item2_title', label: 'CN 2: Tiêu đề', type: 'textarea' },
            { id: 'item2_desc', label: 'CN 2: Mô tả', type: 'textarea' },
            { id: 'item3_title', label: 'CN 3: Tiêu đề', type: 'textarea' },
            { id: 'item3_desc', label: 'CN 3: Mô tả', type: 'textarea' },
            { id: 'item4_title', label: 'CN 4: Tiêu đề', type: 'textarea' },
            { id: 'item4_desc', label: 'CN 4: Mô tả', type: 'textarea' }
        ]
    },
    {
        type: 'technical_detail',
        name: 'Trang chi tiết kỹ thuật',
        icon: '🔬',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề trang', type: 'textarea' },
            { id: 'description', label: 'Mô tả chi tiết', type: 'textarea' },
            { id: 'image', label: 'Hình ảnh chính', type: 'image' },
            { id: 'feature1', label: 'Điểm nhấn 1', type: 'textarea' },
            { id: 'feature2', label: 'Điểm nhấn 2', type: 'textarea' },
            { id: 'feature3', label: 'Điểm nhấn 3', type: 'textarea' },
            { id: 'feature4', label: 'Điểm nhấn 4', type: 'textarea' }
        ]
    },
    {
        type: 'me_systems',
        name: 'Cơ điện (M&E)',
        icon: '⚡',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'image', label: 'Hình ảnh banner', type: 'image' },
            { id: 'cat1_label', label: 'HT 1: Tên', type: 'textarea' },
            { id: 'cat1_sub', label: 'HT 1: Mô tả', type: 'textarea' },
            { id: 'cat1_link', label: 'HT 1: Link', type: 'text' },
            { id: 'cat2_label', label: 'HT 2: Tên', type: 'textarea' },
            { id: 'cat2_sub', label: 'HT 2: Mô tả', type: 'textarea' },
            { id: 'cat2_link', label: 'HT 2: Link', type: 'text' },
            { id: 'cat3_label', label: 'HT 3: Tên', type: 'textarea' },
            { id: 'cat3_sub', label: 'HT 3: Mô tả', type: 'textarea' },
            { id: 'cat3_link', label: 'HT 3: Link', type: 'text' },
            { id: 'cat4_label', label: 'HT 4: Tên', type: 'textarea' },
            { id: 'cat4_sub', label: 'HT 4: Mô tả', type: 'textarea' },
            { id: 'cat4_link', label: 'HT 4: Link', type: 'text' },
            { id: 'cat5_label', label: 'HT 5: Tên', type: 'textarea' },
            { id: 'cat5_sub', label: 'HT 5: Mô tả', type: 'textarea' },
            { id: 'cat5_link', label: 'HT 5: Link', type: 'text' },
            { id: 'cat6_label', label: 'HT 6: Tên', type: 'textarea' },
            { id: 'cat6_sub', label: 'HT 6: Mô tả', type: 'textarea' },
            { id: 'cat6_link', label: 'HT 6: Link', type: 'text' }
        ]
    },
    {
        type: 'data_center',
        name: 'Data Center (DC)',
        icon: '🖥️',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'image', label: 'Hình ảnh', type: 'image' },
            { id: 'dc_feat1_title', label: 'DC 1: Tiêu đề', type: 'textarea' },
            { id: 'dc_feat1_desc', label: 'DC 1: Mô tả', type: 'textarea' },
            { id: 'dc_feat2_title', label: 'DC 2: Tiêu đề', type: 'textarea' },
            { id: 'dc_feat2_desc', label: 'DC 2: Mô tả', type: 'textarea' }
        ]
    },
    {
        type: 'service_lifecycle',
        name: 'Vòng đời dịch vụ',
        icon: '🔄',
        category: 'Industry & Tech',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'step1_title', label: 'Bước 1: Tiêu đề', type: 'textarea' },
            { id: 'step1_desc', label: 'Bước 1: Mô tả', type: 'textarea' },
            { id: 'step2_title', label: 'Bước 2: Tiêu đề', type: 'textarea' },
            { id: 'step2_desc', label: 'Bước 2: Mô tả', type: 'textarea' },
            { id: 'step3_title', label: 'Bước 3: Tiêu đề', type: 'textarea' },
            { id: 'step3_desc', label: 'Bước 3: Mô tả', type: 'textarea' },
            { id: 'step4_title', label: 'Bước 4: Tiêu đề', type: 'textarea' },
            { id: 'step4_desc', label: 'Bước 4: Mô tả', type: 'textarea' }
        ]
    },
    {
        type: 'about_hero',
        name: 'About: Hero',
        icon: 'ℹ️',
        category: 'About Us',
        defaultProps: { title: 'Giới thiệu', description: 'Tổng công ty Kỹ thuật lạnh Việt Nam (VVC)...' },
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'titleColor', label: 'Màu tiêu đề', type: 'color' },
            { id: 'descriptionColor', label: 'Màu mô tả', type: 'color' }
        ]
    },
    {
        type: 'about_history',
        name: 'About: Lịch sử',
        icon: '📜',
        category: 'About Us',
        defaultProps: {
            title: 'Lịch sử phát triển',
            p1: 'Được thành lập vào năm 2003...',
            p2: 'Từ một đơn vị chuyên về lắp đặt...',
            image: '/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png',
            expYears: '20+',
            expText: 'Năm kinh nghiệm'
        },
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'p1', label: 'Đoạn văn 1', type: 'textarea' },
            { id: 'p2', label: 'Đoạn văn 2', type: 'textarea' },
            { id: 'image', label: 'Hình ảnh', type: 'image' },
            { id: 'expYears', label: 'Số năm KN', type: 'text' },
            { id: 'expText', label: 'Text kinh nghiệm', type: 'textarea' }
        ]
    },
    {
        type: 'about_vision',
        name: 'About: Tầm nhìn & Sứ mệnh',
        icon: '🎯',
        category: 'About Us',
        defaultProps: {
            visionTitle: 'Tầm nhìn',
            missionTitle: 'Sứ mệnh'
        },
        fields: [
            { id: 'visionTitle', label: 'Tiêu đề Tầm nhìn', type: 'textarea' },
            { id: 'missionTitle', label: 'Tiêu đề Sứ mệnh', type: 'textarea' }
        ]
    },
    {
        type: 'about_values',
        name: 'About: Giá trị cốt lõi',
        icon: '🛡️',
        category: 'About Us',
        defaultProps: { title: 'Giá trị cốt lõi' },
        fields: [{ id: 'title', label: 'Tiêu đề', type: 'textarea' }]
    },
    {
        type: 'about_partners',
        name: 'About: Đối tác & Khách hàng',
        icon: '🤝',
        category: 'About Us',
        defaultProps: { title: 'Đối tác & Khách hàng' },
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { 
                id: 'mgmt_info', 
                label: 'Quản lý Logo', 
                type: 'info',
                description: 'Dữ liệu logo đối tác được lấy tự động từ danh sách quản lý tập trung. Bạn có thể thêm, sửa hoặc xóa logo tại trang Quản lý Đối tác.',
                action: {
                    label: 'Đi tới Quản lý Đối tác',
                    url: '/admin/partners'
                }
            }
        ]
    },
    {
        type: 'team_hero',
        name: 'Team: Hero',
        icon: '👥',
        category: 'Corporate',
        defaultProps: { title: 'Đội ngũ', subtitle: 'Chúng tôi là một tập thể...' },
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả', type: 'textarea' },
            { id: 'titleColor', label: 'Màu tiêu đề', type: 'color' },
            { id: 'descriptionColor', label: 'Màu mô tả', type: 'color' }
        ]
    },
    {
        type: 'team_grid',
        name: 'Team: Lưới thành viên',
        icon: '⊞',
        category: 'Corporate',
        defaultProps: { title: 'Đội ngũ nhân sự', description: 'Gặp gỡ những chuyên gia của chúng tôi' },
        fields: [
            { id: 'title', label: 'Tiêu đề lưới', type: 'textarea' },
            { id: 'description', label: 'Mô tả lưới', type: 'textarea' }
        ]
    },
    {
        type: 'capability_profile',
        name: 'Hồ sơ năng lực',
        icon: '📄',
        category: 'Corporate',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'pdfUrl', label: 'Link file PDF', type: 'textarea' }
        ]
    },
    {
        type: 'jobs_list',
        name: 'Danh sách tuyển dụng',
        icon: '💼',
        category: 'Corporate',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
        ]
    },
    {
        type: 'contact_form',
        name: 'Form liên hệ',
        icon: '📧',
        category: 'General',
        fields: []
    },
    {
        type: 'about_v2_hero',
        name: 'About V2: Hero',
        icon: '🖼️',
        category: 'About Us V2',
        defaultProps: { title: 'About Us', backgroundImage: '/assets/about-v2/banner.jpg' },
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'backgroundImage', label: 'Ảnh banner', type: 'image' },
            { id: 'titleColor', label: 'Màu tiêu đề', type: 'color' }
        ]
    },
    {
        type: 'about_v2_intro',
        name: 'About V2: Giới thiệu',
        icon: '📄',
        category: 'About Us V2',
        defaultProps: {
            title: 'THUONG THIEN TECHNOLOGIES CO. LTD (TTT)',
            description: 'TTT has been in collaboration with Solar Turbines...',
            image: '/assets/about-v2/ttt-logo.svg',
            backgroundImage: '/assets/about-v2/intro-bg.jpg'
        },
        fields: [
            { id: 'title', label: 'Tiêu đề chính', type: 'textarea' },
            { id: 'description', label: 'Mô tả', type: 'textarea' },
            { id: 'image', label: 'Logo Mockup (phải)', type: 'image' },
            { id: 'backgroundImage', label: 'Ảnh nền Industrial', type: 'image' },
            { id: 'memberText', label: 'Text Thành viên (ví dụ: TTT is a member of)', type: 'textarea' },
            { id: 'memberLogo', label: 'Logo Thành viên', type: 'image' }
        ]
    },
    {
        type: 'about_v2_accordion',
        name: 'About V2: Tầm nhìn/Sứ mệnh',
        icon: '🎯',
        category: 'About Us V2',
        defaultProps: {
            vTitle: 'OUR VISION',
            vContent: 'Become the most Valued Business Partner...',
            mTitle: 'OUR MISSION',
            mContent: 'Provide the highest standardized products...',
            cTitle: 'CORE VALUES',
            cContent: '<ul><li><strong>INTEGRITY</strong>...</li></ul>',
            sideIcon: '/assets/about-v2/team-work-svg.svg'
        },
        fields: [
            { id: 'vTitle', label: 'Tiêu đề Tầm nhìn', type: 'textarea' },
            { id: 'vContent', label: 'Nội dung Tầm nhìn', type: 'textarea' },
            { id: 'mTitle', label: 'Tiêu đề Sứ mệnh', type: 'textarea' },
            { id: 'mContent', label: 'Nội dung Sứ mệnh', type: 'textarea' },
            { id: 'cTitle', label: 'Tiêu đề Giá trị', type: 'textarea' },
            { id: 'cContent', label: 'Nội dung Giá trị (HTML)', type: 'textarea' },
            { id: 'sideIcon', label: 'Icon minh họa (trái)', type: 'image' }
        ]
    },
    {
        type: 'about_v2_timeline',
        name: 'About V2: Timeline',
        icon: '⏳',
        category: 'About Us V2',
        defaultProps: {
            title: 'THE STORY OF SUCCESS',
            milestones: [
                { year: '2003', title: 'Established', desc: 'TTT was founded...', logo: '' }
            ]
        },
        fields: [
            { id: 'title', label: 'Tiêu đề chính', type: 'textarea' },
            { 
                id: 'milestones', 
                label: 'Cột mốc thời gian', 
                type: 'list',
                itemSchema: [
                    { id: 'year', label: 'Năm', type: 'text' },
                    { id: 'title', label: 'Tiêu đề', type: 'textarea' },
                    { id: 'desc', label: 'Mô tả', type: 'textarea' },
                    { id: 'logo', label: 'Logo tùy chỉnh (để trống nếu dùng mặc định)', type: 'image' }
                ]
            }
        ]
    },
    {
        type: 'about_v2_location',
        name: 'About V2: Địa điểm',
        icon: '📍',
        category: 'About Us V2',
        defaultProps: {
            title: 'Locations',
            locations: []
        },
        fields: [
            { id: 'title', label: 'Tiêu đề chính', type: 'textarea' },
            { 
                id: 'locations', 
                label: 'Danh sách địa điểm', 
                type: 'list',
                itemSchema: [
                    { id: 'subTitle', label: 'Nhãn (ví dụ: THUONG THIEN)', type: 'textarea' },
                    { id: 'city', label: 'Tiêu đề (ví dụ: HEAD OFFICE)', type: 'textarea' },
                    { id: 'address', label: 'Địa chỉ', type: 'text' },
                    { id: 'phone', label: 'Số điện thoại', type: 'text' },
                    { id: 'email', label: 'Email', type: 'text' }
                ]
            }
        ]
    },
    // --- HOMEPAGE BLOCKS ---
    {
        type: 'home_banner_slider',
        name: 'Home: Banner Slider',
        icon: '🎞️',
        category: 'Homepage',
        fields: [] // Managed via Banner Manager
    },
    {
        type: 'home_v2_partnership',
        name: 'Home V2: Đối tác',
        icon: '🤝',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea', default: 'Đối Tác Chiến Lược Của Solar Turbines' },
            { id: 'subtitle', label: 'Tiêu đề phụ', type: 'textarea', default: 'Thuong Thien Technologies (TTT)' },
            { id: 'description', label: 'Mô tả', type: 'textarea', default: 'Chúng tôi tự hào là đại diện chính thức và đối tác chiến lược của Solar Turbines tại Việt Nam, cung cấp các giải pháp năng lượng và hệ thống nén khí tiên tiến nhất.' },
            { id: 'partnerImage', label: 'Hình ảnh chính', type: 'image', default: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
            { id: 'logo1', label: 'Logo đối tác 1', type: 'image', default: 'https://www.solar-turbines.com/etc.clientlibs/solar-turbines/clientlibs/clientlib-site/resources/images/cat-logo.png' },
            { id: 'logo2', label: 'Logo đối tác 2', type: 'image', default: 'https://www.solar-turbines.com/etc.clientlibs/solar-turbines/clientlibs/clientlib-site/resources/images/solar-logo.png' },
            { id: 'logo3', label: 'Logo đối tác 3', type: 'image', default: '/assets/partners/ttt-logo.svg' },
            { id: 'exp_value', label: 'Số năm kinh nghiệm', type: 'textarea', default: '20+' },
            { id: 'exp_text', label: 'Văn bản kinh nghiệm', type: 'textarea', default: 'Năm kinh nghiệm trong ngành công nghiệp nặng' }
        ]
    },
    {
        type: 'home_v2_sectors',
        name: 'Home V2: Lĩnh vực',
        icon: '🏗️',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
        ]
    },
    {
        type: 'home_v2_solutions',
        name: 'Home V2: Giải pháp',
        icon: '💡',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
        ]
    },
    {
        type: 'home_v2_stats',
        name: 'Home V2: Thống kê',
        icon: '📊',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề chính', type: 'textarea' }
        ]
    },
    {
        type: 'featured_projects',
        name: 'Home: Dự án tiêu biểu',
        icon: '🏗️',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
        ]
    },
    {
        type: 'news_events',
        name: 'Home: Tin tức & Sự kiện',
        icon: '📰',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
        ]
    },
    {
        type: 'product_categories',
        name: 'Home: Sản phẩm phân phối',
        icon: '📦',
        category: 'Homepage',
        fields: [
            { id: 'title', label: 'Tiêu đề', type: 'textarea' },
            { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
        ]
    }
];


export const BlockLibrary: React.FC = () => {
    // Group blocks by category
    const categories = BLOCK_LIBRARY.reduce((acc, block) => {
        const cat = block.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(block);
        return acc;
    }, {} as Record<string, typeof BLOCK_LIBRARY>);

    // Order categories logically
    const categoryOrder = ['Basic', 'Homepage', 'About Us V2', 'About Us', 'Industry & Tech', 'Corporate', 'General'];
    const sortedCategories = Object.keys(categories).sort((a, b) => {
        const idxA = categoryOrder.indexOf(a);
        const idxB = categoryOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <div className="flex-grow overflow-y-auto custom-scrollbar p-3">
                <Droppable droppableId="blocks-palette" isDropDisabled={true}>
                    {(provided) => (
                        <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                            className="space-y-6"
                        >
                            {sortedCategories.map((catName) => (
                                <div key={catName} className="space-y-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                                        {catName}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories[catName].map((block) => {
                                            // Calculate actual index in the original flat array for DnD
                                            const originalIndex = BLOCK_LIBRARY.findIndex(b => b.type === block.type);
                                            
                                            return (
                                                <Draggable 
                                                    key={`block-${block.type}`} 
                                                    draggableId={`block-${block.type}`} 
                                                    index={originalIndex}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex flex-col items-center justify-center p-2.5 text-center bg-white border border-slate-100 rounded-xl hover:border-primary hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${
                                                                snapshot.isDragging ? 'z-50 shadow-2xl border-primary ring-2 ring-primary/20' : ''
                                                            }`}
                                                            title={block.name}
                                                        >
                                                            <div className="w-10 h-10 flex items-center justify-center text-xl bg-slate-50 rounded-lg mb-1.5 group-hover:bg-primary/5 transition-colors">
                                                                {block.icon}
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-slate-600 truncate w-full px-1">
                                                                {block.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};
