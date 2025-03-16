// 资产状态管理
import { create } from 'zustand';
import { getUserHoldings, getUserAssetSummary } from '../services/productService';
import { getUserAssetOverview, getUserAssetAnalysis, getAssetAllocationSuggestion } from '../services/assetService';
import { useErrorStore } from './errorStore';

export const useAssetStore = create((set, get) => ({
  // 状态
  holdings: [],
  assetOverview: null,
  assetAnalysis: null,
  allocationSuggestion: null,
  isLoading: false,
  
  // 获取用户持仓列表
  fetchHoldings: async (userId) => {
    set({ isLoading: true });
    try {
      const holdings = await getUserHoldings(userId);
      set({ holdings, isLoading: false });
      return { success: true, holdings };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取持仓列表失败');
      return { success: false, error: error.message };
    }
  },
  

  
  // 获取用户资产概览
  fetchAssetOverview: async (userId) => {
    set({ isLoading: true });
    try {
      const assetOverview = await getUserAssetOverview(userId);
      set({ assetOverview, isLoading: false });
      return { success: true, assetOverview };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取资产概览失败');
      return { success: false, error: error.message };
    }
  },
  
  // 获取用户资产分析
  fetchAssetAnalysis: async (userId) => {
    set({ isLoading: true });
    try {
      const assetAnalysis = await getUserAssetAnalysis(userId);
      set({ assetAnalysis, isLoading: false });
      return { success: true, assetAnalysis };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取资产分析失败');
      return { success: false, error: error.message };
    }
  },
  
  // 获取资产配置建议
  fetchAllocationSuggestion: async (riskPreference) => {
    set({ isLoading: true });
    try {
      const allocationSuggestion = await getAssetAllocationSuggestion(riskPreference);
      set({ allocationSuggestion, isLoading: false });
      return { success: true, allocationSuggestion };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取资产配置建议失败');
      return { success: false, error: error.message };
    }
  },
  

  
  // 卖出持仓
  sellHolding: async (sellData) => {
    set({ isLoading: true });
    try {
      // 从productService导入sellProduct
      const { sellProduct } = await import('../services/productService');
      const result = await sellProduct(sellData);
      
      // 更新持仓列表
      if (result.success) {
        await get().fetchHoldings(sellData.userId);
      }
      
      set({ isLoading: false });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '卖出持仓失败');
      return { success: false, error: error.message };
    }
  }
}));