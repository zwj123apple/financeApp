// 交易记录状态管理
import { create } from 'zustand';
import { getUserTransactions, getTransactionStats, addTransaction } from '../services/transactionService';
import { useErrorStore } from './errorStore';

export const useTransactionStore = create((set, get) => ({
  // 状态
  transactions: [],
  isLoading: false,
  transactionFilters: {
    type: '',
    startDate: '',
    endDate: '',
    productId: ''
  },
  
  // 获取用户交易记录
  fetchTransactions: async (userId, filters = {}) => {
    set({ isLoading: true });
    try {
      // 合并现有筛选条件和新的筛选条件
      const mergedFilters = { ...get().transactionFilters, ...filters };
      set({ transactionFilters: mergedFilters });
      
      const transactions = await getUserTransactions(userId, mergedFilters);
      set({ transactions, isLoading: false });
      return { success: true, transactions };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取交易记录失败');
      return { success: false, error: error.message };
    }
  },
  
  // 重置交易记录筛选条件
  resetTransactionFilters: () => {
    set({
      transactionFilters: {
        type: '',
        startDate: '',
        endDate: '',
        productId: ''
      }
    });
  },
  
  // 获取交易统计数据
  fetchTransactionStats: async (userId) => {
    set({ isLoading: true });
    try {
      const stats = await getTransactionStats(userId);
      set({ isLoading: false });
      return { success: true, stats };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取交易统计失败');
      return { success: false, error: error.message };
    }
  },
  
  // 添加交易记录
  addTransaction: (transactionData) => {
    try {
      const newTransaction = addTransaction(transactionData);
      set(state => ({
        transactions: [newTransaction, ...state.transactions]
      }));
      return { success: true, transaction: newTransaction };
    } catch (error) {
      useErrorStore.getState().setError(error.message || '添加交易记录失败');
      return { success: false, error: error.message };
    }
  }
}));