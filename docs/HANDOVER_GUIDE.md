# 🌸 TÀI LIỆU BÀN GIAO DỰ ÁN THE BLOOM GROUP

Dự án website doanh nghiệp cao cấp tích hợp Hệ quản trị nội dung (CMS) và Trình chỉnh sửa trực quan (Visual Editor).

## trang chủ:
thebloomgroup.vercel.app

## admin: 

---

## 🛠 1. Cấu trúc Hệ thống

Hệ thống được xây dựng trên kiến trúc **3 lớp (3-Layer Architecture)**: UI -> Hook -> Service, đảm bảo tính mở rộng và bảo trì dễ dàng.

*   **Frontend (Website khách hàng)**:
    *   **Thư mục**: `thebloomgroup/`
    *   **Công nghệ**: React, Vite, TailwindCSS, Framer Motion.
    *   **Tính năng**: Hiển thị nội dung động, tối ưu SEO, hiệu ứng chuyển động cao cấp, responsive đa thiết bị.
*   **Backend / CMS (Trang quản trị)**:
    *   **Thư mục**: `backend/`
    *   **Công nghệ**: React, Lucide Icons, Shadcn UI.
    *   **Tính năng**: Quản lý toàn bộ dữ liệu, phân quyền (RBAC), quản lý Media, cấu hình hệ thống.
*   **Cơ sở dữ liệu**:
    *   Sử dụng **Supabase (PostgreSQL)** để lưu trữ dữ liệu thời gian thực và quản lý file (Storage).

---

## 🔐 2. Tài khoản Đăng nhập Hệ thống

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@thebloomgroup.vn` | *(Cung cấp riêng tư)* |
| **Biên tập viên** | `editor@thebloomgroup.vn` | *(Cung cấp riêng tư)* |

> [!IMPORTANT]
> Hệ thống được bảo vệ bởi lớp bảo mật **Invisible Shield** (chống bot, chống spam). Nếu đăng nhập sai quá nhiều lần, IP có thể bị khóa tạm thời.

---

## ⚙️ 3. Hướng dẫn Cấu hình Admin

### 🌐 Cấu hình Tên miền & Brand
*   Truy cập: **Cài đặt hệ thống -> Cấu hình chung**.
*   Tại đây bạn có thể cập nhật:
    *   **Site Title**: Tên hiển thị trên tab trình duyệt.
    *   **Brand Name**: Tên thương hiệu chính.
    *   **Logo/Favicon**: Tải lên ảnh logo chính thức.
    *   **Social Links**: Link Facebook, LinkedIn, YouTube...

### 🔍 Quản lý Meta Data (SEO)
*   Trong phần chỉnh sửa mỗi trang, bạn có các trường:
    *   **Meta Title**: Tiêu đề tối ưu cho Google.
    *   **Meta Description**: Đoạn mô tả ngắn (150-160 ký tự).
    *   **Keywords**: Các từ khóa chính của trang.

### 🍱 Quản lý Menu (Điều hướng)
*   Truy cập: **Quản lý Menu**.
*   **Thêm mới/Chỉnh sửa**: Bạn có thể tạo các mục menu, đặt link hoặc chọn từ danh sách trang tĩnh.
*   **Sắp xếp**: Kéo thả để thay đổi thứ tự.
*   **Trang chủ (Home)**: 
    *   Mục menu nào nằm ở vị trí đầu tiên (trên cùng) sẽ được hệ thống ưu tiên làm **Trang chủ**. 
    *   Bạn có thể tạo cả "Home V1" và "Home V2", sau đó chỉ cần kéo bản muốn dùng lên đầu tiên. Bản còn lại sẽ tự động ẩn đi.

---

## 🎨 4. Chỉnh sửa Nội dung & Hình ảnh (Visual Editor)

Đây là tính năng mạnh mẽ nhất của hệ thống, cho phép chỉnh sửa kéo thả trực quan.

1.  Vào mục **Static Pages (Trang tĩnh)**.
2.  Nhấn nút **Visual Editor** (biểu tượng cây đũa thần ✨) bên cạnh trang muốn sửa.
3.  **Thao tác**:
    *   Nhấn vào các khối nội dung để chỉnh sửa Text, Màu sắc, Hình ảnh.
    *   Thay đổi các thông số như `Title Color`, `Description Color` trực tiếp.
    *   Nhấn **Save** để áp dụng thay đổi ngay lập tức lên website.

---

## 📝 5. Quản lý Tin tức & Tuyển dụng

### 📰 Đăng bài Tin tức (News)
*   Vào mục **Tin tức**.
*   **Tạo bài viết**: Nhập tiêu đề, chọn danh mục, tải ảnh đại diện (Thumbnail).
*   **Nội dung**: Sử dụng trình soạn thảo Rich Text để định dạng văn bản, chèn ảnh bên trong bài viết.
*   **Trạng thái**: Chọn `Active` để hiển thị hoặc `Inactive` để lưu nháp.

### 💼 Quản lý Tuyển dụng (Recruitment)
*   Vào mục **Tuyển dụng**.
*   Nhập các thông tin: Vị trí, Mức lương, Hạn nộp hồ sơ, Mô tả công việc (JD).
*   Các hồ sơ ứng tuyển của ứng viên sẽ được liệt kê trong mục **Applications** kèm thông tin liên hệ và link CV.

---

## 👥 6. Quản lý Người dùng (Users)
*   Xem danh sách nhân sự có quyền truy cập hệ thống.
*   Chỉnh sửa thông tin cá nhân hoặc đổi mật khẩu.
*   **Lưu ý**: Chỉ tài khoản có quyền `Super Admin` mới có thể tạo thêm người dùng mới hoặc thay đổi quyền hạn (Roles).

---

## ⚠️ 7. Các lưu ý quan trọng khi cấu hình

1.  **Kích thước ảnh**: Nên tối ưu ảnh (WebP hoặc JPG dưới 500KB) trước khi tải lên để website load nhanh nhất.
2.  **Đường dẫn (Slug)**: Không nên thay đổi Slug của các trang quan trọng (như `home`, `about-us`, `contact`) vì có thể ảnh hưởng đến các liên kết cũ đã gửi cho khách hàng.
3.  **Cấu hình Address**: Thông tin địa chỉ văn phòng ở chân trang (Footer) được lưu dưới dạng JSON trong Cài đặt. Hãy cẩn thận khi chỉnh sửa định dạng này.
4.  **Hệ thống bảo mật**: Form liên hệ đã có sẵn Honeypot để chặn tin nhắn rác, không nên can thiệp vào các trường ẩn này.

---

*Tài liệu được khởi tạo bởi Antigravity Agent - Senior Team.*
