export interface ViolationData {
  'Biển kiểm soát': string;
  'Loại phương tiện': string;
  'Mau biển': string;
  'Nền mầu': string;
  'Thời gian vi phạm': string;
  'Địa điểm vi phạm': string;
  'Hành vi vi phạm': string;
  'Trạng thái': string;
  'Đơn vị phát hiện vi phạm': string;
  'Nơi giải quyết vụ việc': string[];
}

export interface ViolationInfo {
  total: number;
  daxuphat: number;
  chuaxuphat: number;
}

export interface ViolationResponse {
  status: number;
  data: ViolationData[];
  data_info: ViolationInfo;
  lastUpdated?: string;
  message?: string;
  error?: string;
}
