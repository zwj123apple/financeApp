// 认证服务
import { get, post } from '../utils/http';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'test',
    password: '123456',
    email: 'test@example.com',
    phone: '13800138000',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  }
];

// 登录
export const login = async (credentials) => {
  // 模拟API请求
  await delay(1000);
  
  const { username, password } = credentials;
  const user = mockUsers.find(u => 
    (u.username === username || u.email === username) && u.password === password
  );
  
  if (user) {
    // 模拟成功响应
    const { password, ...userWithoutPassword } = user;
    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).substr(2),
      user: userWithoutPassword
    };
  } else {
    // 模拟失败响应
    throw new Error('用户名或密码错误');
  }
};

// 注册
export const register = async (userData) => {
  // 模拟API请求
  await delay(1000);
  
  const { username, email } = userData;
  
  // 检查用户名或邮箱是否已存在
  if (mockUsers.some(u => u.username === username || u.email === email)) {
    throw new Error('用户名或邮箱已被注册');
  }
  
  // 模拟成功注册
  const newUser = {
    id: mockUsers.length + 1,
    ...userData
  };
  
  mockUsers.push(newUser);
  
  // 返回注册成功的用户信息和token
  const { password, ...userWithoutPassword } = newUser;
  return {
    token: 'mock-jwt-token-' + Math.random().toString(36).substr(2),
    user: userWithoutPassword
  };
};

// 退出登录
export const logout = async () => {
  // 模拟API请求
  await delay(500);
  
  // 模拟成功响应
  return { success: true, message: '退出成功' };
};

// 获取用户信息
export const getUserProfile = async () => {
  // 模拟API请求
  await delay(800);
  
  // 模拟成功响应
  const user = mockUsers[0];
  const { password, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
};

// 更新用户信息
export const updateUserProfile = async (userData) => {
  // 模拟API请求
  await delay(1000);
  
  // 模拟成功响应
  return {
    success: true,
    user: {
      id: 1,
      ...userData
    }
  };
};

// 发送重置密码验证码
export const sendResetPasswordCode = async (email) => {
  // 模拟API请求
  await delay(1000);
  
  // 检查邮箱是否存在
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error('该邮箱未注册');
  }
  
  // 模拟成功响应
  return { success: true, message: '验证码已发送' };
};

// 验证重置密码验证码
export const verifyResetCode = async (email, code) => {
  // 模拟API请求
  await delay(1000);
  
  // 模拟成功响应
  return { success: true, message: '验证码验证成功' };
};

// 重置密码
export const resetPassword = async (email, newPassword) => {
  // 模拟API请求
  await delay(1000);
  
  // 查找用户并更新密码
  const userIndex = mockUsers.findIndex(u => u.email === email);
  if (userIndex !== -1) {
    mockUsers[userIndex].password = newPassword;
  } else {
    throw new Error('用户不存在');
  }
  
  // 模拟成功响应
  return { success: true, message: '密码重置成功' };
};