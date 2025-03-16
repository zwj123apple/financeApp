import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Animated, Dimensions, StatusBar, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Icon, Divider } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { useAssetStore } from '../store/assetStore';
import { LineChart, PieChart, BarChart } from '../components/charts';

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
      await Promise.all([
        fetchAssetOverview(user.id),
        fetchHoldings(user.id),
        fetchAssetAnalysis(user.id)
      ]);
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
        data,
        colors: data.map(value => value >= 0 ? '#4CAF50' : '#F44336')
      }]
    };
  };
  
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
                height={Math.min(220, height * 0.3)} // 根据屏幕高度调整图表高度
                width={width * 0.85} // 设置图表宽度为屏幕宽度的85%
                yAxisSuffix="元"
                bezier
              />
            </View>
            <Text style={styles.chartDescription}>
              展示您的资产总值随时间的变化趋势，帮助您了解资产增长情况。
            </Text>
          </Animated.View>
          
          {/* 资产分布饼图 */}
          <Animated.View style={[styles.sectionContainer, {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [100, 0]}) }, { scale: scaleAnim }],
              width: width * 0.9, // 使用屏幕宽度的90%
              maxWidth: 500 // 设置最大宽度
            }]}>
            <Text style={styles.sectionTitle}>资产分布分析</Text>
            <Divider style={styles.divider} />
            <View style={styles.chartWrapper}>
              <PieChart 
                data={prepareAssetDistributionData()} 
                title="资产类别分布" 
                height={Math.min(220, height * 0.3)} // 根据屏幕高度调整图表高度
                width={Math.min(width * 0.85, 450)} // 设置图表宽度为屏幕宽度的85%，但最大不超过450
              />
            </View>
            <Text style={styles.chartDescription}>
              展示您的资产在不同产品类别间的分布情况，帮助您了解资产多样化程度。
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
                height={Math.min(220, height * 0.3)} // 根据屏幕高度调整图表高度
                width={width * 0.85} // 设置图表宽度为屏幕宽度的85%
                yAxisSuffix="元"
                showValuesOnTopOfBars
              />
            </View>
            <Text style={styles.chartDescription}>
              展示您每月的收益情况，帮助您了解资产收益的周期性变化。
            </Text>
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
  contentContainer: {
    paddingTop: theme.SPACING.md,
    width: '100%',
    alignItems: 'center'
  },
  sectionContainer: {
    marginBottom: theme.SPACING.lg,
    padding: theme.SPACING.md,
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
    marginVertical: theme.SPACING.sm,
    overflow: 'hidden' // 防止图表溢出
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
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
    marginBottom: theme.SPACING.xs,
    textAlign: 'center',
  },
  notLoginText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.md,
    color: theme.COLORS.textLight,
    fontSize: theme.FONT_SIZES.md,
  },
  loginButton: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.primary,
  },
  chartDescription: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    textAlign: 'center',
    marginTop: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
    fontStyle: 'italic'
  },
  divider: {
    backgroundColor: theme.COLORS.primaryLight,
    height: 1,
    opacity: 0.5,
    marginVertical: theme.SPACING.sm
  },
  bottomPadding: {
    height: 120, // 增加底部填充高度，确保内容可以滚动到底部导航栏上方
  }
});

export default AssetAnalysisScreen;