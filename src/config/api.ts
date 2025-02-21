// API endpoints
export const API_ENDPOINTS = {
  VIOLATION_SEARCH: 'https://api.checkphatnguoi.vn/phatnguoi',
};

// API response codes
export const API_STATUS = {
  SUCCESS: 1,
  ERROR: 0,
};

// API error messages
export const API_MESSAGES = {
  SYSTEM_ERROR: 'Hệ thống đang nâng cấp, vui lòng thử lại sau',
  NO_VIOLATIONS: 'Không tìm thấy thông tin vi phạm',
  INVALID_LICENSE: 'Biển số không hợp lệ',
  USER_REQUIRED: 'Không thể xác định người dùng',
};
