// List of valid Vietnam's license plate area codes
const VALID_AREA_CODES = [
  '11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
  '30', '31', '32', '33', '34', '35', '36', '37', '38', '40', '41', '42', '43', '47', '48', '49', '50', '51',
  '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '88',
  '89', '90', '92', '93', '94', '95', '97', '98', '99'
];

export function validateLicensePlate(plate: string): { isValid: boolean; error?: string } {
  // Remove all spaces, dots and convert to uppercase
  const cleanPlate = plate.replace(/[\s.-]/g, '').toUpperCase();

  // Basic format check
  if (!cleanPlate) {
    return { isValid: false, error: 'Vui lòng nhập biển số xe' };
  }

  // Check length
  if (cleanPlate.length < 7 || cleanPlate.length > 9) {
    return { isValid: false, error: 'Biển số xe không hợp lệ' };
  }

  // Extract area code (first 2 digits)
  const areaCode = cleanPlate.substring(0, 2);

  // Check if area code is valid
  if (!VALID_AREA_CODES.includes(areaCode)) {
    return { isValid: false, error: 'Mã vùng biển số không hợp lệ' };
  }

  // Check format based on length
  const remainingPart = cleanPlate.substring(2);
  
  // For 7-8 characters (XXA + XXXXX or XXAB + XXXXX)
  const pattern7_8 = /^[A-Z]{1,2}\d{5}$/;
  
  if (!pattern7_8.test(remainingPart)) {
    return { 
      isValid: false, 
      error: 'Biển số xe không đúng định dạng. Định dạng hợp lệ: XXAB.XXXXX, XXA.XXXXX, XXABXXXXX, hoặc XXAXXXXX (X là số, A/B là chữ)' 
    };
  }

  return { isValid: true };
}
