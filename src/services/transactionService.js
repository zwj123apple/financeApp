// 交易记录服务
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟交易记录
let mockTransactions = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    productName: '稳健理财90天',
    type: '买入',
    amount: 5000,
    date: '2023-05-15',
    time: '14:30:25',
    status: '已完成',
    transactionCode: 'TX20230515143025',
    fee: 15.50,
    purchasePrice: 1.0520,
    quantity: 4752.85,
    paymentMethod: '银行卡',
    bankAccount: '****6789',
    remark: '定期理财产品，期限90天',
    riskLevel: '低风险',
    expectedReturn: '4.5%',
    maturityDate: '2023-08-13'
  },
  {
    id: 2,
    userId: 1,
    productId: 2,
    productName: '成长优选180天',
    type: '买入',
    amount: 10000,
    date: '2023-04-10',
    time: '09:15:42',
    status: '已完成',
    transactionCode: 'TX20230410091542',
    fee: 25.00,
    purchasePrice: 1.1250,
    quantity: 8888.89,
    paymentMethod: '支付宝',
    accountInfo: '152****8901',
    remark: '中等风险理财产品，期限180天',
    riskLevel: '中风险',
    expectedReturn: '5.8%',
    maturityDate: '2023-10-07'
  },
  {
    id: 3,
    userId: 1,
    productId: 3,
    productName: '进取增利365天',
    type: '买入',
    amount: 15000,
    date: '2023-03-20',
    time: '16:05:33',
    status: '已完成',
    transactionCode: 'TX20230320160533',
    fee: 37.50,
    purchasePrice: 1.2150,
    quantity: 12345.68,
    paymentMethod: '微信支付',
    accountInfo: '微信账户',
    remark: '高收益理财产品，期限365天',
    riskLevel: '中高风险',
    expectedReturn: '7.2%',
    maturityDate: '2024-03-19'
  },
  {
    id: 4,
    userId: 1,
    productId: 3,
    productName: '进取增利365天',
    type: '卖出',
    amount: 15000,
    date: '2023-06-05',
    time: '10:22:18',
    status: '已完成',
    transactionCode: 'TX20230605102218',
    fee: 45.00,
    sellPrice: 1.2350,
    quantity: 12345.68,
    redemptionMethod: '银行卡',
    bankAccount: '****6789',
    remark: '提前赎回，收益已结算',
    actualReturn: '2.8%',
    settlementDate: '2023-06-07'
  },
  {
    id: 5,
    userId: 1,
    productId: 1,
    productName: '稳健理财90天',
    type: '买入',
    amount: 3000,
    date: '2023-01-12',
    time: '11:45:50',
    status: '已完成',
    transactionCode: 'TX20230112114550',
    fee: 9.00,
    purchasePrice: 1.0420,
    quantity: 2879.08,
    paymentMethod: '银行卡',
    bankAccount: '****6789',
    remark: '定期理财产品，期限90天',
    riskLevel: '低风险',
    expectedReturn: '4.3%',
    maturityDate: '2023-04-12'
  },
  {
    id: 6,
    userId: 1,
    productId: 2,
    productName: '成长优选180天',
    type: '卖出',
    amount: 8000,
    date: '2023-01-25',
    time: '15:30:10',
    status: '已完成',
    transactionCode: 'TX20230125153010',
    fee: 20.00,
    sellPrice: 1.1350,
    quantity: 7048.46,
    redemptionMethod: '银行卡',
    bankAccount: '****6789',
    remark: '到期自动赎回',
    actualReturn: '5.6%',
    settlementDate: '2023-01-27'
  },
  {
    id: 7,
    userId: 1,
    productId: 4,
    productName: '创新科技基金',
    type: '买入',
    amount: 12000,
    date: '2023-02-08',
    time: '13:25:40',
    status: '已完成',
    transactionCode: 'TX20230208132540',
    fee: 36.00,
    purchasePrice: 1.5680,
    quantity: 7652.42,
    paymentMethod: '支付宝',
    accountInfo: '152****8901',
    remark: '股票型基金，重点投资科技行业',
    riskLevel: '高风险',
    expectedReturn: '不固定',
    fundManager: '张明'  
  },
  {
    id: 8,
    userId: 1,
    productId: 1,
    productName: '稳健理财90天',
    type: '卖出',
    amount: 3000,
    date: '2023-02-18',
    time: '09:50:15',
    status: '已完成',
    transactionCode: 'TX20230218095015',
    fee: 9.00,
    sellPrice: 1.0480,
    quantity: 2862.60,
    redemptionMethod: '银行卡',
    bankAccount: '****6789',
    remark: '提前赎回，收益已结算',
    actualReturn: '2.1%',
    settlementDate: '2023-02-20'
  },
  {
    id: 9,
    userId: 1,
    productId: 4,
    productName: '创新科技基金',
    type: '买入',
    amount: 5000,
    date: '2023-06-22',
    time: '14:05:30',
    status: '已完成',
    transactionCode: 'TX20230622140530',
    fee: 15.00,
    purchasePrice: 1.6250,
    quantity: 3076.92,
    paymentMethod: '微信支付',
    accountInfo: '微信账户',
    remark: '定投计划第一期',
    riskLevel: '高风险',
    expectedReturn: '不固定',
    fundManager: '张明'
  }
];

