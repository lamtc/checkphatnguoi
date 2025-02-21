// List of valid Vietnam's license plate area codes
const VALID_AREA_CODES = [
  '11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
  '30', '31', '32', '33', '34', '35', '36', '37', '38', '40', '41', '42', '43', '47', '48', '49', '50', '51',
  '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '88',
  '89', '90', '92', '93', '94', '95', '97', '98', '99'
];

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateLicensePlate = (plateNumber: string): ValidationResult => {
  if (!plateNumber) {
    return {
      isValid: false,
      error: 'Vui lòng nhập biển số xe'
    };
  }

  // Remove spaces, dots, and hyphens
  const cleanPlateNumber = plateNumber.replace(/[ .-]/g, '').toUpperCase();

  // Regular expressions for different license plate formats
  const formats = [
    /^\d{2}[A-Z]\d{5}$/, // Format: 51F12345
    /^\d{2}[A-Z][A-Z]\d{5}$/, // Format: 51AB12345
    /^\d{2}[A-Z]\d{4}$/, // Format: 51F1234
    /^\d{2}[A-Z][A-Z]\d{4}$/ // Format: 51AB1234
  ];

  // Check if the plate number matches any of the valid formats
  const isValidFormat = formats.some(format => format.test(cleanPlateNumber));

  if (!isValidFormat) {
    return {
      isValid: false,
      error: 'Biển số không đúng định dạng'
    };
  }

  // Extract area code (first 2 digits)
  const areaCode = cleanPlateNumber.substring(0, 2);

  // Check if area code is valid
  if (!VALID_AREA_CODES.includes(areaCode)) {
    return { 
      isValid: false, 
      error: 'Mã vùng biển số không hợp lệ' 
    };
  }

  return {
    isValid: true
  };
}
