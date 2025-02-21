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
  NOT_FOUND: 'Không tìm thấy thông tin vi phạm'
} as const;

export const MAX_HISTORY_ITEMS = 10;
