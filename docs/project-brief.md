# Project Brief — LittleBirdies

Thông tin tổng quan của dự án **LittleBirdies Mobile App**. File này định nghĩa mục đích, tech stack, danh sách thành viên và các sơ đồ kiến trúc hệ thống theo chuẩn quy trình phát triển.

---

## Tên app

**LittleBirdies** (Smart Nest & Task Productivity Hub)

## Mục đích

Giúp người dùng cá nhân, sinh viên và đội ngũ quản lý công việc, theo dõi hoạt động đời sống & bảo tồn chim cảnh một cách thông minh, trực quan và tối ưu năng suất.

## Brief

> Ứng dụng di động **LittleBirdies** là nền tảng quản lý công việc và hoạt động thông minh đa nền tảng (iOS & Android).
> App tích hợp hệ thống phân loại danh mục đa dạng (Work 💼, Study 📚, Bird Care 🐦, Personal 🧘, Health 🏃, Finance 💰), hệ thống độ ưu tiên đa cấp (Low, Medium, High, Urgent), và bảng thống kê KPI Analytics trực quan giúp theo dõi tỉ lệ hoàn thành nhiệm vụ theo thời gian thực.
> Điểm khác biệt: Kiến trúc **Offline-first** đồng bộ dữ liệu đệm mượt mà qua AsyncStorage, hỗ trợ song ngữ toàn diện (Anh - Việt), trải nghiệm người dùng hiện đại với thao tác nhanh (Quick complete, Favorite bookmark, Filter chips).
> Target user: Sinh viên, lập trình viên, người chăm sóc chim cảnh & người dùng cần kiểm soát năng suất hàng ngày một cách tinh gọn, đẹp mắt.

## Platform target

- [x] Android
- [x] iOS
- [x] Cả 2 (Universal Mobile)

## Tech stack

- **Framework**: Expo SDK 54.0.0 + React Native 0.81.5 + React 19.1.0
- **Routing**: Expo Router v6 (File-based navigation: Tabs & Stacks)
- **Local storage**: AsyncStorage (Offline caching & local state synchronization)
- **Backend**: Node.js Express REST API (Mock service & Cloud backend on port 5000)
- **Authentication**: JWT / Bearer Token session management
- **Localization**: i18n-js & expo-localization (Hỗ trợ 🇻🇳 Tiếng Việt & 🇬🇧 English)
- **Icons & Theme**: @expo/vector-icons (Ionicons) + Custom Design System tokens

## Links

- **Repo**: `https://github.com/N22DCCN050/KADA-React-LittleBirdies`
- **Backend URL**: `http://localhost:5000` / `http://10.110.206.83:5000`
- **API Endpoints**:
  - `POST /api/auth/login` (Xác thực đăng nhập)
  - `GET /api/items` (Danh sách nhiệm vụ có filter/search)
  - `POST /api/items` (Tạo nhiệm vụ mới)
  - `PUT /api/items/:id` (Cập nhật nhiệm vụ / trạng thái)
  - `DELETE /api/items/:id` (Xóa nhiệm vụ)
  - `GET /api/stats` (Thống kê KPI, danh mục, mức độ ưu tiên)
  - `POST /api/items/reset-seed` (Khôi phục dữ liệu mẫu)

## Team — Team_LittleBirdies

1. **Huỳnh Bá Anh Khoa** — `N22DCCN141` — Team Leader & Fullstack Architecture
2. **Vũ Kim Long** — `N22DCCN050` — Frontend Development & React Native
3. **Trần Tuấn Hải** — `N22DCCN026` — Backend Services & Mock APIs
4. **Đặng Nhật Nam** — `N22DCDT038` — UI/UX Design & Technical Documentation
5. **Tạ Quang An** — `N22DCAT003` — QA, Testing & Validation

## Timeline

- **Started**: 2026-08-10
- **Target MVP**: 2026-08-18
- **Current phase**: MVP Complete & Polish

---

## Diagrams

Sơ đồ Mermaid toàn hệ thống đặt tại thư mục **`docs/diagrams/`**:

- [x] **Architecture** ([`architecture.mmd`](diagrams/architecture.mmd)) — Kiến trúc Client, Offline Cache, Service Layer & Backend API.
- [x] **Sequence Auth** ([`sequence-auth.mmd`](diagrams/sequence-auth.mmd)) — Luồng đăng nhập, lưu token và xác thực request.
- [x] **Sequence Item Flow** ([`sequence-item-flow.mmd`](diagrams/sequence-item-flow.mmd)) — Luồng CRUD công việc, cập nhật lạc quan (optimistic update) & đồng bộ cache.
- [x] **Navigation Flow** ([`navigation.mmd`](diagrams/navigation.mmd)) — Cấu trúc điều hướng Expo Router (Root Stack, Tabs, Modals).
- [x] **Data Flow** ([`data-flow.mmd`](diagrams/data-flow.mmd)) — Vòng đời dữ liệu giữa UI, Local AsyncStorage và Remote REST API.
- [x] **ER Diagram** ([`er.mmd`](diagrams/er.mmd)) — Mô hình thực thể dữ liệu (User, Task/Item, Category, Statistics).
