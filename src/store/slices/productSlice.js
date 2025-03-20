// 产品状态管理 - Redux Toolkit实现
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductById, purchaseProduct, sellProduct } from '../../services/productService';
import { setError } from './errorSlice';

// 异步thunk action - 获取产品列表
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (filters = {}, { getState, dispatch, rejectWithValue }) => {
    try {
      // 合并现有筛选条件和新的筛选条件
      const currentFilters = getState().product.filters;
      const mergedFilters = { ...currentFilters, ...filters };
      
      const products = await getProducts(mergedFilters);
      return { products, filters: mergedFilters };
    } catch (error) {
      dispatch(setError(error.message || '获取产品列表失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取产品详情
export const fetchProductDetail = createAsyncThunk(
  'product/fetchProductDetail',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const product = await getProductById(productId);
      return { product };
    } catch (error) {
      dispatch(setError(error.message || '获取产品详情失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 购买产品
export const purchaseProductThunk = createAsyncThunk(
  'product/purchaseProduct',
  async (purchaseData, { dispatch, rejectWithValue }) => {
    try {
      const result = await purchaseProduct(purchaseData);
      return result;
    } catch (error) {
      dispatch(setError(error.message || '购买产品失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 卖出产品
export const sellProductThunk = createAsyncThunk(
  'product/sellProduct',
  async (sellData, { dispatch, rejectWithValue }) => {
    try {
      const result = await sellProduct(sellData);
      return result;
    } catch (error) {
      dispatch(setError(error.message || '卖出产品失败'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {
    riskLevel: '',
    minReturn: '',
    maxTerm: ''
  }
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.filters = {
        riskLevel: '',
        minReturn: '',
        maxTerm: ''
      };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取产品列表
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.filters = action.payload.filters;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取产品详情
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoading = true;
        state.currentProduct = null;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 购买产品
      .addCase(purchaseProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(purchaseProductThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(purchaseProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 卖出产品
      .addCase(sellProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellProductThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sellProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFilters, clearCurrentProduct } = productSlice.actions;

// 选择器
export const selectProducts = (state) => state.product.products;
export const selectCurrentProduct = (state) => state.product.currentProduct;
export const selectProductLoading = (state) => state.product.isLoading;
export const selectProductFilters = (state) => state.product.filters;
export const selectProductError = (state) => state.product.error;

export default productSlice.reducer;