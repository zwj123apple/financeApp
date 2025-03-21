import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Divider, Tab } from '@rneui/themed';
import { LineChart, PieChart, BarChart } from './charts';

const AnalysisView = ({
  periodIndex,
  typeIndex,
  setTypeIndex,
  assetDetailData,
  fadeAnim,
  slideAnim,
  isLoading,
}) => {
  // 添加时间筛选状态
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(0);
  const { width, height } = useWindowDimensions();

  // 准备柱状图数据
  const prepareBarChartData = () => {
    if (!assetDetailData || !assetDetailData.categoryData) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = assetDetailData.categoryData.map(item => item.category);
    const data = assetDetailData.categoryData.map(item => item.amount);
    
    return {
      labels,
      datasets: [{ data }]
    };
  };
  
  // 准备饼图数据
  const preparePieChartData = () => {
    if (!assetDetailData || !assetDetailData.categoryData) {
      return [];
    }
    
    // 饼图颜色
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    return assetDetailData.categoryData.map((item, index) => ({
      name: item.category,
      value: item.amount,
      color: colors[index % colors.length]
    }));
  };
  
  // 准备趋势图数据
  const prepareTrendData = () => {
    // 如果没有数据，返回空数据结构
    if (!assetDetailData || !assetDetailData.trendData) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = assetDetailData.trendData.map(item => item.date);
    const data = assetDetailData.trendData.map(item => item.amount);
    
    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

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
          borderRadius: theme.BORDER_RADIUS.full,
          width: '40%',
          marginLeft: '5%',
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
            borderRadius: theme.BORDER_RADIUS.md,
            paddingVertical: theme.SPACING.xs,
            paddingHorizontal: theme.SPACING.sm,
            marginHorizontal: theme.SPACING.xxs,
            transition: 'all 0.3s ease',
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
            borderRadius: theme.BORDER_RADIUS.md,
            paddingVertical: theme.SPACING.xs,
            paddingHorizontal: theme.SPACING.sm,
            marginHorizontal: theme.SPACING.xxs,
            transition: 'all 0.3s ease',
          })}
        />
      </Tab>
      
      {/* 金额显示区域 */}
      <Animated.View style={[styles.amountContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <LinearGradient
          colors={typeIndex === 0 ? theme.GRADIENTS.success : theme.GRADIENTS.error}
          style={styles.amountGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.amountLabel}>
            {periodIndex === 0 ? '本月' : '本年'}{typeIndex === 0 ? '收入' : '支出'}
          </Text>
          <Text style={styles.amountValue}>
            ¥ {assetDetailData?.totalAmount?.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.amountCompare}>
            较{periodIndex === 0 ? '上月' : '去年'}{assetDetailData?.comparePercentage > 0 ? '增长' : '减少'} {Math.abs(assetDetailData?.comparePercentage || 0).toFixed(2)}%
          </Text>
        </LinearGradient>
      </Animated.View>
      
      {/* 时间筛选区域 */}
      <Animated.View style={[styles.filterContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        width: width * 0.9,
        maxWidth: 500
      }]}>
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
                
                // 这里应该调用API获取对应时间的数据
                // 实际项目中，这里应该调用一个函数来获取新的数据
                console.log('选择时间筛选:', filter.label);
                
                // 模拟数据更新 - 在实际应用中应替换为API调用
                if (assetDetailData && assetDetailData.onTimeFilterChange) {
                  assetDetailData.onTimeFilterChange(index, filter.value);
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
      </Animated.View>
      
      {/* 柱状图 */}
      <Animated.View style={[styles.chartContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [100, 0]}) }],
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <Text style={styles.chartTitle}>{typeIndex === 0 ? '收入' : '支出'}类别分布</Text>
        <Divider style={styles.divider} />
        <View style={styles.chartWrapper}>
          <BarChart
            data={prepareBarChartData()}
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
      </Animated.View>
      
      {/* 饼图 */}
      <Animated.View style={[styles.chartContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [150, 0]}) }],
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <Text style={styles.chartTitle}>{typeIndex === 0 ? '收入' : '支出'}占比分析</Text>
        <Divider style={styles.divider} />
        <View style={styles.chartWrapper}>
          <PieChart
            data={preparePieChartData()}
            title={`${typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}占比`}
            height={Math.min(220, height * 0.3)}
            width={width * 0.85}
            showLegend={true}
          />
        </View>
        <Text style={styles.chartDescription}>
          展示您的{typeIndex === 0 ? (periodIndex === 0 ? '月度收入' : '年度收入') : (periodIndex === 0 ? '月度支出' : '年度支出')}在不同类别间的占比情况。
        </Text>
      </Animated.View>
      
      {/* 趋势图 */}
      <Animated.View style={[styles.chartContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [200, 0]}) }],
        width: width * 0.9,
        maxWidth: 500
      }]}>
        <Text style={styles.chartTitle}>{typeIndex === 0 ? '收入' : '支出'}趋势分析</Text>
        <Divider style={styles.divider} />
        <View style={styles.chartWrapper}>
          <LineChart
            data={prepareTrendData()}
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
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: theme.SPACING.xxl,
    alignItems: 'center',
  },
  innerTabContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginVertical: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.lg,
    paddingHorizontal: theme.SPACING.xs,
    paddingVertical: theme.SPACING.xxs,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
    elevation: 1,
    shadowColor: theme.COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    backdropFilter: 'blur(8px)',
  },
  amountContainer: {
    marginVertical: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...theme.SHADOWS.md,
  },
  amountGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  amountLabel: {
    color: theme.COLORS.white,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    marginBottom: theme.SPACING.xs,
  },
  amountValue: {
    color: theme.COLORS.white,
    fontSize: theme.FONT_SIZES.xxxl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    marginBottom: theme.SPACING.sm,
  },
  amountCompare: {
    color: theme.COLORS.white,
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
    opacity: 0.9,
  },
  filterContainer: {
    marginVertical: theme.SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
    elevation: 1,
    shadowColor: theme.COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    backdropFilter: 'blur(8px)',
  },
  filterTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.sm,
  },
  timeFilterContainer: {
    paddingVertical: theme.SPACING.xs,
  },
  timeFilterItem: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.full,
    backgroundColor: 'rgba(243, 244, 246, 0.7)',
    marginRight: theme.SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    transition: 'all 0.3s ease',
  },
  timeFilterItemActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
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
    marginVertical: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm,
    elevation: 3,
    shadowColor: theme.COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    borderWidth: 0.5,
    borderColor: theme.COLORS.borderLight,
  },
  chartTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.xs,
  },
  divider: {
    marginVertical: theme.SPACING.sm,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: theme.SPACING.sm,
  },
  chartDescription: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    textAlign: 'center',
    marginTop: theme.SPACING.sm,
  }
});

export default AnalysisView;
