// 资产状态管理 - Redux Toolkit实现
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserHoldings } from '../../services/productService';
import { getUserAssetOverview, getUserAssetAnalysis, getAssetAllocationSuggestion } from '../../services/assetService';
import { setError } from './errorSlice';

// 异步thunk action - 获取用户持仓列表
export const fetchHoldings = createAsyncThunk(
  'asset/fetchHoldings',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const holdings = await getUserHoldings(userId);
      return { holdings };
    } catch (error) {
      dispatch(setError(error.message || '获取持仓列表失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取用户资产概览
export const fetchAssetOverview = createAsyncThunk(
  'asset/fetchAssetOverview',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const assetOverview = await getUserAssetOverview(userId);
      return { assetOverview };
    } catch (error) {
      dispatch(setError(error.message || '获取资产概览失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取用户资产分析
export const fetchAssetAnalysis = createAsyncThunk(
  'asset/fetchAssetAnalysis',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const assetAnalysis = await getUserAssetAnalysis(userId);
      return { assetAnalysis };
    } catch (error) {
      dispatch(setError(error.message || '获取资产分析失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取资产配置建议
export const fetchAllocationSuggestion = createAsyncThunk(
  'asset/fetchAllocationSuggestion',
  async (riskPreference, { dispatch, rejectWithValue }) => {
    try {
      const allocationSuggestion = await getAssetAllocationSuggestion(riskPreference);
      return { allocationSuggestion };
    } catch (error) {
      dispatch(setError(error.message || '获取资产配置建议失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 卖出持仓
export const sellHolding = createAsyncThunk(
  'asset/sellHolding',
  async (sellData, { dispatch, getState, rejectWithValue }) => {
    try {
      // 从productService导入sellProduct
      const { sellProduct } = await import('../../services/productService');
      const result = await sellProduct(sellData);
      
      // 如果卖出成功，重新获取持仓列表
      if (result.success) {
        dispatch(fetchHoldings(sellData.userId));
      }
      
      return result;
    } catch (error) {
      dispatch(setError(error.message || '卖出持仓失败'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  holdings: [],
  assetOverview: null,
  assetAnalysis: null,
  allocationSuggestion: null,
  isLoading: false,
  error: null
};

export const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    updateAssetAnalysis: (state, action) => {
      if (state.assetAnalysis) {
        state.assetAnalysis = {
          ...state.assetAnalysis,
          ...action.payload
        };
      } else {
        state.assetAnalysis = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户持仓列表
      .addCase(fetchHoldings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHoldings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.holdings = action.payload.holdings;
      })
      .addCase(fetchHoldings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取用户资产概览
      .addCase(fetchAssetOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssetOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assetOverview = action.payload.assetOverview;
      })
      .addCase(fetchAssetOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取用户资产分析
      .addCase(fetchAssetAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssetAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assetAnalysis = action.payload.assetAnalysis;
      })
      .addCase(fetchAssetAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取资产配置建议
      .addCase(fetchAllocationSuggestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllocationSuggestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allocationSuggestion = action.payload.allocationSuggestion;
      })
      .addCase(fetchAllocationSuggestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 卖出持仓
      .addCase(sellHolding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellHolding.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sellHolding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// 选择器
export const selectHoldings = (state) => state.asset.holdings;
export const selectAssetOverview = (state) => state.asset.assetOverview;
export const selectAssetAnalysis = (state) => state.asset.assetAnalysis;
export const selectAllocationSuggestion = (state) => state.asset.allocationSuggestion;
export const selectAssetLoading = (state) => state.asset.isLoading;
export const selectAssetError = (state) => state.asset.error;

export default assetSlice.reducer;