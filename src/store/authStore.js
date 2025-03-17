// 用户认证状态管理
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { saveToken, removeToken, saveUserInfo, removeUserInfo } from '../utils/storage';
import { login, register, logout } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 状态
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await login(credentials);
          const { token, user } = response;
          
          // 保存token和用户信息到本地存储
          await saveToken(token);
          await saveUserInfo(user);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || '登录失败，请重试', 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // 注册
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await register(userData);
          const { token, user } = response;
          
          // 保存token和用户信息到本地存储
          await saveToken(token);
          await saveUserInfo(user);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || '注册失败，请重试', 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // 退出登录
      logout: async () => {
        set({ isLoading: true });
        try {
          await logout();
          
          // 清除本地存储的token和用户信息
          await removeToken();
          await removeUserInfo();
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || '退出失败，请重试', 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // 检查认证状态
      checkAuth: () => {
        const user = get().user;
        return !!user;
      },

      // 清除错误
      clearError: () => set({ error: null }),

      // 重置密码
      resetPassword: async (email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // 模拟API请求
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 模拟成功响应
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || '重置密码失败，请重试', 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);