/**
 * 应用主题配置文件
 * 用于统一管理应用的样式和配色方案
 */

import { Dimensions } from 'react-native';

// 主题颜色 - 更新为更现代的配色方案
export const COLORS = {
  // 主色调
  primary: '#2563EB',           // 更鲜明的蓝色
  primaryLight: '#60A5FA',      // 浅蓝色
  primaryDark: '#1D4ED8',       // 深蓝色
  
  // 辅助色
  secondary: '#8B5CF6',         // 紫色
  secondaryLight: '#A78BFA',    // 浅紫色
  secondaryDark: '#7C3AED',     // 深紫色
  
  // 强调色
  accent: '#F59E0B',            // 橙色
  accentLight: '#FBBF24',       // 浅橙色
  accentDark: '#D97706',        // 深橙色
  
  // 背景色
  background: '#FFFFFF',        // 白色背景
  backgroundLight: '#F9FAFB',   // 浅灰背景
  backgroundDark: '#F3F4F6',    // 深灰背景
  backgroundGradientStart: '#F9FAFB',  // 渐变开始
  backgroundGradientEnd: '#EFF6FF',    // 渐变结束
  
  // 文本色
  text: '#1F2937',              // 主文本色
  textLight: '#6B7280',         // 次要文本
  textDark: '#111827',          // 强调文本
  textMuted: '#9CA3AF',         // 弱化文本
  placeholder: '#CCCCCC',       // 输入框占位符颜色
  
  // 边框色
  border: '#E5E7EB',            // 标准边框
  borderLight: '#F3F4F6',       // 浅色边框
  borderDark: '#D1D5DB',        // 深色边框
  
  // 状态色
  success: '#10B981',           // 成功
  warning: '#F59E0B',           // 警告
  error: '#EF4444',             // 错误
  info: '#3B82F6',              // 信息
  
  // 基础色
  white: '#FFFFFF',             // 白色
  black: '#000000',             // 黑色
  transparent: 'transparent',    // 透明
  overlay: 'rgba(0, 0, 0, 0.5)', // 遮罩
  
  // 卡片色
  cardBackground: '#FFFFFF',    // 卡片背景
  cardShadow: '#000000',        // 卡片阴影
  
  // 图表色
  chart: [
    '#3B82F6', // 蓝色
    '#10B981', // 绿色
    '#F59E0B', // 橙色
    '#8B5CF6', // 紫色
    '#EC4899', // 粉色
    '#14B8A6', // 青色
    '#F43F5E', // 红色
    '#6366F1'  // 靛蓝色
  ]
};

// 根据屏幕尺寸计算响应式尺寸的辅助函数
export const getResponsiveSize = (smallSize, mediumSize, largeSize) => {
  const { width } = Dimensions.get('window');
  if (width < 380) return smallSize;
  if (width < 768) return mediumSize;
  return largeSize;
};

// 响应式字体大小
export const FONT_SIZES = {
  xs: getResponsiveSize(10, 12, 14),
  sm: getResponsiveSize(12, 14, 16),
  md: getResponsiveSize(14, 16, 18),
  lg: getResponsiveSize(16, 18, 20),
  xl: getResponsiveSize(18, 20, 22),
  xxl: getResponsiveSize(20, 24, 28),
  xxxl: getResponsiveSize(24, 28, 32)
};

// 字体权重
export const FONT_WEIGHTS = {
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800'
};

// 响应式间距
export const SPACING = {
  xxs: getResponsiveSize(2, 4, 6),
  xs: getResponsiveSize(4, 6, 8),
  sm: getResponsiveSize(8, 10, 12),
  md: getResponsiveSize(12, 16, 20),
  lg: getResponsiveSize(16, 20, 24),
  xl: getResponsiveSize(20, 24, 32),
  xxl: getResponsiveSize(24, 32, 40),
  xxxl: getResponsiveSize(32, 40, 48)
};

// 边框圆角
export const BORDER_RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
  full: 9999
};

// 阴影样式
export const SHADOWS = {
  none: {
    boxShadow: 'none',
    elevation: 0
  },
  xs: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1
  },
  sm: {
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2
  },
  md: {
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.15)',
    elevation: 4
  },
  lg: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 6
  },
  xl: {
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.25)',
    elevation: 9
  }
};

// 常用渐变
export const GRADIENTS = {
  primary: ['#2563EB', '#60A5FA'],
  secondary: ['#7C3AED', '#A78BFA'],
  accent: ['#D97706', '#FBBF24'],
  success: ['#059669', '#34D399'],
  error: ['#DC2626', '#F87171'],
  background: ['#F9FAFB', '#EFF6FF'],
  card: ['#FFFFFF', '#F9FAFB']
};

// 常用动画时间
export const ANIMATION = {
  fast: 300,
  normal: 500,
  slow: 700
};

// 常用布局样式
export const LAYOUT = {
  // 卡片样式
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md
  },
  // 输入框样式
  input: {
    height: 50,
    borderWidth: 0.5,
    borderColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingLeft: SPACING.lg, // 增加左侧内边距，确保文字与左边框有足够距离
    marginBottom: SPACING.sm,
    // 添加输入框焦点状态样式
    outlineStyle: 'none',
    outlineWidth: 0
  },
  // 按钮样式
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.sm,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      borderRadius: BORDER_RADIUS.sm,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.sm,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md
    }
  },
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md
  },
  // 列表项样式
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  }
};

// 导出默认主题
export default {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
  ANIMATION,
  LAYOUT,
  getResponsiveSize
};