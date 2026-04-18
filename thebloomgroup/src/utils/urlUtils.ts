/**
 * Kiểm tra xem một đường dẫn có phải là liên kết bên ngoài hay không
 */
export const isExternalLink = (path: string): boolean => {
    if (!path) return false;
    return path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:');
};

/**
 * Chuẩn hóa đường dẫn để đảm bảo các liên kết nội bộ luôn bắt đầu bằng '/'
 * và không bị hiểu nhầm thành đường dẫn tương đối.
 */
export const normalizePath = (path: string): string => {
    if (!path) return '/';
    if (isExternalLink(path)) return path;
    
    // Đảm bảo bắt đầu bằng '/'
    const normalized = path.startsWith('/') ? path : `/${path}`;
    
    // Xử lý các trường hợp đặc biệt nếu cần (ví dụ: loại bỏ dấu gạch chéo cuối cùng)
    return normalized === '//' ? '/' : normalized;
};
