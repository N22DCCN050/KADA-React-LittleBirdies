# Business — Active Features

Tài liệu quản lý các tính năng đang phát triển và kế hoạch nâng cấp cho **LittleBirdies**.

---

## FEATURE #6: Push Notifications & Due Date Reminders

**Status**: `[ ] Open`  
**Ngày tạo**: 2026-08-18  

### Tôi muốn
- Nhận thông báo đẩy trên thiết bị (Local Notification) nhắc nhở trước 1 giờ khi nhiệm vụ sắp đến hạn (`dueDate`).
- Cho phép người dùng bật/tắt nhắc nhở trong màn hình Form và Cài đặt.

### Request backend ở
- Local-only (sử dụng `expo-notifications`).

### Out of scope
- Server-side FCM remote push notification cho multi-device sync.

### Verify steps
1. Tạo một nhiệm vụ có ngày đến hạn là hôm nay.
2. Thiết bị nhận được thông báo nhắc nhở kèm tiêu đề công việc.
3. Bấm vào thông báo: app tự động mở vào chi tiết nhiệm vụ.

---

## FEATURE #7: Export & Backup Data to JSON

**Status**: `[ ] Open`  
**Ngày tạo**: 2026-08-18  

### Tôi muốn
- Xuất toàn bộ danh sách công việc và thống kê ra file JSON / CSV để lưu trữ dự phòng.
- Nhập dữ liệu (Import) từ file JSON sao lưu vào ứng dụng.

### Request backend ở
- Local-only / `POST /api/items/import`

### Out of scope
- Đồng bộ tự động lên Google Drive / iCloud.

### Verify steps
1. Vào tab Settings, bấm nút "Xuất dữ liệu JSON".
2. File JSON được tải về hoặc chia sẻ qua share sheet của hệ điều hành.
3. Thử xóa sạch cache và bấm "Nhập dữ liệu": danh sách được phục hồi đầy đủ.
