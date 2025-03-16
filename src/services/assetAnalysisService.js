// 资产分析服务
import { get, post, put, del } from '../utils/http';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 生成模拟月度收益数据
const generateMockMonthlyProfit = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const profits = [];
  
  // 生成随机收益数据
  for (let i = 0; i < months.length; i++) {
    // 随机生成-500到1000之间的收益
    const profit = Math.floor(Math.random() * 1500) - 500;
    profits.push({
      month: months[i],
      profit: profit
    });
  }
  
  return profits;
};

// 获取月度收益数据
export const getMonthlyProfitData = async (userId) => {
  // 模拟API请求
  await delay(800);
  
  const monthlyProfit = generateMockMonthlyProfit();
  
  return {
    success: true,
    message: '获取月度收益数据成功',
    monthlyProfit
  };
};