// 产品状态管理
import { create } from 'zustand';
import { getProducts, getProductById, purchaseProduct, sellProduct } from '../services/productService';
import { useErrorStore } from './errorStore';

export const useProductStore = create((set, get) => ({
  // 状态
  products: [],
  currentProduct: null,
  isLoading: false,
  filters: {
    riskLevel: '',
    minReturn: '',
    maxTerm: ''
  },
  
  // 获取产品列表
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true });
    try {
      // 合并现有筛选条件和新的筛选条件
      const mergedFilters = { ...get().filters, ...filters };
      set({ filters: mergedFilters });
      
      const products = await getProducts(mergedFilters);
      set({ products, isLoading: false });
      return { success: true, products };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取产品列表失败');
      return { success: false, error: error.message };
    }
  },
  
  // 获取产品详情
  fetchProductDetail: async (productId) => {
    set({ isLoading: true, currentProduct: null });
    try {
      const product = await getProductById(productId);
      set({ currentProduct: product, isLoading: false });
      return { success: true, product };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取产品详情失败');
      return { success: false, error: error.message };
    }
  },
  
  // 购买产品
  purchaseProduct: async (purchaseData) => {
    set({ isLoading: true });
    try {
      const result = await purchaseProduct(purchaseData);
      set({ isLoading: false });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '购买产品失败');
      return { success: false, error: error.message };
    }
  },
  
  // 卖出产品
  sellProduct: async (sellData) => {
    set({ isLoading: true });
    try {
      const result = await sellProduct(sellData);
      set({ isLoading: false });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '卖出产品失败');
      return { success: false, error: error.message };
    }
  },
  
  // 重置筛选条件
  resetFilters: () => {
    set({
      filters: {
        riskLevel: '',
        minReturn: '',
        maxTerm: ''
      }
    });
  },
  
  // 清除当前产品
  clearCurrentProduct: () => {
    set({ currentProduct: null });
  }
}));