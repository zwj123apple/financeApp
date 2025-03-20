// Redux Toolkit 全局状态管理配置
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// 导入各个slice的reducer
import errorReducer from './slices/errorSlice';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import assetReducer from './slices/assetSlice';
import transactionReducer from './slices/transactionSlice';
import forumReducer from './slices/forumSlice';

// 创建根reducer
const rootReducer = combineReducers({
  error: errorReducer,
  auth: authReducer,
  product: productReducer,
  asset: assetReducer,
  transaction: transactionReducer,
  forum: forumReducer
})

// 配置持久化存储
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // 只持久化auth状态
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// 创建persistor
export const persistor = persistStore(store);