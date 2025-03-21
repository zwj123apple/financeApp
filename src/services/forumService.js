// 论坛服务
import { get, post, put, del } from '../utils/http';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟论坛分类数据
const mockCategories = [
  {
    id: 1,
    name: '新手入门',
    description: '适合新手用户的基础理财知识和入门指南',
    postsCount: 28,
    icon: 'school'
  },
  {
    id: 2,
    name: '产品讨论',
    description: '讨论各类理财产品的优缺点和投资策略',
    postsCount: 45,
    icon: 'trending-up'
  },
  {
    id: 3,
    name: '市场见解',
    description: '分享对金融市场的分析和见解',
    postsCount: 32,
    icon: 'bar-chart'
  },
  {
    id: 4,
    name: '投资心得',
    description: '分享个人投资经验和心得体会',
    postsCount: 37,
    icon: 'lightbulb'
  }
];

// 模拟帖子数据
let mockPosts = [
  {
    id: 1,
    categoryId: 1,
    userId: 2,
    username: '理财小白',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    title: '新手如何开始理财规划？',
    content: '作为一个理财小白，我想知道应该如何开始我的理财规划？有什么基础知识需要了解吗？推荐哪些低风险的入门产品？',
    createdAt: '2023-06-10T08:30:00Z',
    updatedAt: '2023-06-10T08:30:00Z',
    viewCount: 328,
    likesCount: 42,
    commentsCount: 15
  },
  {
    id: 2,
    categoryId: 2,
    userId: 3,
    username: '投资达人',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    title: '稳健理财90天产品分析',
    content: '最近研究了稳健理财90天这款产品，我认为它的风险收益比还是不错的。以下是我的详细分析...',
    createdAt: '2023-06-08T14:20:00Z',
    updatedAt: '2023-06-09T10:15:00Z',
    viewCount: 256,
    likesCount: 38,
    commentsCount: 12
  },
  {
    id: 3,
    categoryId: 3,
    userId: 4,
    username: '市场分析师',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    title: '2023年下半年市场展望',
    content: '根据当前的经济数据和政策走向，我对2023年下半年的市场做出以下预测...',
    createdAt: '2023-06-05T09:45:00Z',
    updatedAt: '2023-06-07T16:30:00Z',
    viewCount: 512,
    likesCount: 87,
    commentsCount: 24
  },
  {
    id: 4,
    categoryId: 4,
    userId: 5,
    username: '长期投资者',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    title: '我的五年定投心得',
    content: '坚持定投五年后，我总结了一些经验和教训，希望对大家有所帮助...',
    createdAt: '2023-06-01T11:20:00Z',
    updatedAt: '2023-06-02T13:40:00Z',
    viewCount: 435,
    likesCount: 76,
    commentsCount: 18
  },
  {
    id: 5,
    categoryId: 1,
    userId: 6,
    username: '理财教练',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    title: '理财小白必读：认识风险等级',
    content: '很多新手不了解风险等级的含义，本文将详细解释不同风险等级的含义及适合的投资人群...',
    createdAt: '2023-05-28T15:10:00Z',
    updatedAt: '2023-05-28T15:10:00Z',
    viewCount: 387,
    likesCount: 65,
    commentsCount: 14
  }
];

// 模拟评论数据
let mockComments = [
  {
    id: 1,
    postId: 1,
    userId: 7,
    username: '理财顾问',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    content: '建议先了解基本的理财概念，比如复利、风险收益比等。可以从货币基金开始尝试，风险低且流动性好。',
    createdAt: '2023-06-10T09:15:00Z',
    likesCount: 12
  },
  {
    id: 2,
    postId: 1,
    userId: 8,
    username: '稳健投资',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    content: '除了货币基金，也可以考虑一些短期的低风险理财产品，比如稳健理财90天。重要的是先建立紧急备用金，再考虑其他投资。',
    createdAt: '2023-06-10T10:20:00Z',
    likesCount: 8
  },
  {
    id: 3,
    postId: 2,
    userId: 9,
    username: '产品研究员',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    content: '分析很到位，我也认为这款产品适合追求稳定收益的投资者。不过需要注意流动性问题，90天内取出会有一定的损失。',
    createdAt: '2023-06-08T16:30:00Z',
    likesCount: 15
  },
  {
    id: 4,
    postId: 3,
    userId: 10,
    username: '经济学爱好者',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    content: '分析很专业，但我认为还需要考虑全球经济形势的影响，特别是美联储的政策走向。',
    createdAt: '2023-06-05T14:25:00Z',
    likesCount: 20
  },
  {
    id: 5,
    postId: 4,
    userId: 11,
    username: '定投达人',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    content: '定投确实是普通人最适合的投资方式之一，关键是要坚持和选对产品。',
    createdAt: '2023-06-01T15:40:00Z',
    likesCount: 18
  }
];

// 获取论坛分类列表
export const getForumCategories = async () => {
  // 模拟API请求
  await delay(600);
  
  return mockCategories;
};

