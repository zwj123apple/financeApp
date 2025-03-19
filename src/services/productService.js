// 产品服务
import { get, post, put, del } from '../utils/http';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟产品数据
const mockProducts = [
  {
    id: 1,
    name: '稳健理财90天',
    riskLevel: '低风险',
    expectedReturn: '3.8%',
    investmentTerm: '90天',
    minInvestment: 1000,
    description: '本产品为低风险稳健型理财产品，投资于国债、金融债等固定收益类资产，适合追求稳定收益的投资者。',
    assets: '国债、金融债、企业债',
    fees: '管理费: 0.2%/年, 认购费: 0%',
    historicalReturns: [
      { date: '2023-01', value: 3.7 },
      { date: '2023-02', value: 3.8 },
      { date: '2023-03', value: 3.9 },
      { date: '2023-04', value: 3.8 },
      { date: '2023-05', value: 3.7 },
      { date: '2023-06', value: 3.8 }
    ]
  },
  {
    id: 2,
    name: '成长优选180天',
    riskLevel: '中风险',
    expectedReturn: '5.2%',
    investmentTerm: '180天',
    minInvestment: 5000,
    description: '本产品为中等风险理财产品，投资于优质债券和部分权益类资产，适合风险承受能力适中的投资者。',
    assets: '优质债券、蓝筹股票、结构性存款',
    fees: '管理费: 0.5%/年, 认购费: 0.2%',
    historicalReturns: [
      { date: '2023-01', value: 5.0 },
      { date: '2023-02', value: 5.3 },
      { date: '2023-03', value: 5.5 },
      { date: '2023-04', value: 5.2 },
      { date: '2023-05', value: 5.1 },
      { date: '2023-06', value: 5.4 }
    ]
  },
  {
    id: 3,
    name: '进取增利365天',
    riskLevel: '高风险',
    expectedReturn: '7.5%',
    investmentTerm: '365天',
    minInvestment: 10000,
    description: '本产品为中高风险理财产品，投资于多元化资产组合，包括股票、债券和另类投资，适合风险承受能力较强的投资者。',
    assets: '股票、债券、商品、REITs',
    fees: '管理费: 0.8%/年, 认购费: 0.5%',
    historicalReturns: [
      { date: '2023-01', value: 7.2 },
      { date: '2023-02', value: 7.8 },
      { date: '2023-03', value: 7.6 },
      { date: '2023-04', value: 7.3 },
      { date: '2023-05', value: 7.7 },
      { date: '2023-06', value: 7.5 }
    ]
  },
  {
    id: 4,
    name: '创新科技基金',
    riskLevel: '高风险',
    expectedReturn: '12.0%',
    investmentTerm: '365天',
    minInvestment: 20000,
    description: '本产品为高风险理财产品，主要投资于科技创新领域的股票和私募股权，适合风险承受能力强的投资者。',
    assets: '科技股、创新企业股权、高收益债券',
    fees: '管理费: 1.5%/年, 认购费: 1.0%',
    historicalReturns: [
      { date: '2023-01', value: 11.5 },
      { date: '2023-02', value: 13.2 },
      { date: '2023-03', value: 12.8 },
      { date: '2023-04', value: 11.9 },
      { date: '2023-05', value: 12.5 },
      { date: '2023-06', value: 12.2 }
    ]
  }
];

// 模拟用户持仓数据
let mockHoldings = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    productName: '稳健理财90天',
    amount: 5000,
    purchaseDate: '2023-05-15',
    expiryDate: '2023-08-13',
    currentValue: 5047.5,
    profit: 47.5,
    profitRate: '0.95%'
  },
  {
    id: 2,
    userId: 1,
    productId: 2,
    productName: '成长优选180天',
    amount: 10000,
    purchaseDate: '2023-04-10',
    expiryDate: '2023-10-07',
    currentValue: 10260,
    profit: 260,
    profitRate: '2.6%'
  }
];



// 获取产品列表
export const getProducts = async (filters = {}) => {
  // 模拟API请求
  await delay(800);
  
  let filteredProducts = [...mockProducts];
  
  // 应用筛选条件
  if (filters.riskLevel) {
    filteredProducts = filteredProducts.filter(p => p.riskLevel === filters.riskLevel);
  }
  
  if (filters.minReturn) {
    filteredProducts = filteredProducts.filter(p => {
      const returnRate = parseFloat(p.expectedReturn);
      return returnRate >= parseFloat(filters.minReturn);
    });
  }
  
  if (filters.maxTerm) {
    filteredProducts = filteredProducts.filter(p => {
      const term = parseInt(p.investmentTerm);
      return term <= parseInt(filters.maxTerm);
    });
  }
  
  return filteredProducts;
};

// 获取产品详情
export const getProductById = async (productId) => {
  // 模拟API请求
  await delay(600);
  
  const product = mockProducts.find(p => p.id === parseInt(productId));
  
  if (!product) {
    throw new Error('产品不存在');
  }
  
  return product;
};

