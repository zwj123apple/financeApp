// 错误状态管理 - Redux Toolkit实现
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: null,
  isVisible: false,
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
      state.isVisible = true;
    },
    clearError: (state) => {
      state.error = null;
      state.isVisible = false;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

// 选择器
export const selectError = (state) => state.error.error;
export const selectIsErrorVisible = (state) => state.error.isVisible;

export default errorSlice.reducer;