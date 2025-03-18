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

// 检查Keychain模块是否正确加载
const isKeychainAvailable = () => {
  try {
    // 检查Keychain对象是否存在
    if (!Keychain) {
      console.error('Keychain对象不存在');
      return false;
    }
    
    // 检查NativeModules.RNKeychainManager是否存在
    const { NativeModules } = require('react-native');
    if (!NativeModules.RNKeychainManager) {
      console.error('NativeModules.RNKeychainManager不存在');
      return false;
    }
    
    // 检查关键方法是否可用
    if (typeof Keychain.setGenericPassword !== 'function' ||
        typeof Keychain.getGenericPassword !== 'function' ||
        typeof Keychain.resetGenericPassword !== 'function') {
      console.error('Keychain关键方法不可用');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('检查Keychain可用性时出错:', error);
    return false;
  }
};

// 内存存储作为备用方案
const memoryStorage = {
  _data: new Map(),
  
  async setItem(key, value) {
    try {
      this._data.set(key, value);
      return true;
    } catch (error) {
      console.error(`内存存储保存${key}失败:`, error);
      return false;
    }
  },
  
  async getItem(key) {
    try {
      return this._data.get(key) || null;
    } catch (error) {
      console.error(`内存存储获取${key}失败:`, error);
      return null;
    }
  },
  
  async removeItem(key) {
    try {
      this._data.delete(key);
      return true;
    } catch (error) {
      console.error(`内存存储删除${key}失败:`, error);
      return false;
    }
  }
};

// 移动端存储实现 (iOS/Android)
const mobileStorage = {
  // 保存数据
  async setItem(key, value) {
    try {
      // 检查Keychain是否可用
      if (!isKeychainAvailable()) {
        console.error(`Keychain不可用，使用内存存储保存${key}`);
        return await memoryStorage.setItem(key, value);
      }
      
      // 使用标准方法
      try {
        await Keychain.setGenericPassword(key, value, {
          service: 'financeApp',
          account: key
        });
        return true;
      } catch (innerError) {
        console.warn(`Keychain保存失败，使用内存存储作为备用: ${innerError.message}`);
        return await memoryStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`保存${key}失败:`, error);
      return await memoryStorage.setItem(key, value);
    }
  },
  
  // 获取数据
  async getItem(key) {
    try {
      // 检查Keychain是否可用
      if (!isKeychainAvailable()) {
        console.warn(`Keychain不可用，使用内存存储获取${key}`);
        return await memoryStorage.getItem(key);
      }
      
      try {
        // 为每个key提供service和account参数，解决iOS上的getGenericPasswordForOptions Null错误
        const credentials = await Keychain.getGenericPassword({
          service: 'financeApp',
          account: key
        });
        return credentials ? credentials.password : null;
      } catch (innerError) {
        // 如果Keychain方法失败，使用内存存储
        console.warn(`获取${key}时Keychain.getGenericPassword失败: ${innerError.message}`);
        return await memoryStorage.getItem(key);
      }
    } catch (error) {
      console.error(`获取${key}失败:`, error);
      return await memoryStorage.getItem(key);
    }
  },
  
  // 删除数据
  async removeItem(key) {
    try {
      // 检查Keychain是否可用
      if (!isKeychainAvailable()) {
        console.warn(`Keychain不可用，使用内存存储删除${key}`);
        return await memoryStorage.removeItem(key);
      }
      
      try {
        // 为每个key提供service和account参数，解决iOS上的getGenericPasswordForOptions Null错误
        await Keychain.resetGenericPassword({
          service: 'financeApp',
          account: key
        });
        // 同时从内存存储中删除
        await memoryStorage.removeItem(key);
        return true;
      } catch (innerError) {
        // 如果Keychain方法失败，至少从内存存储中删除
        console.warn(`删除${key}时Keychain.resetGenericPassword失败: ${innerError.message}`);
        return await memoryStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`删除${key}失败:`, error);
      return await memoryStorage.removeItem(key);
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
    // 先尝试从存储中获取数据
    const userInfoString = await storage.getItem(USER_INFO_KEY);
    
    // 如果获取到数据，尝试解析
    if (userInfoString) {
      try {
        return JSON.parse(userInfoString);
      } catch (parseError) {
        console.error('解析用户信息JSON失败:', parseError);
        // JSON解析失败，返回null
        return null;
      }
    }
    
    // 没有获取到数据，返回null
    return null;
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