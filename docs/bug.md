# Bug — Active Bugs

Tài liệu theo dõi và quản lý các lỗi đang được xử lý trong dự án **LittleBirdies**.

> **Ghi chú**: Tất cả các bug nghiêm trọng (P0, P1, P2) phát hiện trong quá trình phát triển bao gồm:
> - Lỗi kết nối mạng khi server offline (BUG #1)
> - Cảnh báo Deprecated SafeAreaView (BUG #2)
> - Khởi chạy server 2 terminal riêng biệt (BUG #3)
> - Đã được khắc phục 100% và lưu tại tài liệu nghiệm thu [docs/bugdone.md](bugdone.md).

---

## BUG #6: Dark Mode Contrast Enhancement in Category Chips

**Status**: `[ ] Open`  
**Ngày report**: 2026-08-18  
**Severity**: `[x] P3 polish`  

### Triệu chứng
- Khi hệ điều hành di động bật chế độ nền tối (Dark Mode), độ tương phản của chữ màu xám trên nền chip lọc danh mục chưa được tối ưu cao nhất.

### Expected
- Chữ trên chip filter danh mục tự động chuyển sang màu trắng sáng nổi bật khi hệ thống bật Dark Mode.

### Root cause (fill sau khi debug)
- Sẽ bổ sung hỗ trợ hook `useColorScheme()` từ React Native trong phiên bản tiếp theo.

### Fix (fill khi AI xong)
- Đang lên kế hoạch tích hợp palette màu Dark Mode mở rộng.

### Verify steps (cho user test)
1. Bật Dark Mode trên thiết bị di động.
2. Mở tab Tasks, quan sát thanh chip lọc danh mục.
3. Chữ hiển thị tương phản rõ nét và dễ đọc.
