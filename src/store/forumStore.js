// 论坛状态管理
import { create } from 'zustand';
import { 
  getForumCategories, 
  getCategoryPosts, 
  getPostDetail, 
  createPost, 
  createComment, 
  likePost, 
  likeComment, 
  searchPosts 
} from '../services/forumService';
import { useErrorStore } from './errorStore';

export const useForumStore = create((set, get) => ({
  // 状态
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
  searchKeyword: '',
  
  // 获取论坛分类列表
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const categories = await getForumCategories();
      set({ categories, isLoading: false });
      return { success: true, categories };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取论坛分类失败');
      return { success: false, error: error.message };
    }
  },
  
  // 获取分类下的帖子列表
  fetchCategoryPosts: async (categoryId, page = 1, pageSize = 10) => {
    set({ isLoading: true });
    try {
      const result = await getCategoryPosts(categoryId, page, pageSize);
      set({ 
        posts: result.posts, 
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        },
        isLoading: false 
      });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取帖子列表失败');
      return { success: false, error: error.message };
    }
  },
  
  // 获取帖子详情
  fetchPostDetail: async (postId) => {
    set({ isLoading: true, currentPost: null, comments: [] });
    try {
      const result = await getPostDetail(postId);
      set({ 
        currentPost: result.post, 
        comments: result.comments, 
        isLoading: false 
      });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '获取帖子详情失败');
      return { success: false, error: error.message };
    }
  },
  
  // 发表新帖子
  createPost: async (postData) => {
    set({ isLoading: true });
    try {
      const newPost = await createPost(postData);
      set({ isLoading: false });
      return { success: true, post: newPost };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '发表帖子失败');
      return { success: false, error: error.message };
    }
  },
  
  // 发表评论
  createComment: async (commentData) => {
    set({ isLoading: true });
    try {
      const newComment = await createComment(commentData);
      
      // 更新评论列表
      const updatedComments = [...get().comments, newComment];
      set({ comments: updatedComments, isLoading: false });
      
      return { success: true, comment: newComment };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '发表评论失败');
      return { success: false, error: error.message };
    }
  },
  
  // 点赞帖子
  likePost: async (postId) => {
    try {
      const result = await likePost(postId);
      
      // 更新当前帖子的点赞数
      if (get().currentPost && get().currentPost.id === parseInt(postId)) {
        const updatedPost = { ...get().currentPost, likesCount: result.likesCount };
        set({ currentPost: updatedPost });
      }
      
      return { success: true, likesCount: result.likesCount };
    } catch (error) {
      useErrorStore.getState().setError(error.message || '点赞失败');
      return { success: false, error: error.message };
    }
  },
  
  // 点赞评论
  likeComment: async (commentId) => {
    try {
      const result = await likeComment(commentId);
      
      // 更新评论的点赞数
      const updatedComments = get().comments.map(comment => {
        if (comment.id === parseInt(commentId)) {
          return { ...comment, likesCount: result.likesCount };
        }
        return comment;
      });
      
      set({ comments: updatedComments });
      
      return { success: true, likesCount: result.likesCount };
    } catch (error) {
      useErrorStore.getState().setError(error.message || '点赞失败');
      return { success: false, error: error.message };
    }
  },
  
  // 搜索帖子
  searchPosts: async (keyword, page = 1, pageSize = 10) => {
    set({ isLoading: true, searchKeyword: keyword });
    try {
      const result = await searchPosts(keyword, page, pageSize);
      set({ 
        posts: result.posts, 
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        },
        isLoading: false 
      });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '搜索帖子失败');
      return { success: false, error: error.message };
    }
  },
  
  // 清除当前帖子和评论
  clearCurrentPost: () => {
    set({ currentPost: null, comments: [] });
  },
  
  // 清除搜索关键词
  clearSearchKeyword: () => {
    set({ searchKeyword: '' });
  },
  
  // 加载更多帖子
  loadMorePosts: async (categoryId, page) => {
    set({ isLoading: true });
    try {
      const result = await getCategoryPosts(categoryId, page);
      set({ 
        posts: [...get().posts, ...result.posts], 
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        },
        isLoading: false 
      });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false });
      useErrorStore.getState().setError(error.message || '加载更多帖子失败');
      return { success: false, error: error.message };
    }
  },
  
  // 更新帖子列表中的帖子点赞数
  updatePostLikeInList: (postId, likesCount) => {
    const updatedPosts = get().posts.map(post => {
      if (post.id === parseInt(postId)) {
        return { ...post, likesCount };
      }
      return post;
    });
    
    set({ posts: updatedPosts });
  },
  
  // 按照不同条件排序帖子
  sortPosts: (sortBy = 'latest') => {
    const posts = [...get().posts];
    
    switch(sortBy) {
      case 'latest':
        posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'popular':
        posts.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'mostLiked':
        posts.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case 'mostCommented':
        posts.sort((a, b) => b.commentsCount - a.commentsCount);
        break;
      default:
        posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    
    set({ posts });
  }
}));