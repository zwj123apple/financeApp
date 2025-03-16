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
    status: '已完成'
  },
  {
    id: 2,
    userId: 1,
    productId: 2,
    productName: '成长优选180天',
    type: '买入',
    amount: 10000,
    date: '2023-04-10',
    status: '已完成'
  },
  {
    id: 3,
    userId: 1,
    productId: 3,
    productName: '进取增利365天',
    type: '买入',
    amount: 15000,
    date: '2023-03-20',
    status: '已完成'
  },
  {
    id: 4,
    userId: 1,
    productId: 3,
    productName: '进取增利365天',
    type: '卖出',
    amount: 15000,
    date: '2023-06-05',
    status: '已完成'
  }
];

// 获取用户交易记录
export const getUserTransactions = async (userId, filters = {}) => {
  // 模拟API请求
  await delay(800);
  
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
  
  // 按月份分组交易
  const transactionsByMonth = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // 获取YYYY-MM格式
    if (!transactionsByMonth[month]) {
      transactionsByMonth[month] = 0;
    }
    transactionsByMonth[month] += 1;
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