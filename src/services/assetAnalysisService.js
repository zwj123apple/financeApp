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
        { label: '本月', value: 'current', active: true },
        { label: '上月', value: 'last', active: false },
        { label: '近3月', value: 'last3', active: false },
        { label: '近6月', value: 'last6', active: false }
      ]
    : [
        { label: '本年', value: 'current', active: true },
        { label: '去年', value: 'last', active: false },
        { label: '近3年', value: 'last3', active: false },
        { label: '近5年', value: 'last5', active: false }
      ];
  
  // 添加时间筛选变化时的回调函数
  const onTimeFilterChange = (index, value) => {
    console.log(`时间筛选变化: 索引=${index}, 值=${value}`);
    
    // 在实际应用中，这里应该根据选择的时间筛选器重新获取数据
    // 这里我们只是模拟数据变化
    
    // 模拟不同时间段的数据变化
    let multiplier = 1.0;
    switch(value) {
      case 'last':
        multiplier = 0.8; // 上月/去年数据略少
        break;
      case 'last3':
        multiplier = 1.2; // 近3月/近3年数据略多
        break;
      case 'last6':
      case 'last5':
        multiplier = 1.5; // 近6月/近5年数据更多
        break;
      default:
        multiplier = 1.0; // 默认本月/本年
    }
    
    // 更新时间筛选器状态
    for (let i = 0; i < timeFilters.length; i++) {
      timeFilters[i].active = (i === index);
    }
    
    // 更新类别数据
    for (let i = 0; i < categoryData.length; i++) {
      // 在原始值基础上应用乘数，并添加一些随机波动
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 到 1.2 之间的随机数
      categoryData[i].amount = Math.floor(categoryData[i].amount * multiplier * randomFactor);
    }
    
    // 更新趋势数据
    for (let i = 0; i < trendData.length; i++) {
      // 在原始值基础上应用乘数，并添加一些随机波动
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 到 1.1 之间的随机数
      trendData[i].amount = Math.floor(trendData[i].amount * multiplier * randomFactor);
    }
    
    // 更新总金额
    const newTotalAmount = Math.floor(totalAmount * multiplier * (0.95 + Math.random() * 0.1));
    
    // 更新同比增长率
    const newComparePercentage = comparePercentage * (0.8 + Math.random() * 0.4);
    
    // 返回更新后的数据
    return {
      totalAmount: newTotalAmount,
      comparePercentage: newComparePercentage,
      categoryData,
      trendData,
      timeFilters
    };
  };
  
  return {
    totalAmount,
    comparePercentage,
    categoryData,
    trendData,
    timeFilters,
    onTimeFilterChange
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