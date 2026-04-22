# PROJECT CONTEXT: Thebloomgroup
 
## 🌐 Infrastructure & Environments
 
| Component | Repository Path | Port (Local Dev) | URL |
|-----------|-----------------|------------------|-----|
| **Client (Frontend)** | `thebloomgroup/` | **8081** | `http://localhost:8081/` |
| **Admin (Backend/CMS)** | `backend/` | **5173** | `http://localhost:5173/` |
 
---
 
## 🛠 Project Structure
- **Architecture**: 3-Layer (UI -> Hook -> Service)
- **Database**: Supabase (Project ID: `akryfqelpljvrydxftxc`)
- **Language**: TypeScript / React / Vite
- **CSS**: TailwindCSS / Framer Motion
 
## 📏 Security (Anti-Spam)
- **System**: "Invisible Shield" (Honeypot + Timing Analysis)
- **Protected Vectors**: Contact form, Search, Admin Login.
 
## 📍 Office Network
- Stored as JSON in `contact_address` setting.
- Structured as: `Array<{ id, title, address, phone, email, map_url }>`
