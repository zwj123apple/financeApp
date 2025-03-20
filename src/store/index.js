// Redux Toolkit 状态管理模块索引文件
export { store, persistor } from './store';

// 导出错误状态相关
export { setError, clearError, selectError, selectIsErrorVisible } from './slices/errorSlice';

// 导出认证状态相关
export {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  clearError as clearAuthError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from './slices/authSlice';

// 导出产品状态相关
export {
  fetchProducts,
  fetchProductDetail,
  purchaseProductThunk,
  sellProductThunk,
  resetFilters,
  clearCurrentProduct,
  selectProducts,
  selectCurrentProduct,
  selectProductLoading,
  selectProductFilters,
  selectProductError
} from './slices/productSlice';

// 导出资产状态相关
export {
  fetchHoldings,
  fetchAssetOverview,
  fetchAssetAnalysis,
  fetchAllocationSuggestion,
  sellHolding,
  selectHoldings,
  selectAssetOverview,
  selectAssetAnalysis,
  selectAllocationSuggestion,
  selectAssetLoading,
  selectAssetError
} from './slices/assetSlice';

// 导出交易记录状态相关
export {
  fetchTransactions,
  fetchTransactionStats,
  addTransactionThunk,
  resetTransactionFilters,
  selectTransactions,
  selectTransactionLoading,
  selectTransactionFilters,
  selectTransactionError
} from './slices/transactionSlice';

// 导出论坛状态相关
export {
  fetchCategories,
  fetchCategoryPosts,
  fetchPostDetail,
  createPostThunk,
  createCommentThunk,
  likePostThunk,
  likeCommentThunk,
  searchPostsThunk,
  loadMorePosts,
  clearCurrentPost,
  clearSearchKeyword,
  sortPosts,
  updatePostLikeInList,
  updateCommentLikeInList,
  selectCategories,
  selectPosts,
  selectCurrentPost,
  selectComments,
  selectPagination,
  selectForumLoading,
  selectSearchKeyword,
  selectForumError
} from './slices/forumSlice';