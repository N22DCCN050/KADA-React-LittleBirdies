import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    // App Branding
    appName: 'LittleBirdies',
    appTagline: 'Smart Nest & Task Productivity Hub',

    // Auth Screen
    welcomeTitle: 'Welcome to LittleBirdies 🐦',
    welcomeSubtitle: 'Sign in to organize tasks, track progress & fly high!',
    emailPlaceholder: 'Enter your email address',
    quickDemoLogin: 'Quick Demo Login:',
    studentRole: 'Student 🎓',
    managerRole: 'Manager 💼',
    developerRole: 'Dev 💻',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    orContinueWith: 'or continue with',
    authNote: 'Demo mode: any email address will sign you in securely.',

    // Navigation & Tabs
    tabTasks: 'Tasks',
    tabAnalytics: 'Analytics',
    tabSettings: 'Settings',

    // Tasks Screen
    itemsTitle: 'My Tasks',
    searchPlaceholder: 'Search tasks by title or note...',
    allCategories: 'All',
    filterAll: 'All',
    filterTodo: 'To Do',
    filterInProgress: 'In Progress',
    filterDone: 'Completed',
    filterFavorite: 'Favorites ⭐',
    sortBy: 'Sort By',
    sortNewest: 'Newest',
    sortPriority: 'Priority (High → Low)',
    sortDueDate: 'Due Date',
    sortTitle: 'Title (A → Z)',
    emptyTasksTitle: 'No tasks found',
    emptyTasksDesc: 'Get started by creating your first task or clear current filters.',
    addItem: '+ New Task',
    taskCount: '%{count} tasks',
    completedCount: '%{done}/%{total} completed',

    // Task Item & Card
    duePrefix: 'Due:',
    noDueDate: 'No deadline',
    createdPrefix: 'Created:',
    markDone: 'Complete',
    markTodo: 'Mark Todo',
    markInProgress: 'In Progress',
    toggleFavorite: 'Toggle Favorite',
    delete: 'Delete',
    deleteTitle: 'Delete Task',
    deleteConfirm: 'Are you sure you want to delete "%{title}"?',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // Task Detail Screen
    taskDetails: 'Task Details',
    itemId: 'Task ID',
    notFound: 'Task not found',
    editItem: 'Edit Task',
    descriptionLabel: 'Notes & Description',
    noDescription: 'No description provided.',
    statusLabel: 'Status',
    priorityLabel: 'Priority',
    categoryLabel: 'Category',
    timelineLabel: 'Timestamps',
    createdAt: 'Created at',
    updatedAt: 'Last updated',

    // Task Form (Create & Edit)
    newItem: 'Create New Task',
    save: 'Save Task',
    saving: 'Saving...',
    titleLabel: 'Task Title *',
    titlePlaceholder: 'e.g. Feed finches in sanctuary',
    subtitleLabel: 'Short Summary',
    subtitlePlaceholder: 'Brief 1-line note',
    notesLabel: 'Detailed Notes',
    notesPlaceholder: 'Add checklists, steps, or important notes...',
    dueDateLabel: 'Due Date',
    dueDatePlaceholder: 'YYYY-MM-DD (e.g. 2026-08-25)',
    favoriteLabel: 'Mark as Favorite ⭐',
    validationTitleRequired: 'Please enter a task title',
    validationInvalidDate: 'Please enter date in format YYYY-MM-DD',

    // Analytics Screen
    analyticsTitle: 'Analytics & Insights 📊',
    analyticsSubtitle: 'Track your productivity and task distribution',
    totalTasksCard: 'Total Tasks',
    completedCard: 'Completed',
    inProgressCard: 'In Progress',
    pendingCard: 'To Do',
    completionRate: 'Completion Rate',
    categoryDistribution: 'Category Breakdown',
    priorityDistribution: 'Priority Breakdown',
    productivityScore: 'Productivity Health',
    excellentRate: 'Supercharged! 🚀',
    goodRate: 'Great momentum! 🌟',
    needsWorkRate: 'Time to focus! 💪',

    // Settings Screen
    settingsTitle: 'Settings & Profile ⚙️',
    userProfile: 'User Profile',
    loggedInAs: 'Logged in as',
    role: 'Role',
    preferences: 'Preferences',
    language: 'Language',
    cacheManagement: 'Data & Storage',
    cachedItemsCount: 'Cached Tasks: %{count}',
    clearCache: 'Clear Local Cache',
    cacheCleared: 'Local cache cleared successfully',
    reloadSeedData: 'Reset Demo Data',
    seedReloaded: 'Demo tasks reloaded!',
    teamInfo: 'Team LittleBirdies 🐦',
    teamSubtitle: 'KADA Mobile App Development Project',
    teamMembers: 'Team Members',
    appInfo: 'App Version',
    logOut: 'Log Out',
    logoutConfirm: 'Are you sure you want to log out?',

    // Categories
    catWork: 'Work 💼',
    catStudy: 'Study 📚',
    catBirdCare: 'Bird Care 🐦',
    catPersonal: 'Personal 🧘',
    catHealth: 'Health 🏃',
    catFinance: 'Finance 💰',

    // Priorities
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityUrgent: 'Urgent ⚡',

    // Statuses
    statusTodo: 'To Do',
    statusInProgress: 'In Progress',
    statusDone: 'Completed',
  },

  vi: {
    // App Branding
    appName: 'LittleBirdies',
    appTagline: 'Trung tâm Quản lý Công việc & Năng suất Thông minh',

    // Auth Screen
    welcomeTitle: 'Chào mừng đến LittleBirdies 🐦',
    welcomeSubtitle: 'Đăng nhập để sắp xếp công việc, theo dõi tiến độ và bứt phá!',
    emailPlaceholder: 'Nhập địa chỉ email của bạn',
    quickDemoLogin: 'Đăng nhập nhanh mẫu:',
    studentRole: 'Sinh viên 🎓',
    managerRole: 'Quản lý 💼',
    developerRole: 'Lập trình viên 💻',
    signIn: 'Đăng Nhập',
    signingIn: 'Đang đăng nhập...',
    orContinueWith: 'hoặc tiếp tục với',
    authNote: 'Chế độ Demo: Nhập bất kỳ email nào cũng có thể đăng nhập an toàn.',

    // Navigation & Tabs
    tabTasks: 'Công việc',
    tabAnalytics: 'Thống kê',
    tabSettings: 'Cài đặt',

    // Tasks Screen
    itemsTitle: 'Danh sách Công việc',
    searchPlaceholder: 'Tìm theo tiêu đề hoặc ghi chú...',
    allCategories: 'Tất cả',
    filterAll: 'Tất cả',
    filterTodo: 'Cần làm',
    filterInProgress: 'Đang làm',
    filterDone: 'Đã xong',
    filterFavorite: 'Yêu thích ⭐',
    sortBy: 'Sắp xếp',
    sortNewest: 'Mới nhất',
    sortPriority: 'Ưu tiên (Cao → Thấp)',
    sortDueDate: 'Hạn chót',
    sortTitle: 'Tiêu đề (A → Z)',
    emptyTasksTitle: 'Không có công việc nào',
    emptyTasksDesc: 'Hãy bắt đầu bằng cách tạo công việc mới hoặc xóa bộ lọc hiện tại.',
    addItem: '+ Thêm Mới',
    taskCount: '%{count} công việc',
    completedCount: 'Đã xong %{done}/%{total}',

    // Task Item & Card
    duePrefix: 'Hạn:',
    noDueDate: 'Không có deadline',
    createdPrefix: 'Tạo lúc:',
    markDone: 'Hoàn thành',
    markTodo: 'Chuyển Cần làm',
    markInProgress: 'Chuyển Đang làm',
    toggleFavorite: 'Đổi yêu thích',
    delete: 'Xóa',
    deleteTitle: 'Xóa Công Việc',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa "%{title}"?',
    cancel: 'Hủy',
    confirm: 'Xác nhận',

    // Task Detail Screen
    taskDetails: 'Chi tiết Công việc',
    itemId: 'Mã số',
    notFound: 'Không tìm thấy công việc',
    editItem: 'Chỉnh sửa',
    descriptionLabel: 'Mô tả & Ghi chú',
    noDescription: 'Chưa có mô tả chi tiết.',
    statusLabel: 'Trạng thái',
    priorityLabel: 'Mức độ ưu tiên',
    categoryLabel: 'Danh mục',
    timelineLabel: 'Thời gian',
    createdAt: 'Ngày tạo',
    updatedAt: 'Cập nhật lần cuối',

    // Task Form (Create & Edit)
    newItem: 'Tạo Công Việc Mới',
    save: 'Lưu Công Việc',
    saving: 'Đang lưu...',
    titleLabel: 'Tiêu đề công việc *',
    titlePlaceholder: 'VD: Cho chim ăn tại khu bảo tồn',
    subtitleLabel: 'Tóm tắt ngắn',
    subtitlePlaceholder: 'Ghi chú ngắn 1 dòng',
    notesLabel: 'Ghi chú chi tiết',
    notesPlaceholder: 'Thêm danh sách cần làm, các bước thực hiện...',
    dueDateLabel: 'Hạn hoàn thành',
    dueDatePlaceholder: 'YYYY-MM-DD (VD: 2026-08-25)',
    favoriteLabel: 'Đánh dấu Yêu thích ⭐',
    validationTitleRequired: 'Vui lòng nhập tiêu đề công việc',
    validationInvalidDate: 'Vui lòng nhập ngày theo định dạng YYYY-MM-DD',

    // Analytics Screen
    analyticsTitle: 'Thống Kê & Hiệu Suất 📊',
    analyticsSubtitle: 'Theo dõi năng suất làm việc và phân bổ nhiệm vụ',
    totalTasksCard: 'Tổng nhiệm vụ',
    completedCard: 'Đã hoàn thành',
    inProgressCard: 'Đang tiến hành',
    pendingCard: 'Cần làm',
    completionRate: 'Tỉ lệ hoàn thành',
    categoryDistribution: 'Phân bổ theo Danh mục',
    priorityDistribution: 'Phân bổ theo Mức độ ưu tiên',
    productivityScore: 'Đánh giá Năng suất',
    excellentRate: 'Tuyệt vời! Hiệu suất tối đa 🚀',
    goodRate: 'Tiến độ rất tốt! Tiếp tục phát huy 🌟',
    needsWorkRate: 'Cần tăng tốc hoàn thành công việc! 💪',

    // Settings Screen
    settingsTitle: 'Cài Đặt & Hồ Sơ ⚙️',
    userProfile: 'Hồ Sơ Người Dùng',
    loggedInAs: 'Đang đăng nhập với',
    role: 'Vai trò',
    preferences: 'Tuỳ chọn',
    language: 'Ngôn ngữ',
    cacheManagement: 'Dữ liệu & Bộ nhớ',
    cachedItemsCount: 'Công việc trong Cache: %{count}',
    clearCache: 'Xóa bộ nhớ Cache tạm',
    cacheCleared: 'Đã xóa bộ nhớ Cache thành công',
    reloadSeedData: 'Đặt lại dữ liệu mẫu Demo',
    seedReloaded: 'Đã nạp lại dữ liệu mẫu!',
    teamInfo: 'Nhóm LittleBirdies 🐦',
    teamSubtitle: 'Dự án Phát triển Ứng dụng Di động KADA',
    teamMembers: 'Thành viên nhóm',
    appInfo: 'Phiên bản ứng dụng',
    logOut: 'Đăng Xuất',
    logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất?',

    // Categories
    catWork: 'Công việc 💼',
    catStudy: 'Học tập 📚',
    catBirdCare: 'Chăm chim 🐦',
    catPersonal: 'Cá nhân 🧘',
    catHealth: 'Sức khỏe 🏃',
    catFinance: 'Tài chính 💰',

    // Priorities
    priorityLow: 'Thấp',
    priorityMedium: 'Trung bình',
    priorityHigh: 'Cao',
    priorityUrgent: 'Khẩn cấp ⚡',

    // Statuses
    statusTodo: 'Cần làm',
    statusInProgress: 'Đang làm',
    statusDone: 'Đã xong',
  },
};

export const i18n = new I18n(translations);

const deviceLanguage = getLocales()[0]?.languageCode ?? 'vi';
i18n.locale = deviceLanguage.startsWith('vi') ? 'vi' : 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'vi';

export function setLanguage(lang: 'en' | 'vi') {
  i18n.locale = lang;
}
