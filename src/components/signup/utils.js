// utils.js
export const formatPhoneNumber = (value) => {
    if (!value) return "";
  
    const numbers = value.replace(/[^\d]/g, "");
  
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };
  
  export const validatePhoneNumber = (number) => {
    if (!number) {
      return { isValid: true, message: "" };
    }
  
    const validLength = number.length >= 11 && number.length <= 11;
  
    if (!validLength) {
      return { isValid: false, message: "유효하지 않은 휴대폰 번호입니다." };
    } else {
      return { isValid: true, message: "" };
    }
  };
  
  export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;