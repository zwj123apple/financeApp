import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Divider, Tab } from '@rneui/themed';
import { LineChart, PieChart, BarChart } from './charts';
import { ErrorBoundary } from './';

/**
 * 通用的财务分析视图组件
 * @param {Object} props 组件属性
 * @param {number} props.periodIndex - 当前选择的周期索引（0: 月度, 1: 年度）
 * @param {number} props.typeIndex - 当前选择的类型索引（0: 收入, 1: 支出）
 * @param {Function} props.setTypeIndex - 设置类型索引的函数
 * @param {Object} props.assetDetailData - 资产详情数据
 * @param {number} props.assetDetailData.totalAmount - 总金额
 * @param {number} props.assetDetailData.comparePercentage - 同比百分比
 * @param {Array} props.assetDetailData.timeFilters - 时间筛选选项数组
 * @param {string} props.assetDetailData.timeFilters[].label - 时间筛选选项标签
 * @param {string|number} props.assetDetailData.timeFilters[].value - 时间筛选选项值
 * @param {Function} props.assetDetailData.onTimeFilterChange - 时间筛选变更回调函数 (index, value) => void
 * @param {Object} props.barChartData - 柱状图数据，格式为 {labels: string[], datasets: [{data: number[]}]}
 * @param {Object} props.pieChartData - 饼图数据，格式为 [{name: string, value: number, color: string}]
 * @param {Object} props.trendChartData - 趋势图数据，格式为 {labels: string[], datasets: [{data: number[], color: function, strokeWidth: number}]}
 * @param {boolean} props.isLoading - 是否正在加载
 */
