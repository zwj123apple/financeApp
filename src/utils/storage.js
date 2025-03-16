// 本地存储工具类

// Token相关操作
const TOKEN_KEY = 'finance_app_token';
const USER_INFO_KEY = 'finance_app_user_info';

// 保存token到本地存储
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('保存token失败:', error);
    return false;
  }
};

// 从本地存储获取token
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('获取token失败:', error);
    return null;
  }
};

// 从本地存储删除token
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('删除token失败:', error);
    return false;
  }
};

// 保存用户信息到本地存储
export const saveUserInfo = (userInfo) => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return false;
  }
};

// 从本地存储获取用户信息
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 从本地存储删除用户信息
export const removeUserInfo = () => {
  try {
    localStorage.removeItem(USER_INFO_KEY);
    return true;
  } catch (error) {
    console.error('删除用户信息失败:', error);
    return false;
  }
};

// 清除所有应用相关的本地存储
export const clearAllStorage = () => {
  try {
    removeToken();
    removeUserInfo();
    // 可以添加其他需要清除的存储项
    return true;
  } catch (error) {
    console.error('清除所有存储失败:', error);
    return false;
  }
};