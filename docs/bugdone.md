# Bug Done — Verified Bugs Archive

Danh sách các lỗi đã được xử lý, kiểm thử và nghiệm thu thành công (`[x] Verified`).

---

## BUG #1: Network Request Fail & Stuck Loading Screen on Backend Unreachable

**Status**: `[x] Verified`  
**Ngày report**: 2026-08-18  
**Ngày verify**: 2026-08-18  
**Severity**: `[x] P0 crash / blocker`  

### Triệu chứng
- Khi khởi chạy app bằng `npx expo start` mà chưa bật server backend Node.js (`server.js`), ứng dụng bắn lỗi `Network request failed` liên tục.
- Màn hình bị đứng ở trạng thái chờ Loading rỗng không có dữ liệu nào xuất hiện.

### Expected
- Ứng dụng hoạt động mượt mà ngay cả khi backend offline: Tự động dùng timeout ngắn, nạp dữ liệu mẫu đệm cục bộ (Fallback seed items) và tạo token demo ngoại tuyến để người dùng trải nghiệm ngay lập tức.

### Root cause
- File `lib/api.ts` ném ngoại lệ khi fetch thất bại mà không có cơ chế tự động fallback về dữ liệu mẫu offline; `app/(tabs)/index.tsx` chưa khởi tạo dữ liệu mặc định khi cache `AsyncStorage` trống.

### Fix
- `reference-app/lib/api.ts:58`: Đã tích hợp bộ xử lý `AbortController` timeout (1.5s), thử nối nhiều URL (`localhost`, `127.0.0.1`, IP LAN) và tự động trả về **Fallback Seed Data + Offline Demo Token**.
- `reference-app/app/(tabs)/index.tsx:50`: Đã cập nhật hàm `loadData` tự động nạp dữ liệu mẫu an toàn khi cache rỗng.

### Verify steps
1. Tắt hoàn toàn Mock Server Node.js.
2. Mở ứng dụng trên Expo Web hoặc Android/iOS.
3. Màn hình danh sách công việc hiển thị 6 task mẫu ngay lập tức, không còn bị đứng spinner loading.
4. Đăng nhập với bất kỳ email nào: Đăng nhập thành công vào ứng dụng mượt mà.

---

## BUG #2: Deprecated SafeAreaView Import Warning from React Native

**Status**: `[x] Verified`  
**Ngày report**: 2026-08-18  
**Ngày verify**: 2026-08-18  
**Severity**: `[x] P3 polish`  

### Triệu chứng
- Trên Terminal xuất hiện cảnh báo vàng: `WARN SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.`

### Expected
- Không có cảnh báo Deprecated trong console của Metro bundler.

### Root cause
- Các màn hình `index.tsx`, `analytics.tsx`, `settings.tsx`, `login.tsx`, `[id].tsx`, `new.tsx` import component `SafeAreaView` trực tiếp từ thư viện gốc `react-native` thay vì thư viện tối ưu `react-native-safe-area-context`.

### Fix
- Đã thay thế toàn bộ câu lệnh import `SafeAreaView` sang `react-native-safe-area-context` trên tất cả 6 màn hình.

### Verify steps
1. Mở Terminal Metro bundler.
2. Khởi chạy `npm start` và chuyển đổi giữa các tab.
3. Xác nhận cảnh báo `SafeAreaView has been deprecated` đã biến mất hoàn toàn.

---

## BUG #3: Separate Server Start Requirement (Manual 2-Terminal Step)

**Status**: `[x] Verified`  
**Ngày report**: 2026-08-18  
**Ngày verify**: 2026-08-18  
**Severity**: `[x] P2 minor`  

### Triệu chứng
- Người dùng phải mở 2 cửa sổ Terminal độc lập: 1 cái chạy `node server.js` trong `mock-backend` và 1 cái chạy `npx expo start`.

### Expected
- Khởi chạy cả Mock Backend Server và Expo Metro Bundler chỉ bằng 1 câu lệnh duy nhất.

### Root cause
- File `package.json` chỉ cấu hình lệnh `start` chạy duy nhất `expo start`.

### Fix
- `reference-app/scripts/start-all.js`: Tạo script Node.js spawn 2 tiến trình con song song.
- `reference-app/package.json:6`: Cập nhật `"start": "node ./scripts/start-all.js"`.

### Verify steps
1. Mở 1 Terminal duy nhất trong thư mục `reference-app`.
2. Gõ `npm start`.
3. Cả Mock Backend (Port 5000) và Expo Bundler cùng khởi chạy tự động.

---

## BUG #4: AsyncStorage Cache Invalidation on Item Deletion

**Status**: `[x] Verified`  
**Ngày report**: 2026-08-16  
**Ngày verify**: 2026-08-18  
**Severity**: `[x] P1 major`  

### Triệu chứng
- Khi xóa 1 nhiệm vụ từ màn hình Chi tiết hoặc Danh sách, nếu thoát app mở lại thì task vừa xóa vẫn xuất hiện trở lại.

### Expected
- Task bị xóa phải được cập nhật xóa khỏi bộ nhớ `AsyncStorage` ngay lập tức.

### Root cause
- Hàm xóa chỉ gửi API `deleteItem` mà chưa ghi đè lại danh sách mảng đã lọc vào `AsyncStorage`.

### Fix
- `app/(tabs)/index.tsx:117` và `app/item/[id].tsx:88`: Cập nhật `AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedItems))` đồng bộ ngay khi bấm Xóa.

### Verify steps
1. Mở danh sách công việc, chọn 1 công việc bất kỳ và bấm Xóa.
2. Thoát hoàn toàn ứng dụng (Kill app) rồi mở lại.
3. Công việc đã bị xóa vĩnh viễn và không xuất hiện lại.

---

## BUG #5: Keyboard Overlap on Form Input

**Status**: `[x] Verified`  
**Ngày report**: 2026-08-17  
**Ngày verify**: 2026-08-18  
**Severity**: `[x] P2 minor`  

### Triệu chứng
- Khi nhập văn bản vào ô "Ghi chú chi tiết" ở cuối màn hình tạo công việc trên điện thoại, bàn phím ảo che mất nút "Lưu".

### Expected
- Giao diện tự động đẩy nội dung lên để luôn nhìn thấy vùng nhập liệu và nút Lưu.

### Root cause
- Thiếu `KeyboardAvoidingView` bao bọc bên ngoài `ScrollView`.

### Fix
- `app/item/new.tsx:40`: Bọc toàn bộ form bằng `KeyboardAvoidingView` với cấu hình theo hệ điều hành iOS/Android (`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`).

### Verify steps
1. Mở form "+ Thêm Mới".
2. Bấm vào ô Ghi chú chi tiết để mở bàn phím ảo.
3. Màn hình tự động cuộn mượt và nút Lưu hiển thị rõ ràng.
