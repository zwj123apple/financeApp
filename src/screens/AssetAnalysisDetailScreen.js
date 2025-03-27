import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated, StatusBar, SafeAreaView, useWindowDimensions, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Divider, Tab, TabView } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { useAssetStore } from '../store/assetStore';
import { getAssetDetailData } from '../services/assetAnalysisService';
import AnalysisView from '../components/AnalysisView';
import { ErrorBoundary } from '../components';

const AssetAnalysisDetailScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [periodIndex, setPeriodIndex] = useState(0); // 0: 月份, 1: 年度
  const [typeIndex, setTypeIndex] = useState(0); // 0: 收入, 1: 支出
  const [assetDetailData, setAssetDetailData] = useState(null);
  
  // 添加数据更新函数，用于时间筛选器变化时更新图表数据
  const onDataUpdate = (updatedData) => {
    if (updatedData) {
      setAssetDetailData(prevData => ({
        ...prevData,
        ...updatedData
      }));
    }
  };
  
  // 动画值
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  // 加载资产详细数据
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
  
  // 当切换时间维度或收支类型时重新加载数据
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [periodIndex, typeIndex]);
  
  const loadData = async () => {
    if (user) {
      setIsLoading(true);
      
      try {
        // 获取资产详细数据
        const period = periodIndex === 0 ? 'month' : 'year';
        const type = typeIndex === 0 ? 'income' : 'expense';
        const result = await getAssetDetailData(user.id, period, type);
        
        if (result.success) {
          setAssetDetailData(result.data);
        }
      } catch (error) {
        console.error('加载资产详细数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loginContainer}>
            <Text style={styles.sectionTitle}>您尚未登录</Text>
            <Divider style={styles.divider} />
            <Text style={styles.notLoginText}>登录后可查看资产分析详情</Text>
            <Button
              title="去登录"
              onPress={() => navigation.navigate('Login')}
              buttonStyle={styles.loginButton}
              titleStyle={styles.loginButtonText}
              containerStyle={styles.loginButtonContainer}
              icon={{
                name: 'login',
                type: 'material-community',
                color: theme.COLORS.white,
                size: 18,
                style: { marginRight: theme.SPACING.xs }
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
  
  // 数据准备函数已移至AnalysisView组件
  
  // 添加加载状态指示器
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>加载资产分析详情数据...</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部时间维度切换 - 现代分段控制器设计 */}
        <View style={[styles.segmentedControlContainer, { width: width, maxWidth: 500 }]}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              periodIndex === 0 && styles.segmentButtonActive,
              { borderTopLeftRadius: theme.BORDER_RADIUS.md, borderBottomLeftRadius: theme.BORDER_RADIUS.md }
            ]}
            onPress={() => setPeriodIndex(0)}
            activeOpacity={0.7}
          >
            <View style={styles.segmentContent}>
              <View style={styles.segmentIconContainer}>
                <LinearGradient
                  colors={periodIndex === 0 ? theme.GRADIENTS.primary : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
                  style={styles.iconBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.segmentIcon, periodIndex === 0 && styles.segmentIconActive]}>📅</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.segmentText, periodIndex === 0 && styles.segmentTextActive]}>月度分析</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.segmentButton,
              periodIndex === 1 && styles.segmentButtonActive,
              { borderTopRightRadius: theme.BORDER_RADIUS.md, borderBottomRightRadius: theme.BORDER_RADIUS.md }
            ]}
            onPress={() => setPeriodIndex(1)}
            activeOpacity={0.7}
          >
            <View style={styles.segmentContent}>
              <View style={styles.segmentIconContainer}>
                <LinearGradient
                  colors={periodIndex === 1 ? theme.GRADIENTS.primary : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
                  style={styles.iconBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.segmentIcon, periodIndex === 1 && styles.segmentIconActive]}>📆</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.segmentText, periodIndex === 1 && styles.segmentTextActive]}>年度分析</Text>
            </View>
          </TouchableOpacity>
          
          {/* 动画指示器 */}
          <Animated.View 
            style={[
              styles.segmentIndicator,
              { transform: [{ translateX: periodIndex === 0 ? 0 : '100%' }] }
            ]}
          />
        </View>
        
        <TabView
          value={periodIndex}
          onChange={setPeriodIndex}
          containerStyle={[styles.tabViewContainer, Platform.OS === 'ios' && styles.tabViewContainerIOS]}
          animationType="spring"
        >
          {/* 月度分析视图 */}
          <TabView.Item style={styles.tabViewItem}>
            <View style={styles.tabContentContainer}>
              <AnalysisView
                periodIndex={periodIndex}
                typeIndex={typeIndex}
                setTypeIndex={setTypeIndex}
                assetDetailData={assetDetailData}
                onDataUpdate={onDataUpdate}
                isLoading={isLoading}
                barChartData={assetDetailData ? {
                  labels: assetDetailData.categoryData?.map(item => item.category) || [],
                  datasets: [{
                    data: assetDetailData.categoryData?.map(item => item.amount) || []
                  }]
                } : {labels: [], datasets: [{data: []}]}}
                pieChartData={assetDetailData ? assetDetailData.categoryData?.map((item, index) => ({
                  name: item.category,
                  value: item.amount,
                  color: theme.COLORS.chart[index % theme.COLORS.chart.length] || theme.COLORS.primary
                })) || [] : []}
                trendChartData={assetDetailData ? {
                  labels: assetDetailData.trendData?.map(item => item.date) || [],
                  datasets: [{
                    data: assetDetailData.trendData?.map(item => item.amount) || [],
                    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                    strokeWidth: 2
                  }]
                } : {labels: [], datasets: [{data: []}]}}
              />
            </View>
          </TabView.Item>
          
          {/* 年度分析视图 */}
          <TabView.Item style={styles.tabViewItem}>
            <View style={styles.tabContentContainer}>
              <AnalysisView
                periodIndex={periodIndex}
                typeIndex={typeIndex}
                setTypeIndex={setTypeIndex}
                assetDetailData={assetDetailData}
                onDataUpdate={onDataUpdate}
                isLoading={isLoading}
                barChartData={assetDetailData ? {
                  labels: assetDetailData.categoryData?.map(item => item.category) || [],
                  datasets: [{
                    data: assetDetailData.categoryData?.map(item => item.amount) || []
                  }]
                } : {labels: [], datasets: [{data: []}]}}
                pieChartData={assetDetailData ? assetDetailData.categoryData?.map((item, index) => ({
                  name: item.category,
                  value: item.amount,
                  color: theme.COLORS.chart[index % theme.COLORS.chart.length] || theme.COLORS.primary
                })) || [] : []}
                trendChartData={assetDetailData ? {
                  labels: assetDetailData.trendData?.map(item => item.date) || [],
                  datasets: [{
                    data: assetDetailData.trendData?.map(item => item.amount) || [],
                    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                    strokeWidth: 2
                  }]
                } : {labels: [], datasets: [{data: []}]}}
              />
            </View>
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight,
  },
  safeArea: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: theme.SPACING.xxl,
    alignItems: 'center',
  },
  // 分段控制器样式
  segmentedControlContainer: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.backgroundLight,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.sm,
    position: 'relative',
    height: 52,
    marginHorizontal: 0,
    paddingHorizontal: 0,
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
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: theme.COLORS.white,
    ...theme.SHADOWS.xs,
    zIndex: 0,
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  // 保留旧的Tab样式以便兼容
  tabOuterContainer: {
    width: '100%',
    height: 'auto',
    alignItems: 'stretch',
    paddingHorizontal: 0,
  },
  tabContainer: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.sm,
    height: 52,
    width: '100%',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  tabViewContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 0,
    zIndex: 1,
    paddingHorizontal: 0,
  },
  tabViewContainerIOS: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  tabViewItem: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    height: '100%',
  },
  tabContentContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    overflow: 'hidden',
    marginHorizontal: 0,
    width: '100%',
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.md,
    elevation: 2,
    paddingTop: theme.SPACING.md,
    height: '100%',
    position: 'relative',
  },
  // 登录相关样式
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.xl,
    backgroundColor: theme.COLORS.backgroundLight,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.md,
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    marginVertical: theme.SPACING.md,
  },
  notLoginText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.xl,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.lg,
    borderRadius: theme.BORDER_RADIUS.md,
  },
  loginButtonText: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  loginButtonContainer: {
    width: '60%',
    maxWidth: 250,
    marginTop: theme.SPACING.md,
  },
  
  // 加载状态样式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.backgroundLight,
  },
  loadingIndicator: {
    backgroundColor: theme.COLORS.white,
    padding: theme.SPACING.lg,
    borderRadius: theme.BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.SHADOWS.md,
    width: '80%',
    maxWidth: 350,
  },
  loadingText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
    textAlign: 'center',
  },
  chartContainer: {
    marginVertical: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm,
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
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.xl,
  },
  notLoginText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
    marginVertical: theme.SPACING.lg,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: theme.SPACING.xl,
    paddingVertical: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    marginTop: theme.SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
    marginTop: theme.SPACING.md,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.md,
  }
}); 
export default AssetAnalysisDetailScreen;