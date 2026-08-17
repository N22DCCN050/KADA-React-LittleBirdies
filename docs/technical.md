# Technical — React Native Engineering Standards & Best Practices

Tài liệu hướng dẫn kỹ thuật và tiêu chuẩn phát triển dự án **LittleBirdies React Native**.

---

## 1. Kiến trúc tổng thể (Architecture Principles)

- **Expo Router (File-based routing)**:
  - Tất cả route nằm trong thư mục `app/`.
  - Nhóm tab sử dụng group folder `app/(tabs)/`.
  - Màn hình động sử dụng file param `app/item/[id].tsx`.
- **Offline-First & Local Storage**:
  - Dữ liệu nhiệm vụ được đọc và ghi vào `AsyncStorage` để người dùng có thể xem và tương tác ngay cả khi offline.
  - Khi có kết nối mạng, API calls được thực thi ngầm và đồng bộ ngược về cache.
- **Tách biệt tầng (Layer Separation)**:
  - `lib/api.ts`: Xử lý network requests, timeout fallback và request headers.
  - `lib/auth.ts`: Quản lý token xác thực (`AsyncStorage` / `SecureStore`).
  - `lib/i18n.ts`: Toàn bộ chuỗi ngôn ngữ song ngữ Anh - Việt.
  - `components/`: UI components tái sử dụng (`Card`, `Badge`, `CategoryFilter`, `LanguageToggle`).
  - `theme.ts`: Design tokens tập trung (colors, spacing, radius, fontSize, shadows).

---

## 2. Best Practices về Hiệu năng (Performance Rules)

### Danh sách cuộn (FlatList vs ScrollView)
- Luôn sử dụng `FlatList` cho danh sách có số lượng phần tử thay đổi hoặc lớn hơn 10 items.
- Cung cấp `keyExtractor={(item) => item.id}` có tính duy nhất.
- Tránh định nghĩa inline arrow function trong `renderItem` nếu có thể, hoặc bọc `useCallback`.

### Memoization
- Sử dụng `useMemo` cho các thao tác lọc (`filter`), tìm kiếm (`search`) và sắp xếp (`sort`) danh sách.
- Sử dụng `useCallback` cho các handler hàm truyền qua props hoặc dependencies của effect (`loadData`, `handleToggleStatus`).

### Safe Area & UI Scaling
- Luôn sử dụng `SafeAreaView` từ `react-native` hoặc `react-native-safe-area-context` để tránh bị notch tai thỏ và home indicator che khuất nội dung.
- Dùng `KeyboardAvoidingView` với cấu hình theo platform (`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`) cho các form nhập liệu.

### Styling
- Luôn sử dụng `StyleSheet.create({...})` để React Native tối ưu hóa đối tượng style qua bridge ID.
- Không hardcode mã màu rời rạc; luôn tham chiếu từ `theme.ts` (`colors.primary`, `colors.border`, ...).

---

## 3. Quy chuẩn Quản lý Dữ liệu & Xử lý Lỗi

### Optimistic UI Updates
- Khi người dùng đánh dấu hoàn thành (`Toggle Status`), gắn sao (`Toggle Favorite`) hoặc Xóa (`Delete`):
  1. Cập nhật state UI ngay lập tức.
  2. Ghi đè bộ nhớ đệm `AsyncStorage`.
  3. Gửi request đồng bộ tới REST API.
  4. Nếu network lỗi, revert state và hiển thị thông báo lỗi rõ ràng.

### Fallback Network Endpoint
- Trong môi trường phát triển (Mobile Emulator / Expo Go trên máy thật), hàm `request` trong `lib/api.ts` tự động fallback giữa IP LAN máy chủ (`http://10.110.206.83:5000`) và `http://localhost:5000`.

---

## 4. Checklist Kiểm thử & Code Quality

- [x] Không còn TypeScript compiler errors (`npx tsc --noEmit` pass).
- [x] Không có unhandled promise rejections trong API calls.
- [x] Tất cả chuỗi hiển thị có key trong cả `en` và `vi` của `lib/i18n.ts`.
- [x] Touch targets của các nút bấm đảm bảo tối thiểu 44x44 points kèm `hitSlop`.