// 获取分类下的帖子列表
export const getCategoryPosts = async (categoryId, page = 1, pageSize = 10) => {
  // 模拟API请求
  await delay(800);
  
  let filteredPosts = mockPosts;
  
  if (categoryId) {
    filteredPosts = mockPosts.filter(p => p.categoryId === parseInt(categoryId));
  }
  
  // 按更新时间排序（从新到旧）
  filteredPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = filteredPosts.slice(start, end);
  
  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredPosts.length / pageSize)
  };
};

// 获取帖子详情
export const getPostDetail = async (postId) => {
  // 模拟API请求
  await delay(700);
  
  let post = mockPosts.find(p => p.id === parseInt(postId));
  
  if (!post) {
    throw new Error('帖子不存在');
  }
  
  // 增加浏览量
  post.viewCount += 1;
  
  // 获取帖子的评论
  const comments = mockComments.filter(c => c.postId === parseInt(postId));
  
  // 按时间排序（从旧到新）
  comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  return {
    post,
    comments
  };
};

// 发表新帖子
export const createPost = async (postData) => {
  // 模拟API请求
  await delay(1000);
  
  const { userId, username, avatar, categoryId, title, content } = postData;
  
  // 验证分类是否存在
  const category = mockCategories.find(c => c.id === parseInt(categoryId));
  if (!category) {
    throw new Error('分类不存在');
  }
  
  // 创建新帖子
  const now = new Date().toISOString();
  const newPost = {
    id: mockPosts.length + 1,
    categoryId: parseInt(categoryId),
    userId,
    username,
    avatar,
    title,
    content,
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    likesCount: 0,
    commentsCount: 0
  };
  
  mockPosts.push(newPost);
  
  // 更新分类的帖子数量
  category.postsCount += 1;
  
  return newPost;
};

// 发表评论
export const createComment = async (commentData) => {
  // 模拟API请求
  await delay(800);
  
  const { postId, userId, username, avatar, content } = commentData;
  
  // 验证帖子是否存在
  const post = mockPosts.find(p => p.id === parseInt(postId));
  if (!post) {
    throw new Error('帖子不存在');
  }
  
  // 创建新评论
  const now = new Date().toISOString();
  const newComment = {
    id: mockComments.length + 1,
    postId: parseInt(postId),
    userId,
    username,
    avatar,
    content,
    createdAt: now,
    likesCount: 0
  };
  
  mockComments.push(newComment);
  
  // 更新帖子的评论数量
  post.commentsCount += 1;
  
  return newComment;
};

// 点赞帖子
export const likePost = async (postId, userId) => {
  // 模拟API请求
  await delay(500);
  
  // 使用parseInt确保postId是数字类型
  const numericPostId = parseInt(postId);
  
  // 找到帖子对象
  const postIndex = mockPosts.findIndex(p => p.id === numericPostId);
  
  if (postIndex === -1) {
    throw new Error('帖子不存在');
  }
  
  // 获取当前帖子
  const post = mockPosts[postIndex];
  
  // 确保likesCount是数字类型
  const currentLikes = Number(post.likesCount);
  
  // 计算新的点赞数
  const newLikesCount = currentLikes + 1;
  
  // 创建更新后的帖子对象（不可变更新）
  const updatedPost = {
    ...post,
    likesCount: newLikesCount
  };
  
  // 更新mockPosts数组
  mockPosts[postIndex] = updatedPost;
  
  console.log("服务层更新点赞数:", {
    postId: updatedPost.id,
    oldValue: currentLikes,
    newValue: updatedPost.likesCount
  });
  
  return {
    success: true,
    likesCount: updatedPost.likesCount
  };
};

// 点赞评论
export const likeComment = async (commentId, userId) => {
  // 模拟API请求
  await delay(500);
  
  // 使用parseInt确保commentId是数字类型
  const numericCommentId = parseInt(commentId);
  
  // 找到评论对象
  const commentIndex = mockComments.findIndex(c => c.id === numericCommentId);
  
  if (commentIndex === -1) {
    throw new Error('评论不存在');
  }
  
  // 获取当前评论
  const comment = mockComments[commentIndex];
  
  // 确保likesCount是数字类型
  const currentLikes = Number(comment.likesCount);
  
  // 计算新的点赞数
  const newLikesCount = currentLikes + 1;
  
  // 创建更新后的评论对象（不可变更新）
  const updatedComment = {
    ...comment,
    likesCount: newLikesCount
  };
  
  // 更新mockComments数组
  mockComments[commentIndex] = updatedComment;
  
  console.log("服务层更新评论点赞数:", {
    commentId: updatedComment.id,
    oldValue: currentLikes,
    newValue: updatedComment.likesCount
  });
  
  return {
    success: true,
    likesCount: updatedComment.likesCount
  };
};

// 搜索帖子
export const searchPosts = async (keyword, page = 1, pageSize = 10) => {
  // 模拟API请求
  await delay(1000);
  
  // 在标题和内容中搜索关键词
  const filteredPosts = mockPosts.filter(p => 
    p.title.toLowerCase().includes(keyword.toLowerCase()) || 
    p.content.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // 按更新时间排序（从新到旧）
  filteredPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = filteredPosts.slice(start, end);
  
  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredPosts.length / pageSize)
  };
};