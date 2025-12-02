// 입력값 새니타이제이션
export const sanitizeInput = (input: string, maxLength: number = 255): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // HTML 태그 문자 제거
    .slice(0, maxLength);
};

// 이메일 형식 검증
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 비밀번호 검증 (8자 이상, 숫자, 특수문자 포함)
export const validatePassword = (password: string): {
  isValid: boolean;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
} => {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return {
    isValid: hasMinLength && hasNumber && hasSpecialChar,
    hasMinLength,
    hasNumber,
    hasSpecialChar,
  };
};

// 카드번호 검증 (Luhn 알고리즘)
export const validateCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s/g, "");

  // 길이 체크 (13-19자리)
  if (digits.length < 13 || digits.length > 19) return false;

  // 숫자만 포함 체크
  if (!/^\d+$/.test(digits)) return false;

  // Luhn 알고리즘
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// 카드 유효기간 검증
export const validateExpiry = (expiry: string): boolean => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const [, monthStr, yearStr] = match;
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000;

  // 월 범위 체크
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 만료 체크
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

// CVC 검증
export const validateCVC = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc);
};

// 이름 검증 (카드 소유자)
export const validateCardholderName = (name: string): boolean => {
  // 영문자와 공백만 허용, 최소 2자
  return /^[A-Za-z\s]{2,26}$/.test(name.trim());
};

// 한글 이름 검증
export const validateKoreanName = (name: string): boolean => {
  // 한글, 영문, 공백 허용, 2-50자
  return /^[가-힣a-zA-Z\s]{2,50}$/.test(name.trim());
};

// 카드번호 포맷팅 (4자리마다 공백)
export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const parts = digits.match(/.{1,4}/g);
  return parts ? parts.join(" ") : digits;
};

// 유효기간 포맷팅 (MM/YY)
export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
};

// 텍스트 truncate
export const truncateText = (text: string, maxLength: number = 40): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
