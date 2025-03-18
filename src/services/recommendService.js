// 热门推荐服务
import { get, post, put, del } from '../utils/http';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟热门推荐产品数据 - 固定2个产品
const mockRecommendedProducts = [
  {
    id: 1,
    name: '稳健理财90天',
    riskLevel: '低风险',
    expectedReturn: '3.8%',
    investmentTerm: '90天',
    minInvestment: 1000,
    description: '本产品为低风险稳健型理财产品，投资于国债、金融债等固定收益类资产，适合追求稳定收益的投资者。',
    isHot: true,
    tags: ['新手推荐', '低风险']
  },
  {
    id: 3,
    name: '进取增利365天',
    riskLevel: '高风险',
    expectedReturn: '7.5%',
    investmentTerm: '365天',
    minInvestment: 10000,
    description: '本产品为中高风险理财产品，投资于多元化资产组合，包括股票、债券和另类投资，适合风险承受能力较强的投资者。',
    isHot: true,
    tags: ['高收益', '长期投资']
  }
];

// 获取热门推荐产品
export const getRecommendedProducts = async () => {
  // 模拟API请求
  await delay(600);
  
  return {
    success: true,
    message: '获取热门推荐产品成功',
    products: mockRecommendedProducts
  };
};