import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Divider, Tab } from '@rneui/themed';
import { LineChart, PieChart, BarChart } from './charts';

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
    >
      {/* 收入/支出切换 */}
      <Tab
        value={typeIndex}
        onChange={setTypeIndex}
        indicatorStyle={{
          backgroundColor: theme.COLORS.primary,
          height: 3,
          borderRadius: 0, // 使用方形设计
          width: '45%',
          marginLeft: '2.5%',
          transform: [{ translateX: typeIndex === 0 ? 0 : '100%' }],
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        containerStyle={styles.innerTabContainer}
        variant="default"
      >
        <Tab.Item
          title="收入"
          titleStyle={(active) => ({
            color: active ? theme.COLORS.primary : theme.COLORS.textLight,
            fontSize: theme.FONT_SIZES.sm,
            fontWeight: active ? theme.FONT_WEIGHTS.semibold : theme.FONT_WEIGHTS.regular,
            transition: 'all 0.3s ease',
          })}
          icon={{
            name: 'trending-up',
            type: 'material',
            color: typeIndex === 0 ? theme.COLORS.primary : theme.COLORS.textLight,
            size: 18,
          }}
          buttonStyle={(active) => ({
            backgroundColor: active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
            borderRadius: 0, // 使用方形设计
            paddingVertical: theme.SPACING.sm,
            paddingHorizontal: theme.SPACING.xs,
            marginHorizontal: 0,
            borderBottom: active ? `2px solid ${theme.COLORS.primary}` : 'none',
            transition: 'all 0.3s ease',
            flex: 1, // 让Tab项平均分配空间
          })}
        />
        <Tab.Item
          title="支出"
          titleStyle={(active) => ({
            color: active ? theme.COLORS.primary : theme.COLORS.textLight,
            fontSize: theme.FONT_SIZES.sm,
            fontWeight: active ? theme.FONT_WEIGHTS.semibold : theme.FONT_WEIGHTS.regular,
            transition: 'all 0.3s ease',
          })}
          icon={{
            name: 'trending-down',
            type: 'material',
            color: typeIndex === 1 ? theme.COLORS.primary : theme.COLORS.textLight,
            size: 18,
          }}
          buttonStyle={(active) => ({
            backgroundColor: active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
            borderRadius: 0, // 使用方形设计
            paddingVertical: theme.SPACING.sm,
            paddingHorizontal: theme.SPACING.xs,
            marginHorizontal: 0,
            borderBottom: active ? `2px solid ${theme.COLORS.primary}` : 'none',
            transition: 'all 0.3s ease',
            flex: 1, // 让Tab项平均分配空间
          })}
        />
      </Tab>
      
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
          <BarChart
            data={barChartData}
            title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}类别统计`}
            height={Math.min(180, height * 0.25)}
            width={width * 0.85}
            yAxisSuffix="元"
            showValuesOnTopOfBars
          />
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
          <PieChart
            data={pieChartData}
            title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}占比`}
            height={Math.min(220, height * 0.3)}
            width={width * 0.85}
            showLegend={true}
          />
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
          <LineChart
            data={trendChartData}
            title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}趋势`}
            height={Math.min(180, height * 0.25)}
            width={width * 0.85}
            yAxisSuffix="元"
            bezier={true}
          />
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
    paddingBottom: theme.SPACING.xl,
    alignItems: 'center',
  },
  innerTabContainer: {
    backgroundColor: theme.COLORS.white,
    marginVertical: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.xs,
    display: 'flex', // 使用flex布局
    flexDirection: 'row', // 水平排列
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