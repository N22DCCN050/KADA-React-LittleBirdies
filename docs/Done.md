# Done — Archived Features

Danh sách các tính năng đã được triển khai, kiểm thử và nghiệm thu thành công (`[x] Verified`).

---

## FEATURE #1: Authentication & Token Management

**Status**: `[x] Verified`  
**Ngày tạo**: 2026-08-10  
**Ngày xong**: 2026-08-18  

### Tôi muốn
- Đăng nhập vào ứng dụng bằng email với các tài khoản mẫu (Student, Manager, Developer).
- Lưu trữ phiên đăng nhập an toàn qua Bearer token, tự động chuyển hướng vào màn hình chính khi đã đăng nhập và điều hướng về trang Login khi hết phiên / đăng xuất.

### Request backend ở
- `POST /api/auth/login` — Trả về JWT demo token kèm thông tin user và role.

### Out of scope
- Xác thực qua mạng xã hội bên thứ ba (Google/Apple OAuth) — để dành cho giai đoạn tiếp theo.

### Verify steps
1. Mở app, màn hình Login hiển thị giao diện thương hiệu LittleBirdies.
2. Bấm vào nút đăng nhập nhanh "Student 🎓".
3. App tự động xác thực và chuyển hướng vào danh sách công việc (`app/(tabs)/index.tsx`).
4. Tắt app mở lại: phiên đăng nhập vẫn được duy trì mà không cần login lại.
5. Vào tab Settings và bấm Đăng xuất: app trở về màn hình Login.

---

## FEATURE #2: Task CRUD with Offline Cache Sync

**Status**: `[x] Verified`  
**Ngày tạo**: 2026-08-12  
**Ngày xong**: 2026-08-18  

### Tôi muốn
- Xem danh sách công việc, tạo công việc mới, chỉnh sửa và xóa công việc.
- Đánh dấu hoàn thành trực tiếp bằng checkbox và gắn sao yêu thích trên thẻ nhiệm vụ.
- Hỗ trợ lưu trữ offline qua AsyncStorage để dữ liệu không bị mất khi mất kết nối mạng.

### Request backend ở
- `GET /api/items` — Lấy danh sách nhiệm vụ.
- `GET /api/items/:id` — Lấy chi tiết nhiệm vụ.
- `POST /api/items` — Thêm nhiệm vụ mới.
- `PUT /api/items/:id` — Cập nhật nhiệm vụ / trạng thái.
- `DELETE /api/items/:id` — Xóa nhiệm vụ.

### Out of scope
- Chia sẻ nhiệm vụ giữa nhiều người dùng theo thời gian thực (WebSockets).

### Verify steps
1. Vào tab Tasks, danh sách công việc hiển thị đầy đủ các trường dữ liệu.
2. Bấm vào nút tròn checkbox trên 1 task: trạng thái chuyển sang Đã xong (gạch ngang tiêu đề) ngay lập tức.
3. Bấm vào ngôi sao: task được đánh dấu yêu thích.
4. Bấm nút "+": điền tiêu đề và lưu, task mới xuất hiện đầu danh sách.
5. Bấm vào 1 task để xem chi tiết, sửa nội dung và bấm Lưu.

---

## FEATURE #3: Bilingual Support (EN / VI)

**Status**: `[x] Verified`  
**Ngày tạo**: 2026-08-13  
**Ngày xong**: 2026-08-18  

### Tôi muốn
- Chuyển đổi ngôn ngữ linh hoạt giữa Tiếng Việt (🇻🇳 VI) và Tiếng Anh (🇬🇧 EN).
- Toàn bộ giao diện (tiêu đề, placeholder, nút bấm, badge, thông báo, cảnh báo xác nhận) tự động cập nhật ngay khi chọn ngôn ngữ.

### Request backend ở
- Local-only (sử dụng thư viện `i18n-js` và `expo-localization`).

### Out of scope
- Dịch tự động nội dung văn bản do người dùng tự gõ.

### Verify steps
1. Tại góc trên bên phải của bất kỳ màn hình nào, bấm nút chuyển đổi `🇬🇧 EN` hoặc `🇻🇳 VI`.
2. Giao diện toàn app đổi sang ngôn ngữ tương ứng mượt mà không cần reload app.

---

## FEATURE #4: Category & Priority System with Chips & Badges

**Status**: `[x] Verified`  
**Ngày tạo**: 2026-08-15  
**Ngày xong**: 2026-08-18  

### Tôi muốn
- Phân loại công việc theo 6 danh mục: Work 💼, Study 📚, Bird Care 🐦, Personal 🧘, Health 🏃, Finance 💰.
- Đặt mức độ ưu tiên 4 cấp: Low (Xanh lá), Medium (Xanh dương), High (Vàng cam), Urgent (Đỏ).
- Thanh lọc danh mục dạng thanh cuộn ngang (Horizontal scroll chips) và thanh lọc trạng thái (All, Todo, In Progress, Done, Favorites).

### Request backend ở
- `GET /api/items?category=...&status=...&priority=...` — Lọc dữ liệu phía backend.

### Out of scope
- Người dùng tự tạo danh mục màu tùy chỉnh.

### Verify steps
1. Chọn chip "Chăm chim 🐦": danh sách chỉ hiển thị các công việc thuộc danh mục chăm sóc chim.
2. Chọn tab "Yêu thích ⭐": danh sách chỉ hiển thị các task đã gắn sao.
3. Bấm icon Sort: sắp xếp theo mức độ ưu tiên hoặc hạn chót.

---

## FEATURE #5: Analytics & Productivity Dashboard

**Status**: `[x] Verified`  
**Ngày tạo**: 2026-08-16  
**Ngày xong**: 2026-08-18  

### Tôi muốn
- Xem tổng quan các chỉ số KPI: Tổng số công việc, Đã xong, Đang làm, Cần làm, Tỉ lệ hoàn thành %.
- Thanh tiến độ năng suất trực quan kèm đánh giá trạng thái (Siêu năng suất, Tiến độ tốt, Cần tăng tốc).
- Biểu đồ phân bổ theo từng danh mục và mức độ ưu tiên.

### Request backend ở
- `GET /api/stats` — Trả về số liệu thống kê tổng hợp.

### Out of scope
- Xuất biểu đồ ra file ảnh PDF.

### Verify steps
1. Chuyển sang tab Analytics (Thống kê 📊).
2. Kiểm tra các thẻ KPI hiển thị đúng số lượng công việc hiện có.
3. Hoàn thành 1 task ở tab Tasks và quay lại Analytics: Tỉ lệ hoàn thành tự động tăng lên.
