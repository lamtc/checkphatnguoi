// API endpoints
export const API_ENDPOINTS = {
  VIOLATION_SEARCH: 'https://api.checkphatnguoi.vn/phatnguoi'
} as const;

// API response codes
export const API_STATUS = {
  SUCCESS: 1,
  ERROR: 0
} as const;

// API error messages
export const API_MESSAGES = {
  SYSTEM_ERROR: 'Hệ thống đang nâng cấp, vui lòng thử lại sau',
  INVALID_LICENSE: 'Biển số không hợp lệ',
  USER_REQUIRED: 'Không thể xác định người dùng',
  NO_VIOLATIONS: 'Không tìm thấy thông tin vi phạm',
  NETWORK_ERROR: 'Lỗi kết nối, vui lòng thử lại sau'
} as const;

export const MAX_HISTORY_ITEMS = 10;