const AnalysisView = (props) => {
  const {
    periodIndex,
    typeIndex,
    setTypeIndex,
    assetDetailData,
    barChartData,
    pieChartData,
    trendChartData,
    isLoading,
    onDataUpdate
  } = props;
  // 添加时间筛选状态
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(0);
  const { width, height } = useWindowDimensions();
  
  // 添加动画值
  const [fadeAnim] = useState(new Animated.Value(1));

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: Math.max(theme.SPACING.md, width * 0.05) }]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
    >
      {/* 收入/支出切换 - 现代分段控制器设计 */}
      <View style={[styles.segmentedControlContainer, { width: width * 0.9, maxWidth: 500 }]}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            typeIndex === 0 && styles.segmentButtonActive,
            { borderTopLeftRadius: theme.BORDER_RADIUS.md, borderBottomLeftRadius: theme.BORDER_RADIUS.md }
          ]}
          onPress={() => setTypeIndex(0)}
          activeOpacity={0.7}
        >
          <View style={styles.segmentContent}>
            <View style={styles.segmentIconContainer}>
              <LinearGradient
                colors={typeIndex === 0 ? theme.GRADIENTS.primary : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.segmentIcon, typeIndex === 0 && styles.segmentIconActive]}>↗</Text>
              </LinearGradient>
            </View>
            <Text style={[styles.segmentText, typeIndex === 0 && styles.segmentTextActive]}>收入</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.segmentButton,
            typeIndex === 1 && styles.segmentButtonActive,
            { borderTopRightRadius: theme.BORDER_RADIUS.md, borderBottomRightRadius: theme.BORDER_RADIUS.md }
          ]}
          onPress={() => setTypeIndex(1)}
          activeOpacity={0.7}
        >
          <View style={styles.segmentContent}>
            <View style={styles.segmentIconContainer}>
              <LinearGradient
                colors={typeIndex === 1 ? theme.GRADIENTS.error : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.segmentIcon, typeIndex === 1 && styles.segmentIconActive]}>↘</Text>
              </LinearGradient>
            </View>
            <Text style={[styles.segmentText, typeIndex === 1 && styles.segmentTextActive]}>支出</Text>
          </View>
        </TouchableOpacity>
        
        {/* 动画指示器 */}
        <Animated.View 
          style={[
            styles.segmentIndicator,
            { transform: [{ translateX: typeIndex === 0 ? 0 : '100%' }] }
          ]}
        />
      </View>
      
      {/* 金额显示区域和时间筛选区域的整合设计 */}
      <View style={[styles.combinedContainer, {
        width: width * 0.9,
        maxWidth: 500
      }]}>
        {/* 金额显示区域 */}
        <LinearGradient
          colors={typeIndex === 0 ? theme.GRADIENTS.success : theme.GRADIENTS.error}
          style={styles.amountGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.amountContent}>
            <View style={styles.amountTextContainer}>
              <Text style={styles.amountLabel}>
                {periodIndex === 0 ? '本月' : '本年'}{typeIndex === 0 ? '收入' : '支出'}
              </Text>
              <Text style={styles.amountValue}>
                ¥ {assetDetailData?.totalAmount?.toFixed(2) || '0.00'}
              </Text>
            </View>
            <Text style={styles.amountCompare}>
              较{periodIndex === 0 ? '上月' : '去年'}{assetDetailData?.comparePercentage > 0 ? '增长' : '减少'} {Math.abs(assetDetailData?.comparePercentage || 0).toFixed(2)}%
            </Text>
          </View>
        </LinearGradient>
        
        {/* 时间筛选区域 */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>时间筛选</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeFilterContainer}
          >
            {assetDetailData?.timeFilters?.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeFilterItem, 
                  selectedTimeFilter === index && styles.timeFilterItemActive
                ]}
                onPress={() => {
                  // 更新选中的时间筛选
                  setSelectedTimeFilter(index);
                  
                  // 显示加载状态
                  if (isLoading) return;
                  
                  // 创建动画效果
                  Animated.sequence([
                    Animated.timing(fadeAnim, {
                      toValue: 0.5,
                      duration: 200,
                      useNativeDriver: true
                    }),
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 300,
                      useNativeDriver: true
                    })
                  ]).start();
                  
                  // 调用外部传入的时间筛选变更回调并更新数据
                  if (assetDetailData?.onTimeFilterChange) {
                    // 获取更新后的数据并通知父组件
                    const updatedData = assetDetailData.onTimeFilterChange(index, filter.value);
                    
                    // 如果父组件提供了更新函数，则调用它更新数据
                    if (props.onDataUpdate) {
                      props.onDataUpdate(updatedData);
                    }
                  }
                }}
              >
                <Text style={[
                  styles.timeFilterText, 
                  selectedTimeFilter === index && styles.timeFilterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      {/* 柱状图 */}
      <View style={[styles.chartContainer, {
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <Text style={styles.chartTitle}>{typeIndex === 0 ? '收入' : '支出'}类别分布</Text>
        <Divider style={styles.divider} />
        <View style={styles.chartWrapper}>
          <ErrorBoundary 
            fallbackMessage="类别分布图表加载失败，请稍后再试" 
            onReset={() => console.log('重置类别分布图表')}
          >
            <BarChart
              data={barChartData}
              title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}类别统计`}
              height={Math.min(180, height * 0.25)}
              width={width * 0.85}
              yAxisSuffix="元"
              showValuesOnTopOfBars
            />
          </ErrorBoundary>
        </View>
        <Text style={styles.chartDescription}>
          展示您的{typeIndex === 0 ? '收入' : '支出'}在不同类别间的分布情况。
        </Text>
      </View>
      
      {/* 饼图 */}
      <View style={[styles.chartContainer, {
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <Text style={styles.chartTitle}>{typeIndex === 0 ? '收入' : '支出'}占比分析</Text>
        <Divider style={styles.divider} />
        <View style={styles.chartWrapper}>
          <ErrorBoundary 
            fallbackMessage="占比分析图表加载失败，请稍后再试" 
            onReset={() => console.log('重置占比分析图表')}
          >
            <PieChart
              data={pieChartData}
              title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}占比`}
              height={Math.min(220, height * 0.3)}
              width={width * 0.85}
              showLegend={true}
            />
          </ErrorBoundary>
        </View>
        <Text style={styles.chartDescription}>
          展示您的{typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}在不同类别间的占比情况。
        </Text>
      </View>
      
      {/* 趋势图 */}
      <View style={[styles.chartContainer, {
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <Text style={styles.chartTitle}>{typeIndex === 0 ? '收入' : '支出'}趋势分析</Text>
        <Divider style={styles.divider} />
        <View style={styles.chartWrapper}>
          <ErrorBoundary 
            fallbackMessage="趋势分析图表加载失败，请稍后再试" 
            onReset={() => console.log('重置趋势分析图表')}
          >
            <LineChart
              data={trendChartData}
              title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}趋势`}
              height={Math.min(180, height * 0.25)}
              width={width * 0.85}
              yAxisSuffix="元"
              bezier={true}
            />
          </ErrorBoundary>
        </View>
        <Text style={styles.chartDescription}>
          展示您的{typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}随时间变化的趋势。
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: theme.SPACING.xs,
    alignItems: 'center',
  },
  // 分段控制器样式
  segmentedControlContainer: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.backgroundLight,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.xs,
    position: 'relative',
    height: 48,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  segmentButtonActive: {
    backgroundColor: 'transparent',
  },
  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIconContainer: {
    marginRight: theme.SPACING.xxs,
  },
  iconBackground: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentIcon: {
    fontSize: 16,
    color: theme.COLORS.textLight,
  },
  segmentIconActive: {
    color: theme.COLORS.white,
  },
  segmentText: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.textLight,
  },
  segmentTextActive: {
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.semibold,
  },
  segmentIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    width: '48%',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.sm,
    ...theme.SHADOWS.xs,
    zIndex: 0,
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  // 旧的Tab容器样式保留作为参考
  innerTabContainer: {
    backgroundColor: theme.COLORS.white,
    marginVertical: theme.SPACING.sm, // 减小垂直外边距
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.xs,
    paddingVertical: theme.SPACING.xxs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.xs,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50, // 减小高度
    width: '100%', // 使Tab容器宽度铺满
  },
  combinedContainer: {
    marginVertical: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
  },
  amountContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountTextContainer: {
    flex: 1,
  },
  amountGradient: {
    padding: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    margin: theme.SPACING.xxs,
  },
  amountLabel: {
    color: theme.COLORS.white,
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
    marginBottom: theme.SPACING.xxs,
  },
  amountValue: {
    color: theme.COLORS.white,
    fontSize: theme.FONT_SIZES.xxl,
    fontWeight: theme.FONT_WEIGHTS.bold,
  },
  amountCompare: {
    color: theme.COLORS.white,
    fontSize: theme.FONT_SIZES.xs,
    fontWeight: theme.FONT_WEIGHTS.medium,
    opacity: 0.9,
    textAlign: 'right',
    marginLeft: theme.SPACING.sm,
  },
  filterSection: {
    padding: theme.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.borderLight,
  },
  filterTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.xs,
  },
  timeFilterContainer: {
    paddingVertical: theme.SPACING.xxs,
  },
  timeFilterItem: {
    paddingHorizontal: theme.SPACING.sm,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.backgroundLight,
    marginRight: theme.SPACING.xs,
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
  },
  timeFilterItemActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderColor: theme.COLORS.primary,
  },
  timeFilterText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    transition: 'all 0.3s ease',
  },
  timeFilterTextActive: {
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  chartContainer: {
    marginVertical: theme.SPACING.sm,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.sm,
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.xs,
  },
  chartTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.xxs,
  },
  divider: {
    marginVertical: theme.SPACING.xs,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: theme.SPACING.xs,
  },
  chartDescription: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    textAlign: 'center',
    marginTop: theme.SPACING.xs,
  }
});

export default AnalysisView;