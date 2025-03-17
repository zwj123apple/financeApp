// 本地存储工具类
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

// Token相关操作
const TOKEN_KEY = 'finance_app_token';
const USER_INFO_KEY = 'finance_app_user_info';

// 判断当前平台
const isWeb = Platform.OS === 'web';

// Web平台存储实现
const webStorage = {
  // 保存数据
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`保存${key}失败:`, error);
      return false;
    }
  },
  
  // 获取数据
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`获取${key}失败:`, error);
      return null;
    }
  },
  
  // 删除数据
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除${key}失败:`, error);
      return false;
    }
  }
};

// 移动端存储实现 (iOS/Android)
const mobileStorage = {
  // 保存数据
  async setItem(key, value) {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
      return true;
    } catch (error) {
      console.error(`保存${key}失败:`, error);
      return false;
    }
  },
  
  // 获取数据
  async getItem(key) {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error(`获取${key}失败:`, error);
      return null;
    }
  },
  
  // 删除数据
  async removeItem(key) {
    try {
      await Keychain.resetGenericPassword({ service: key });
      return true;
    } catch (error) {
      console.error(`删除${key}失败:`, error);
      return false;
    }
  }
};

// 根据平台选择存储实现
const storage = isWeb ? webStorage : mobileStorage;

// 保存token到本地存储
export const saveToken = async (token) => {
  return await storage.setItem(TOKEN_KEY, token);
};

// 从本地存储获取token
export const getToken = async () => {
  return await storage.getItem(TOKEN_KEY);
};

// 从本地存储删除token
export const removeToken = async () => {
  return await storage.removeItem(TOKEN_KEY);
};

// 保存用户信息到本地存储
export const saveUserInfo = async (userInfo) => {
  try {
    const userInfoString = JSON.stringify(userInfo);
    return await storage.setItem(USER_INFO_KEY, userInfoString);
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return false;
  }
};

// 从本地存储获取用户信息
export const getUserInfo = async () => {
  try {
    const userInfoString = await storage.getItem(USER_INFO_KEY);
    return userInfoString ? JSON.parse(userInfoString) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 从本地存储删除用户信息
export const removeUserInfo = async () => {
  return await storage.removeItem(USER_INFO_KEY);
};

// 清除所有应用相关的本地存储
export const clearAllStorage = async () => {
  try {
    await removeToken();
    await removeUserInfo();
    // 可以添加其他需要清除的存储项
    return true;
  } catch (error) {
    console.error('清除所有存储失败:', error);
    return false;
  }
};