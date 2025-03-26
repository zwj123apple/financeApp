// 资产服务
import { get, post, put, del } from '../utils/http';
import { getUserHoldings, getUserAssetSummary } from './productService';
import { getUserTransactions } from './transactionService';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟资产分配建议
const mockAssetAllocationSuggestions = {
  conservative: {
    name: '保守型',
    description: '适合风险承受能力较低的投资者，追求资金安全性和稳定收益。',
    allocation: [
      { category: '货币基金', percentage: 30, color: '#4CAF50' },
      { category: '债券型基金', percentage: 40, color: '#2196F3' },
      { category: '稳健理财产品', percentage: 20, color: '#FFC107' },
      { category: '股票型基金', percentage: 10, color: '#F44336' }
    ]
  },
  moderate: {
    name: '稳健型',
    description: '适合风险承受能力中等的投资者，追求资金增值和一定的收益。',
    allocation: [
      { category: '货币基金', percentage: 20, color: '#4CAF50' },
      { category: '债券型基金', percentage: 30, color: '#2196F3' },
      { category: '混合型基金', percentage: 30, color: '#FFC107' },
      { category: '股票型基金', percentage: 20, color: '#F44336' }
    ]
  },
  aggressive: {
    name: '进取型',
    description: '适合风险承受能力较高的投资者，追求较高收益和资产增值。',
    allocation: [
      { category: '货币基金', percentage: 10, color: '#4CAF50' },
      { category: '债券型基金', percentage: 20, color: '#2196F3' },
      { category: '混合型基金', percentage: 30, color: '#FFC107' },
      { category: '股票型基金', percentage: 40, color: '#F44336' }
    ]
  }
};

// 模拟收益走势数据
const generateMockProfitTrend = (userId, months = 6) => {
  const trend = [];
  const now = new Date();
  let currentValue = 10000; // 初始值
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - i);
    const monthStr = date.toISOString().substring(0, 7); // YYYY-MM 格式
    
    // 随机波动，-2%到+5%之间
    const change = (Math.random() * 7 - 2) / 100;
    currentValue = currentValue * (1 + change);
    
    trend.push({
      date: monthStr,
      value: Math.round(currentValue * 100) / 100
    });
  }
  
  return trend;
};

// 获取用户资产概览
export const getUserAssetOverview = async (userId) => {
  // 模拟API请求 - 减少延迟时间从800ms到300ms
  await delay(300);
  
  // 获取用户资产汇总
  const assetSummary = await getUserAssetSummary(userId);
  
  // 生成收益走势数据
  const profitTrend = generateMockProfitTrend(userId);
  
  return {
    ...assetSummary,
    profitTrend
  };
};

// 获取资产配置建议
export const getAssetAllocationSuggestion = async (riskPreference = 'moderate') => {
  // 模拟API请求 - 减少延迟时间从600ms到200ms
  await delay(200);
  
  const suggestion = mockAssetAllocationSuggestions[riskPreference] || mockAssetAllocationSuggestions.moderate;
  
  return suggestion;
};

// 获取用户资产分析
export const getUserAssetAnalysis = async (userId) => {
  // 模拟API请求 - 减少延迟时间从1000ms到300ms
  await delay(300);
  
  // 获取用户资产汇总
  const assetSummary = await getUserAssetSummary(userId);
  
  // 获取用户交易记录
  const transactions = await getUserTransactions(userId);
  
  // 导入月度收益数据服务
  const { getMonthlyProfitData } = await import('./assetAnalysisService');
  
  // 计算月度交易频率
  const transactionsByMonth = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM 格式
    if (!transactionsByMonth[month]) {
      transactionsByMonth[month] = 0;
    }
    transactionsByMonth[month] += 1;
  });
  
  // 转换为数组格式
  const transactionFrequency = Object.entries(transactionsByMonth).map(([month, count]) => ({
    month,
    count
  }));
  
  // 按月份排序
  transactionFrequency.sort((a, b) => a.month.localeCompare(b.month));
  
  // 计算买入/卖出比例
  const buyTransactions = transactions.filter(t => t.type === '买入').length;
  const sellTransactions = transactions.filter(t => t.type === '卖出').length;
  const totalTransactions = transactions.length;
  
  const transactionRatio = {
    buy: {
      count: buyTransactions,
      percentage: totalTransactions > 0 ? (buyTransactions / totalTransactions * 100).toFixed(2) + '%' : '0%'
    },
    sell: {
      count: sellTransactions,
      percentage: totalTransactions > 0 ? (sellTransactions / totalTransactions * 100).toFixed(2) + '%' : '0%'
    }
  };
  
  // 获取资产配置建议（基于当前资产分布）
  let riskPreference = 'moderate';
  const lowRiskPercentage = assetSummary.riskLevelDistribution
    .filter(item => item.riskLevel === '低风险')
    .reduce((sum, item) => sum + parseFloat(item.percentage), 0);
  
  if (lowRiskPercentage >= 60) {
    riskPreference = 'conservative';
  } else if (lowRiskPercentage <= 30) {
    riskPreference = 'aggressive';
  }
  
  const allocationSuggestion = await getAssetAllocationSuggestion(riskPreference);
  
  // 获取月度收益数据
  let monthlyProfit = [];
  try {
    const monthlyProfitResult = await getMonthlyProfitData(userId);
    if (monthlyProfitResult && monthlyProfitResult.success) {
      monthlyProfit = monthlyProfitResult.monthlyProfit || [];
      console.log(`获取到${monthlyProfit.length}个月度收益数据点`);
    } else {
      console.warn('月度收益数据获取结果无效或不成功');
    }
  } catch (error) {
    console.error('获取月度收益数据失败:', error);
  }
  
  // 无论是否成功获取月度收益数据，都返回完整的资产分析对象
  return {
    assetSummary,
    transactionFrequency,
    transactionRatio,
    allocationSuggestion,
    monthlyProfit
  };
};