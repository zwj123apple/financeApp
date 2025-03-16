// 错误状态管理
import { create } from 'zustand';

export const useErrorStore = create((set) => ({
  error: null,
  isVisible: false,
  
  // 设置错误信息并显示
  setError: (message) => set({ error: message, isVisible: true }),
  
  // 清除错误信息
  clearError: () => set({ error: null, isVisible: false }),
}));