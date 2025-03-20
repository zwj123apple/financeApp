// 用户认证状态管理 - Redux Toolkit实现
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveToken, removeToken, saveUserInfo, removeUserInfo } from '../../utils/storage';
import { login, register, logout } from '../../services/authService';

// 异步thunk action - 登录
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const { token, user } = response;
      
      // 保存token和用户信息到本地存储
      await saveToken(token);
      await saveUserInfo(user);
      
      return { user };
    } catch (error) {
      return rejectWithValue(error.message || '登录失败，请重试');
    }
  }
);

// 异步thunk action - 注册
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      const { token, user } = response;
      
      // 保存token和用户信息到本地存储
      await saveToken(token);
      await saveUserInfo(user);
      
      return { user };
    } catch (error) {
      return rejectWithValue(error.message || '注册失败，请重试');
    }
  }
);

// 异步thunk action - 退出登录
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      
      // 清除本地存储的token和用户信息
      await removeToken();
      await removeUserInfo();
      
      return {};
    } catch (error) {
      return rejectWithValue(error.message || '退出失败，请重试');
    }
  }
);

// 异步thunk action - 重置密码
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {};
    } catch (error) {
      return rejectWithValue(error.message || '重置密码失败，请重试');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 注册
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 退出登录
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 重置密码
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;

// 选择器
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;