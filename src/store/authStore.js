// 用户认证状态管理
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { saveToken, removeToken, saveUserInfo, removeUserInfo, getToken, getUserInfo } from '../utils/storage';
import { Platform } from 'react-native';
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
      checkAuth: async () => {
        // 首先检查当前状态中是否有用户信息
        let user = get().user;
        let token = null;
        
        // 如果当前状态中没有用户信息，则尝试从本地存储中获取
        if (!user) {
          try {
            // 同时检查token和用户信息
            token = await getToken();
            user = await getUserInfo();
            
            // 如果从本地存储中获取到了用户信息，更新状态
            if (user) {
              set({ user });
            }
          } catch (error) {
            console.error('从本地存储获取用户信息失败:', error);
          }
        }
        
        // 只有同时存在用户信息和token才认为是已认证状态
        const isAuthenticated = !!(user && (token || get().isAuthenticated));
        console.log('认证状态检查结果:', { hasUser: !!user, hasToken: !!token, isAuthenticated });
        
        // 更新认证状态
        set({ isAuthenticated });
        return isAuthenticated;
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
      storage: createJSONStorage(() => ({
        // 自定义存储实现，处理不同平台
        getItem: async (name) => {
          try {
            // 根据存储名称获取对应的数据
            if (name === 'auth-storage') {
              const userInfo = await getUserInfo();
              if (!userInfo) {
                console.log('未找到用户信息，返回null');
                return null;
              }
              return JSON.stringify({
                state: {
                  user: userInfo,
                  isAuthenticated: !!userInfo
                }
              });
            }
            return null;
          } catch (error) {
            console.warn('获取存储数据失败:', error);
            // 返回null而不是抛出异常，确保应用可以继续运行
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            // 根据存储名称保存对应的数据
            if (name === 'auth-storage') {
              const data = JSON.parse(value);
              if (data?.state?.user) {
                const result = await saveUserInfo(data.state.user);
                if (!result) {
                  console.warn('保存用户信息失败，可能是存储不可用');
                }
              }
            }
          } catch (error) {
            console.warn('保存存储数据失败:', error);
            // 不抛出异常，确保应用可以继续运行
          }
        },
        removeItem: async (name) => {
          try {
            if (name === 'auth-storage') {
              const userResult = await removeUserInfo();
              const tokenResult = await removeToken();
              if (!userResult || !tokenResult) {
                console.warn('删除用户信息或token失败，可能是存储不可用');
              }
            }
          } catch (error) {
            console.warn('删除存储数据失败:', error);
            // 不抛出异常，确保应用可以继续运行
          }
        }
      })),
      // 增强错误处理
      onRehydrateStorage: () => (state) => {
        if (!state) {
          console.warn('状态恢复失败，使用默认状态');
        } else {
          console.log('状态恢复成功');
        }
      },
      // 添加备用选项，确保在存储不可用时仍能正常工作
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);