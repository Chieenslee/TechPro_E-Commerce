# TechPro E-Commerce 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![.NET](https://img.shields.io/badge/.NET_10-5C2D91?style=for-the-badge&logo=.net&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

Một hệ thống Website Thương mại Điện tử bán thiết bị công nghệ hiện đại, được xây dựng với kiến trúc **Frontend - Backend tách biệt**. Đây là Đồ án môn học **Công nghệ Phần mềm (CNPM)**.

## 🌐 Trải nghiệm Live Demo

- **Frontend Website (Vercel):** [https://tech-pro-e-commerce.vercel.app/](https://tech-pro-e-commerce.vercel.app/)
- **Backend API Server (Railway):** Đã được liên kết ngầm với Frontend.

## 🌟 Tính năng nổi bật

1. **Giao diện (UI/UX) cực xịn:** Thiết kế hiện đại (Glassmorphism), có chế độ ban đêm (Dark Mode), tương thích hoàn hảo trên cả điện thoại và máy tính (Responsive).
2. **Xác thực bảo mật:** Đăng nhập, đăng ký bằng cơ chế **JWT (JSON Web Token)**.
3. **Giỏ hàng & Thanh toán:** Thêm/sửa/xóa sản phẩm trong giỏ hàng, tính toán giá trị đơn hàng, lưu trữ LocalStorage để không mất giỏ hàng khi tải lại trang.
4. **Đa ngôn ngữ (i18n):** Hỗ trợ chuyển đổi ngôn ngữ Anh - Việt siêu tốc không cần tải lại trang.
5. **Dashboard Khách hàng:** Quản lý thông tin tài khoản, sổ địa chỉ giao hàng, lịch sử đơn hàng và danh sách yêu thích (Wishlist).
6. **Kiểm thử tự động:** Hỗ trợ kịch bản kiểm thử API thông qua **Postman** (File `TechPro_Postman_Tests.json` đính kèm).

## 🛠 Tech Stack (Công nghệ sử dụng)

### Frontend (`/frontend`)
- **Framework:** React.js 19 (Vite)
- **Styling:** Tailwind CSS (Vanilla CSS base)
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **State Management:** React Context API (Auth, Cart, Language)

### Backend (`/backend`)
- **Framework:** ASP.NET Core 10 (Minimal API)
- **Authentication:** JWT Bearer
- **Database Storage:** SQL Server (Fall-back: JSON Flat Files cho môi trường Cloud Demo)

---

## 💻 Hướng dẫn chạy máy ảo (Local)

Yêu cầu máy tính cài sẵn **Node.js** và **.NET 10 SDK**.

### Chạy bằng Script tự động (Chỉ dành cho Windows)
Vào thư mục gốc của dự án, nhấp đúp vào file:
- `run-all.bat` (Hoặc chuột phải vào `run-all.ps1` chọn Run with PowerShell).
Hệ thống sẽ tự bật Backend tại cổng `7099` và Frontend tại cổng `5173`.

### Chạy thủ công
**1. Khởi động Backend:**
```bash
cd backend
dotnet run
```
*Backend sẽ chạy tại `https://localhost:7099`*

**2. Khởi động Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*Frontend sẽ chạy tại `http://localhost:5173`*

---
*Dự án được xây dựng và hoàn thiện để phục vụ chấm điểm đồ án học phần.*
