import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Animated, Dimensions, StatusBar, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Icon, Divider } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { useAssetStore } from '../store/assetStore';
import { LineChart, PieChart, BarChart } from '../components/charts';
import { getMonthlyProfitData } from '../services/assetAnalysisService';

// 使用useWindowDimensions钩子替代静态Dimensions

const AssetAnalysisScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { 
    assetOverview, 
    holdings, 
    assetAnalysis,
    fetchAssetOverview, 
    fetchHoldings,
    fetchAssetAnalysis,
    isLoading 
  } = useAssetStore();
  
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const { width, height } = useWindowDimensions();
  
  // 动画值
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  // 加载资产数据
  useEffect(() => {
    if (user) {
      loadData();
    }
    
    // 启动进入动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.ANIMATION.normal,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.ANIMATION.normal,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: theme.ANIMATION.normal,
        useNativeDriver: true
      })
    ]).start();
  }, [user]);
  
  const loadData = async () => {
    if (user) {
      // 设置加载状态
      useAssetStore.setState({ isLoading: true });
      
      try {
        // 使用Promise.all并行加载所有数据，减少总体加载时间
        const [overviewResult, holdingsResult, analysisResult, monthlyProfitResult] = await Promise.all([
          fetchAssetOverview(user.id),
          fetchHoldings(user.id),
          fetchAssetAnalysis(user.id),
          getMonthlyProfitData(user.id)
        ]);
        
        // 如果月度收益数据获取成功，立即更新到状态中
        if (monthlyProfitResult.success) {
          // 使用函数式更新确保获取最新状态
          useAssetStore.setState(state => ({
            assetAnalysis: {
              ...state.assetAnalysis,
              monthlyProfit: monthlyProfitResult.monthlyProfit
            },
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('加载资产分析数据失败:', error);
        useAssetStore.setState({ isLoading: false });
      }
    }
  };
  
  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.sectionTitle}>您尚未登录</Text>
            <Divider style={styles.divider} />
            <Text style={styles.notLoginText}>登录后可查看资产分析</Text>
            <Button
              title="去登录"
              onPress={() => navigation.navigate('Login')}
              buttonStyle={styles.loginButton}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  
  // 准备收益走势图数据
  const prepareProfitTrendData = () => {
    if (!assetOverview || !assetOverview.profitTrend) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = assetOverview.profitTrend.map(item => item.date.substring(5)); // 只显示月份
    const data = assetOverview.profitTrend.map(item => item.value);
    
    return {
      labels,
      datasets: [{ data }]
    };
  };
  
  // 准备资产分布饼图数据
  const prepareAssetDistributionData = () => {
    if (!holdings || holdings.length === 0) {
      return [];
    }
    
    // 按产品名称分组
    const holdingsByProduct = {};
    
    holdings.forEach(holding => {
      if (!holdingsByProduct[holding.productName]) {
        holdingsByProduct[holding.productName] = 0;
      }
      holdingsByProduct[holding.productName] += holding.currentValue;
    });
    
    // 转换为饼图数据格式
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    return Object.entries(holdingsByProduct).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };
    // 准备风险等级分布饼图数据
  const prepareRiskDistributionData = () => {
    if (!assetAnalysis || !assetAnalysis.assetSummary || !assetAnalysis.assetSummary.riskLevelDistribution) {
      return [];
    }
    
    // 风险等级颜色映射
    const riskColors = {
      '低风险': '#4CAF50', // 绿色
      '中风险': '#FFC107', // 黄色
      '高风险': '#F44336'  // 红色
    };
    
    // 转换为饼图数据格式
    return assetAnalysis.assetSummary.riskLevelDistribution.map(item => ({
      name: item.riskLevel,
      value: parseFloat(item.percentage.replace('%', '')),
      color: riskColors[item.riskLevel] || '#9C27B0' // 默认紫色
    }));
  };
  
  // 准备月度收益柱状图数据
  const prepareMonthlyProfitData = () => {
    if (!assetAnalysis || !assetAnalysis.monthlyProfit) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = assetAnalysis.monthlyProfit.map(item => item.month);
    const data = assetAnalysis.monthlyProfit.map(item => item.profit);
    
    return {
      labels,
      datasets: [{
        data
        // 注意：不需要在这里提供color函数，BarChart组件内部已经实现了根据数据正负值显示不同颜色的逻辑
      }]
    };
  };

  
  // 添加加载状态指示器
  if (isLoading) {
    return (
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>加载资产分析数据...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={[styles.contentContainer, { paddingHorizontal: Math.max(theme.SPACING.md, width * 0.05) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 收益走势图 */}
          <Animated.View style={[styles.sectionContainer, {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              width: width * 0.9, // 使用屏幕宽度的90%
              maxWidth: 500 // 设置最大宽度
            }]}>
            <Text style={styles.sectionTitle}>收益走势分析</Text>
            <Divider style={styles.divider} />
            <View style={styles.chartWrapper}>
              <LineChart 
                data={prepareProfitTrendData()} 
                title="资产收益走势" 
                height={Math.min(180, height * 0.25)} // 减小图表高度
                width={width * 0.85} // 设置图表宽度为屏幕宽度的85%
                yAxisSuffix="元"
                bezier
              />
            </View>
            <Text style={styles.chartDescription}>
              展示您的资产总值随时间的变化趋势，帮助您了解资产增长情况。
            </Text>
          </Animated.View>
          
          {/* 风险分布饼图 */}
          <Animated.View style={[styles.sectionContainer, {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [100, 0]}) }, { scale: scaleAnim }],
              width: width * 0.9, // 使用屏幕宽度的90%
              maxWidth: 500 // 设置最大宽度
            }]}>
            <Text style={styles.sectionTitle}>风险分布分析</Text>
            <Divider style={styles.divider} />
            <View style={styles.chartWrapper}>
              <PieChart 
                data={prepareRiskDistributionData()} 
                title="风险等级分布" 
                height={Math.min(200, height * 0.28)} // 调整饼图高度
                width={Math.min(width * 0.9, 400)} // 调整饼图宽度，确保完整显示
              />
            </View>
            <Text style={styles.chartDescription}>
              展示您的资产在不同风险等级间的分布情况，帮助您了解投资组合的风险水平。
            </Text>
          </Animated.View>
          
          {/* 月度收益柱状图 */}
          <Animated.View style={[styles.sectionContainer, {
              opacity: fadeAnim,
              transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [150, 0]})}, {scale: scaleAnim}],
              width: width * 0.9, // 使用屏幕宽度的90%
              maxWidth: 500 // 设置最大宽度
            }]}>
            <Text style={styles.sectionTitle}>月度收益分析</Text>
            <Divider style={styles.divider} />
            <View style={styles.chartWrapper}>
              <BarChart 
                data={prepareMonthlyProfitData()} 
                title="月度收益情况" 
                height={Math.min(180, height * 0.25)} // 减小图表高度
                width={width * 0.85} // 设置图表宽度为屏幕宽度的85%
                yAxisSuffix="元"
                showValuesOnTopOfBars
              />
            </View>
            <Text style={styles.chartDescription}>
              展示您每月的收益情况，帮助您了解资产收益的周期性变化。
            </Text>
            <Button
              title="详细"
              type="outline"
              size="sm"
              buttonStyle={styles.detailButton}
              titleStyle={styles.detailButtonText}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: theme.COLORS.primary
              }}
              iconRight
              onPress={() => navigation.navigate('AssetAnalysisDetail')}
            />
          </Animated.View>
          
          {/* 底部填充，确保内容可以滚动到底部导航栏上方 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.lg,
  },
  loadingText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.primary,
    marginTop: theme.SPACING.md,
  },
  contentContainer: {
    paddingTop: theme.SPACING.sm, // 减小顶部间距
    width: '100%',
    alignItems: 'center'
  },
  sectionContainer: {
    marginBottom: theme.SPACING.md, // 减小底部间距
    padding: theme.SPACING.sm, // 减小内边距
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.sm,
    alignItems: 'center',
    alignSelf: 'center', // 确保容器居中
    overflow: 'hidden' // 防止内容溢出
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.SPACING.sm, // 减小垂直间距
    overflow: 'visible' // 允许图表内容溢出，解决饼图被覆盖问题
  },
  loginContainer: {
    margin: theme.SPACING.lg,
    padding: theme.SPACING.lg,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.sm,
    width: '90%', // 使用屏幕宽度的90%
    maxWidth: 500, // 设置最大宽度
    alignSelf: 'center' // 确保容器居中
  },
  sectionTitle: {
    color: theme.COLORS.primary,
    fontSize: theme.FONT_SIZES.md, // 减小标题字体大小
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
    marginBottom: theme.SPACING.xxs, // 减小底部间距
    textAlign: 'center',
  },
  notLoginText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.sm, // 减小垂直间距
    color: theme.COLORS.textLight,
    fontSize: theme.FONT_SIZES.md,
  },
  loginButton: {
    marginTop: theme.SPACING.sm, // 减小顶部间距
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.primary,
  },
  chartDescription: {
    fontSize: theme.FONT_SIZES.xs, // 减小描述文字大小
    color: theme.COLORS.textLight,
    textAlign: 'center',
    marginTop: theme.SPACING.xs, // 减小顶部间距
    paddingHorizontal: theme.SPACING.sm, // 减小水平内边距
    fontStyle: 'italic'
  },
  divider: {
    backgroundColor: theme.COLORS.primaryLight,
    height: 1,
    opacity: 0.5,
    marginVertical: theme.SPACING.xs // 减小垂直间距
  },
  bottomPadding: {
    height: 40 // 减小底部填充高度
  },
  detailButton: {
    marginTop: theme.SPACING.sm,
    borderColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingHorizontal: theme.SPACING.md
  },
  detailButtonText: {
    color: theme.COLORS.primary,
    fontSize: theme.FONT_SIZES.sm,
    marginRight: theme.SPACING.xs
  }
});

export default AssetAnalysisScreen;