// 模拟购买产品
export const purchaseProduct = async (purchaseData) => {
  // 模拟API请求
  await delay(1200);
  
  const { userId, productId, amount } = purchaseData;
  
  // 验证产品是否存在
  const product = mockProducts.find(p => p.id === parseInt(productId));
  if (!product) {
    throw new Error('产品不存在');
  }
  
  // 验证购买金额是否满足最低要求
  if (amount < product.minInvestment) {
    throw new Error(`购买金额不能低于最低起购金额${product.minInvestment}元`);
  }
  
  // 创建新的持仓记录
  const purchaseDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(product.investmentTerm));
  
  // 计算预期收益
  const expectedReturnRate = parseFloat(product.expectedReturn) / 100;
  const expectedProfit = amount * expectedReturnRate * (parseInt(product.investmentTerm) / 365);
  
  const newHolding = {
    id: mockHoldings.length + 1,
    userId,
    productId,
    productName: product.name,
    amount,
    purchaseDate: purchaseDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    currentValue: amount,
    profit: 0,
    profitRate: '0%'
  };
  
  mockHoldings.push(newHolding);
  
  // 创建交易记录
  const { addTransaction } = require('./transactionService');
  const newTransaction = addTransaction({
    userId,
    productId,
    productName: product.name,
    type: '买入',
    amount,
    date: purchaseDate.toISOString().split('T')[0],
    status: '已完成'
  });
  
  return {
    success: true,
    holding: newHolding,
    transaction: newTransaction,
    message: '购买成功'
  };
};

// 模拟卖出产品
export const sellProduct = async (sellData) => {
  // 模拟API请求
  await delay(1000);
  
  const { userId, holdingId, amount } = sellData;
  
  // 查找持仓记录
  const holdingIndex = mockHoldings.findIndex(h => h.id === parseInt(holdingId) && h.userId === userId);
  
  if (holdingIndex === -1) {
    throw new Error('持仓记录不存在');
  }
  
  const holding = mockHoldings[holdingIndex];
  
  // 验证卖出金额
  if (amount > holding.amount) {
    throw new Error('卖出金额不能大于持仓金额');
  }
  
  // 创建交易记录
  const sellDate = new Date();
  const { addTransaction } = require('./transactionService');
  const newTransaction = addTransaction({
    userId,
    productId: holding.productId,
    productName: holding.productName,
    type: '卖出',
    amount,
    date: sellDate.toISOString().split('T')[0],
    status: '已完成'
  });
  
  // 更新或删除持仓记录
  if (amount === holding.amount) {
    // 全部卖出，删除持仓
    mockHoldings = mockHoldings.filter(h => h.id !== holding.id);
  } else {
    // 部分卖出，更新持仓
    const remainingAmount = holding.amount - amount;
    const remainingRatio = remainingAmount / holding.amount;
    
    mockHoldings[holdingIndex] = {
      ...holding,
      amount: remainingAmount,
      currentValue: holding.currentValue * remainingRatio,
      profit: holding.profit * remainingRatio
    };
  }
  
  return {
    success: true,
    transaction: newTransaction,
    message: '卖出成功'
  };
};

// 获取用户持仓列表
export const getUserHoldings = async (userId) => {
  // 模拟API请求
  await delay(700);
  
  const holdings = mockHoldings.filter(h => h.userId === userId);
  
  return holdings;
};



// 获取用户资产汇总
export const getUserAssetSummary = async (userId) => {
  // 模拟API请求 - 减少延迟时间从900ms到300ms
  await delay(300);
  
  // 获取用户持仓
  const holdings = await getUserHoldings(userId);
  
  // 计算总资产和各类资产占比
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalInvestment = holdings.reduce((sum, holding) => sum + holding.amount, 0);
  const totalProfit = holdings.reduce((sum, holding) => sum + holding.profit, 0);
  
  // 按风险等级分类资产
  const assetsByRiskLevel = {};
  
  for (const holding of holdings) {
    const product = mockProducts.find(p => p.id === holding.productId);
    if (product) {
      if (!assetsByRiskLevel[product.riskLevel]) {
        assetsByRiskLevel[product.riskLevel] = 0;
      }
      assetsByRiskLevel[product.riskLevel] += holding.currentValue;
    }
  }
  
  // 计算风险等级占比
  const riskLevelDistribution = Object.entries(assetsByRiskLevel).map(([riskLevel, value]) => ({
    riskLevel,
    value,
    percentage: ((value / totalValue) * 100).toFixed(2) + '%'
  }));
  
  // 计算总收益率
  const totalProfitRate = totalInvestment > 0 ? 
    ((totalProfit / totalInvestment) * 100).toFixed(2) + '%' : 
    '0%';
  
  return {
    totalValue,
    totalInvestment,
    totalProfit,
    totalProfitRate,
    holdingsCount: holdings.length,
    riskLevelDistribution,
    holdings
  };
};