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
  // 减少模拟API延迟时间，从800ms减少到300ms
  await delay(300);
  
  const monthlyProfit = generateMockMonthlyProfit();
  
  return {
    success: true,
    message: '获取月度收益数据成功',
    monthlyProfit
  };
};

// 生成模拟资产详细数据
const generateMockAssetDetailData = (period, type) => {
  // 模拟总金额
  const totalAmount = type === 'income' 
    ? Math.floor(Math.random() * 10000) + 5000 
    : Math.floor(Math.random() * 8000) + 2000;
  
  // 模拟同比增长率 (-20% 到 30%)
  const comparePercentage = Math.floor(Math.random() * 50) - 20;
  
  // 模拟类别数据
  const categories = type === 'income' 
    ? ['工资', '奖金', '投资收益', '副业', '其他收入'] 
    : ['餐饮', '购物', '交通', '住房', '娱乐', '医疗'];
  
  const categoryData = [];
  let remainingAmount = totalAmount;
  
  // 为每个类别分配金额
  for (let i = 0; i < categories.length - 1; i++) {
    // 为当前类别分配剩余金额的一部分
    const amount = Math.floor(remainingAmount * (Math.random() * 0.4 + 0.1));
    remainingAmount -= amount;
    
    categoryData.push({
      category: categories[i],
      amount: amount
    });
  }
  
  // 最后一个类别获得剩余全部金额
  categoryData.push({
    category: categories[categories.length - 1],
    amount: remainingAmount
  });
  
  // 模拟趋势数据
  const trendData = [];
  const months = period === 'month' 
    ? ['1日', '5日', '10日', '15日', '20日', '25日', '30日']
    : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  let currentValue = type === 'income' ? 1000 : 800;
  
  for (let i = 0; i < months.length; i++) {
    // 随机波动 (-20% 到 20%)
    const change = currentValue * (Math.random() * 0.4 - 0.2);
    currentValue += change;
    
    trendData.push({
      date: months[i],
      amount: Math.max(0, Math.floor(currentValue))
    });
  }
  
  // 模拟时间筛选器
  const timeFilters = period === 'month' 
    ? [
        { label: '本月', active: true },
        { label: '上月', active: false },
        { label: '近3月', active: false },
        { label: '近6月', active: false }
      ]
    : [
        { label: '本年', active: true },
        { label: '去年', active: false },
        { label: '近3年', active: false },
        { label: '近5年', active: false }
      ];
  
  return {
    totalAmount,
    comparePercentage,
    categoryData,
    trendData,
    timeFilters
  };
};

// 获取资产详细数据
export const getAssetDetailData = async (userId, period, type) => {
  // 模拟API延迟
  await delay(500);
  
  const data = generateMockAssetDetailData(period, type);
  
  return {
    success: true,
    message: '获取资产详细数据成功',
    data
  };
};