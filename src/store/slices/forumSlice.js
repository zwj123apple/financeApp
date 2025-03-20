// 论坛状态管理 - Redux Toolkit实现
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getForumCategories, 
  getCategoryPosts, 
  getPostDetail, 
  createPost, 
  createComment, 
  likePost, 
  likeComment, 
  searchPosts 
} from '../../services/forumService';
import { setError } from './errorSlice';

// 异步thunk action - 获取论坛分类列表
export const fetchCategories = createAsyncThunk(
  'forum/fetchCategories',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const categories = await getForumCategories();
      return { categories };
    } catch (error) {
      dispatch(setError(error.message || '获取论坛分类失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取分类下的帖子列表
export const fetchCategoryPosts = createAsyncThunk(
  'forum/fetchCategoryPosts',
  async ({ categoryId, page = 1, pageSize = 10 }, { dispatch, rejectWithValue }) => {
    try {
      const result = await getCategoryPosts(categoryId, page, pageSize);
      return result;
    } catch (error) {
      dispatch(setError(error.message || '获取帖子列表失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 获取帖子详情
export const fetchPostDetail = createAsyncThunk(
  'forum/fetchPostDetail',
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      const result = await getPostDetail(postId);
      return result;
    } catch (error) {
      dispatch(setError(error.message || '获取帖子详情失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 发表新帖子
export const createPostThunk = createAsyncThunk(
  'forum/createPost',
  async (postData, { dispatch, rejectWithValue }) => {
    try {
      const newPost = await createPost(postData);
      return { post: newPost };
    } catch (error) {
      dispatch(setError(error.message || '发表帖子失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 发表评论
export const createCommentThunk = createAsyncThunk(
  'forum/createComment',
  async (commentData, { dispatch, rejectWithValue }) => {
    try {
      const newComment = await createComment(commentData);
      return { comment: newComment };
    } catch (error) {
      dispatch(setError(error.message || '发表评论失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 点赞帖子
export const likePostThunk = createAsyncThunk(
  'forum/likePost',
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      const result = await likePost(postId);
      return { postId: parseInt(postId), likesCount: result.likesCount };
    } catch (error) {
      dispatch(setError(error.message || '点赞失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 点赞评论
export const likeCommentThunk = createAsyncThunk(
  'forum/likeComment',
  async (commentId, { dispatch, rejectWithValue }) => {
    try {
      const result = await likeComment(commentId);
      return { commentId: parseInt(commentId), likesCount: result.likesCount };
    } catch (error) {
      dispatch(setError(error.message || '点赞失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 搜索帖子
export const searchPostsThunk = createAsyncThunk(
  'forum/searchPosts',
  async ({ keyword, page = 1, pageSize = 10 }, { dispatch, rejectWithValue }) => {
    try {
      const result = await searchPosts(keyword, page, pageSize);
      return { ...result, searchKeyword: keyword };
    } catch (error) {
      dispatch(setError(error.message || '搜索帖子失败'));
      return rejectWithValue(error.message);
    }
  }
);

// 异步thunk action - 加载更多帖子
export const loadMorePosts = createAsyncThunk(
  'forum/loadMorePosts',
  async ({ categoryId, page }, { dispatch, rejectWithValue }) => {
    try {
      const result = await getCategoryPosts(categoryId, page);
      return result;
    } catch (error) {
      dispatch(setError(error.message || '加载更多帖子失败'));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  posts: [],
  currentPost: null,
  comments: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,
  searchKeyword: ''
};

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.comments = [];
    },
    clearSearchKeyword: (state) => {
      state.searchKeyword = '';
    },
    sortPosts: (state, action) => {
      const sortBy = action.payload || 'latest';
      
      switch(sortBy) {
        case 'latest':
          state.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case 'popular':
          state.posts.sort((a, b) => b.viewCount - a.viewCount);
          break;
        case 'mostLiked':
          state.posts.sort((a, b) => b.likesCount - a.likesCount);
          break;
        case 'mostCommented':
          state.posts.sort((a, b) => b.commentsCount - a.commentsCount);
          break;
        default:
          state.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
    },
    updatePostLikeInList: (state, action) => {
      const { postId, likesCount } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].likesCount = likesCount;
      }
    },
    updateCommentLikeInList: (state, action) => {
      const { postId, likesCount } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.comments[postIndex].likesCount = likesCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取论坛分类列表
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取分类下的帖子列表
      .addCase(fetchCategoryPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchCategoryPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 获取帖子详情
      .addCase(fetchPostDetail.pending, (state) => {
        state.isLoading = true;
        state.currentPost = null;
        state.comments = [];
        state.error = null;
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload.post;
        state.comments = action.payload.comments;
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 发表新帖子
      .addCase(createPostThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPostThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 发表评论
      .addCase(createCommentThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload.comment);
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 点赞帖子
      .addCase(likePostThunk.fulfilled, (state, action) => {
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.likesCount = action.payload.likesCount;
        }
        // 同时更新帖子列表中的点赞数
        const postIndex = state.posts.findIndex(post => post.id === action.payload.postId);
        if (postIndex !== -1) {
          state.posts[postIndex].likesCount = action.payload.likesCount;
        }
      })
      
      // 点赞评论
      .addCase(likeCommentThunk.fulfilled, (state, action) => {
        const commentIndex = state.comments.findIndex(
          comment => comment.id === action.payload.commentId
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex].likesCount = action.payload.likesCount;
        }
      })
      
      // 搜索帖子
      .addCase(searchPostsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPostsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.searchKeyword = action.payload.searchKeyword;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(searchPostsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // 加载更多帖子
      .addCase(loadMorePosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMorePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = [...state.posts, ...action.payload.posts];
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(loadMorePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPost, clearSearchKeyword, sortPosts, updatePostLikeInList, updateCommentLikeInList } = forumSlice.actions;

// 选择器
export const selectCategories = (state) => state.forum.categories;
export const selectPosts = (state) => state.forum.posts;
export const selectCurrentPost = (state) => state.forum.currentPost;
export const selectComments = (state) => state.forum.comments;
export const selectPagination = (state) => state.forum.pagination;
export const selectForumLoading = (state) => state.forum.isLoading;
export const selectSearchKeyword = (state) => state.forum.searchKeyword;
export const selectForumError = (state) => state.forum.error;

export default forumSlice.reducer;