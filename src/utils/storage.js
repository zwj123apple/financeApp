// 本地存储工具类
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 常量定义
const TOKEN_KEY = 'finance_app_token';
const USER_INFO_KEY = 'finance_app_user_info';
const KEYCHAIN_SERVICE = 'financeApp';

// 判断当前平台
const isWeb = Platform.OS === 'web';

// 判断是否在模拟器上运行
const isSimulator = () => {
  // iOS模拟器检测
  if (Platform.OS === 'ios') {
    return process.env.NODE_ENV === 'development' && !Platform.constants.uiMode;
  }
  // Android模拟器检测 (不完全可靠，但在开发环境中通常足够)
  if (Platform.OS === 'android') {
    return process.env.NODE_ENV === 'development' && !Platform.constants.Brand;
  }
  return false;
};

// Web平台存储实现
const webStorage = {
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Web存储操作失败: ${key}`, error);
      return false;
    }
  },
  
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Web存储操作失败: ${key}`, error);
      return null;
    }
  },
  
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Web存储操作失败: ${key}`, error);
      return false;
    }
  }
};

// 模拟器存储实现 (使用AsyncStorage)
const simulatorStorage = {
  // 保存数据
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`AsyncStorage操作失败: ${key}`, error);
      return false;
    }
  },
  
  // 获取数据
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error(`AsyncStorage操作失败: ${key}`, error);
      return null;
    }
  },
  
  // 删除数据
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`AsyncStorage操作失败: ${key}`, error);
      return false;
    }
  }
};

// 真机存储实现 (使用SecureStore)
const deviceStorage = {
  // 保存数据
  async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value, { keychainService: KEYCHAIN_SERVICE });
      return true;
    } catch (error) {
      console.error(`SecureStore操作失败: ${key}`, error);
      return false;
    }
  },
  
  // 获取数据
  async getItem(key) {
    try {
      const value = await SecureStore.getItemAsync(key, { keychainService: KEYCHAIN_SERVICE });
      return value;
    } catch (error) {
      console.error(`SecureStore操作失败: ${key}`, error);
      return null;
    }
  },
  
  // 删除数据
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key, { keychainService: KEYCHAIN_SERVICE });
      return true;
    } catch (error) {
      console.error(`SecureStore操作失败: ${key}`, error);
      return false;
    }
  }
};

// 根据平台选择存储实现
const storage = isWeb ? webStorage : (isSimulator() ? simulatorStorage : deviceStorage);

// 输出当前使用的存储方式，便于调试
console.log(`当前使用的存储方式: ${isWeb ? 'Web存储' : (isSimulator() ? 'AsyncStorage(模拟器)' : 'SecureStore(真机)')}`);

// 保存token到本地存储
export const saveToken = async (token) => {
  return storage.setItem(TOKEN_KEY, token);
};

// 从本地存储获取token
export const getToken = async () => {
  return storage.getItem(TOKEN_KEY);
};

// 从本地存储删除token
export const removeToken = async () => {
  return storage.removeItem(TOKEN_KEY);
};

// 保存用户信息到本地存储
export const saveUserInfo = async (userInfo) => {
  try {
    const userInfoString = JSON.stringify(userInfo);
    return storage.setItem(USER_INFO_KEY, userInfoString);
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return false;
  }
};

// 从本地存储获取用户信息
export const getUserInfo = async () => {
  try {
    const userInfoString = await storage.getItem(USER_INFO_KEY);
    if (!userInfoString) return null;
    
    return JSON.parse(userInfoString);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 从本地存储删除用户信息
export const removeUserInfo = async () => {
  return storage.removeItem(USER_INFO_KEY);
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