import axios from 'axios';
import { getToken, removeToken } from './storage';
import { useErrorStore } from '../store/errorStore';

// API基础URL配置
const BASE_URL = 'https://api.example.com';

// 创建axios实例
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
http.interceptors.request.use(
  async config => {
    // 从本地存储获取token并添加到请求头
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 如果响应成功，直接返回数据
    return response.data;
  },
  async error => {
    // 获取错误信息
    const { response } = error;
    let message = '网络错误，请稍后重试';
    
    if (response) {
      // 根据状态码处理不同的错误
      switch (response.status) {
        case 400:
          message = response.data.message || '请求参数错误';
          break;
        case 401:
          message = '登录已过期，请重新登录';
          // 清除token并跳转到登录页
          await removeToken();
          // 在实际应用中，这里可能需要使用导航来跳转
          break;
        case 403:
          message = '没有权限访问该资源';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器错误，请稍后重试';
          break;
        default:
          message = response.data.message || '未知错误';
      }
    }
    
    // 使用全局错误状态管理显示错误
    const errorStore = useErrorStore.getState();
    errorStore.setError(message);
    
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params = {}) => {
  return http.get(url, { params });
};

// 封装POST请求
export const post = (url, data = {}) => {
  return http.post(url, data);
};

// 封装PUT请求
export const put = (url, data = {}) => {
  return http.put(url, data);
};

// 封装DELETE请求
export const del = (url, params = {}) => {
  return http.delete(url, { params });
};

export default {
  get,
  post,
  put,
  del
};