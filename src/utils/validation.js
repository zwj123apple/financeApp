// 数据验证工具类

// 验证邮箱格式
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证手机号格式（中国大陆手机号）
export const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 验证密码强度
// 至少8位，包含大小写字母和数字
export const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// 验证字段是否为空
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// 验证数字范围
export const isInRange = (number, min, max) => {
  const num = parseFloat(number);
  return !isNaN(num) && num >= min && num <= max;
};

// 验证是否为正数
export const isPositiveNumber = (number) => {
  const num = parseFloat(number);
  return !isNaN(num) && num > 0;
};

// 验证表单字段
export const validateForm = (form, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = form[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !isNotEmpty(value)) {
      errors[field] = fieldRules.requiredMessage || '此字段不能为空';
      return;
    }
    
    if (fieldRules.email && isNotEmpty(value) && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || '请输入有效的邮箱地址';
      return;
    }
    
    if (fieldRules.phone && isNotEmpty(value) && !isValidPhone(value)) {
      errors[field] = fieldRules.phoneMessage || '请输入有效的手机号码';
      return;
    }
    
    if (fieldRules.password && isNotEmpty(value) && !isStrongPassword(value)) {
      errors[field] = fieldRules.passwordMessage || '密码至少8位，包含大小写字母和数字';
      return;
    }
    
    if (fieldRules.min && isNotEmpty(value) && parseFloat(value) < fieldRules.min) {
      errors[field] = fieldRules.minMessage || `最小值为${fieldRules.min}`;
      return;
    }
    
    if (fieldRules.max && isNotEmpty(value) && parseFloat(value) > fieldRules.max) {
      errors[field] = fieldRules.maxMessage || `最大值为${fieldRules.max}`;
      return;
    }
    
    if (fieldRules.custom && !fieldRules.custom.validator(value)) {
      errors[field] = fieldRules.custom.message || '验证失败';
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};