// 获取用户交易记录
export const getUserTransactions = async (userId, filters = {}) => {
  // 模拟API请求 - 减少延迟时间从800ms到300ms
  await delay(300);
  
  let transactions = mockTransactions.filter(t => t.userId === userId);
  
  // 应用筛选条件
  if (filters.type) {
    transactions = transactions.filter(t => t.type === filters.type);
  }
  
  if (filters.startDate) {
    transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.startDate));
  }
  
  if (filters.endDate) {
    transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.endDate));
  }
  
  if (filters.productId) {
    transactions = transactions.filter(t => t.productId === parseInt(filters.productId));
  }
  
  // 按日期排序（从新到旧）
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return transactions;
};

// 添加交易记录
export const addTransaction = (transaction) => {
  const newTransaction = {
    id: mockTransactions.length + 1,
    ...transaction,
    date: transaction.date || new Date().toISOString().split('T')[0],
    status: transaction.status || '已完成'
  };
  
  mockTransactions.push(newTransaction);
  return newTransaction;
};

// 获取交易记录统计
export const getTransactionStats = async (userId) => {
  // 模拟API请求
  await delay(600);
  
  const transactions = await getUserTransactions(userId);
  
  // 确保生成完整的月度数据（从1月到当前月份）
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // 初始化所有月份的数据（从1月到当前月份）
  const transactionsByMonth = {};
  for (let month = 1; month <= currentMonth; month++) {
    const monthStr = `${currentYear}-${month.toString().padStart(2, '0')}`;
    transactionsByMonth[monthStr] = 0;
  }
  
  // 统计实际交易数据
  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // 获取YYYY-MM格式
    if (transactionsByMonth[month] !== undefined) {
      transactionsByMonth[month] += 1;
    }
  });
  
  // 转换为图表数据格式
  const transactionFrequency = Object.entries(transactionsByMonth).map(([month, count]) => ({
    month,
    count
  })).sort((a, b) => a.month.localeCompare(b.month));
  
  // 交易类型统计
  const buyTransactions = transactions.filter(t => t.type === '买入').length;
  const sellTransactions = transactions.filter(t => t.type === '卖出').length;
  const totalTransactions = transactions.length;
  
  return {
    transactionFrequency,
    transactionTypes: {
      buy: {
        count: buyTransactions,
        percentage: totalTransactions > 0 ? (buyTransactions / totalTransactions * 100).toFixed(2) + '%' : '0%'
      },
      sell: {
        count: sellTransactions,
        percentage: totalTransactions > 0 ? (sellTransactions / totalTransactions * 100).toFixed(2) + '%' : '0%'
      },
      total: totalTransactions
    }
  };
};