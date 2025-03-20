// 交易记录状态管理 - Redux Toolkit实现
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserTransactions, getTransactionStats, addTransaction } from '../../services/transactionService';
import { setError } from './errorSlice';

// 异步thunk action - 获取用户交易记录
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async ({ userId, filters = {} }, { getState, dispatch, rejectWithValue }) => {
    try {
      // 合并现有筛选条件和新的筛选条件
      const currentFilters = getState().transaction.transactionFilters;
      const mergedFilters = { ...currentFilters, ...filters };
      
      const transactions = await getUserTransactions(userId, mergedFilters);
      return { transactions, transactionFilters: mergedFilters };
    } catch (error) {
      dispatch(setError(error.message || '获取交易记录失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取交易统计数据
export const fetchTransactionStats = createAsyncThunk(
  'transaction/fetchTransactionStats',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const stats = await getTransactionStats(userId);
      return { stats };
    } catch (error) {
      dispatch(setError(error.message || '获取交易统计失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 添加交易记录
export const addTransactionThunk = createAsyncThunk(
  'transaction/addTransaction',
  async (transactionData, { dispatch, rejectWithValue }) => {
    try {
      const newTransaction = addTransaction(transactionData);
      return { transaction: newTransaction };
    } catch (error) {
      dispatch(setError(error.message || '添加交易记录失败'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  transactions: [],
  isLoading: false,
  error: null,
  transactionFilters: {
    type: '',
    startDate: '',
    endDate: '',
    productId: ''
  }
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransactionFilters: (state) => {
      state.transactionFilters = {
        type: '',
        startDate: '',
        endDate: '',
        productId: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户交易记录
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.transactionFilters = action.payload.transactionFilters;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取交易统计数据
      .addCase(fetchTransactionStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionStats.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchTransactionStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 添加交易记录
      .addCase(addTransactionThunk.fulfilled, (state, action) => {
        state.transactions = [action.payload.transaction, ...state.transactions];
      })
      .addCase(addTransactionThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetTransactionFilters } = transactionSlice.actions;

// 选择器
export const selectTransactions = (state) => state.transaction.transactions;
export const selectTransactionLoading = (state) => state.transaction.isLoading;
export const selectTransactionFilters = (state) => state.transaction.transactionFilters;
export const selectTransactionError = (state) => state.transaction.error;

export default transactionSlice.reducer;