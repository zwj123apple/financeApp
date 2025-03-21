import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated, StatusBar, SafeAreaView, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Divider, Tab, TabView } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { useAssetStore } from '../store/assetStore';
import { getAssetDetailData } from '../services/assetAnalysisService';
import AnalysisView from '../components/AnalysisView';

const AssetAnalysisDetailScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [periodIndex, setPeriodIndex] = useState(0); // 0: 月份, 1: 年度
  const [typeIndex, setTypeIndex] = useState(0); // 0: 收入, 1: 支出
  const [assetDetailData, setAssetDetailData] = useState(null);
  
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
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.sectionTitle}>您尚未登录</Text>
            <Divider style={styles.divider} />
            <Text style={styles.notLoginText}>登录后可查看资产分析详情</Text>
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
  
  // 数据准备函数已移至AnalysisView组件
  
  // 添加加载状态指示器
  if (isLoading) {
    return (
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>加载资产分析详情数据...</Text>
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
        {/* 顶部时间维度切换 */}
        <Tab
          value={periodIndex}
          onChange={setPeriodIndex}
          indicatorStyle={{
            backgroundColor: theme.COLORS.primary,
            height: 3,
            borderRadius: theme.BORDER_RADIUS.full,
          }}
          containerStyle={styles.tabContainer}
          variant="primary"
        >
          <Tab.Item
            title="月度分析"
            titleStyle={(active) => ({
              color: active ? theme.COLORS.primary : theme.COLORS.textLight,
              fontSize: theme.FONT_SIZES.sm,
              fontWeight: active ? theme.FONT_WEIGHTS.semibold : theme.FONT_WEIGHTS.regular,
              transition: '0.3s',
            })}
            icon={{
              name: 'calendar-month',
              type: 'material-community',
              color: periodIndex === 0 ? theme.COLORS.primary : theme.COLORS.textLight,
              size: 20,
            }}
            buttonStyle={(active) => ({
              backgroundColor: active ? theme.COLORS.backgroundLight : 'transparent',
              borderRadius: theme.BORDER_RADIUS.md,
              paddingVertical: theme.SPACING.xs,
            })}
          />
          <Tab.Item
            title="年度分析"
            titleStyle={(active) => ({
              color: active ? theme.COLORS.primary : theme.COLORS.textLight,
              fontSize: theme.FONT_SIZES.sm,
              fontWeight: active ? theme.FONT_WEIGHTS.semibold : theme.FONT_WEIGHTS.regular,
              transition: '0.3s',
            })}
            icon={{
              name: 'calendar',
              type: 'material-community',
              color: periodIndex === 1 ? theme.COLORS.primary : theme.COLORS.textLight,
              size: 20,
            }}
            buttonStyle={(active) => ({
              backgroundColor: active ? theme.COLORS.backgroundLight : 'transparent',
              borderRadius: theme.BORDER_RADIUS.md,
              paddingVertical: theme.SPACING.xs,
            })}
          />
        </Tab>
        
        <TabView
          value={periodIndex}
          onChange={setPeriodIndex}
          animationType="spring"
          animationConfig={{
            friction: 8,
            tension: 50,
          }}
          containerStyle={styles.tabViewContainer}
        >
          {/* 月度分析视图 */}
          <TabView.Item style={styles.tabViewItem}>
            <Animated.View style={[styles.tabContentContainer, {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }]}>
              <AnalysisView
                periodIndex={periodIndex}
                typeIndex={typeIndex}
                setTypeIndex={setTypeIndex}
                assetDetailData={assetDetailData}
                fadeAnim={fadeAnim}
                slideAnim={slideAnim}
                isLoading={isLoading}
              />
            </Animated.View>
          </TabView.Item>
          
          {/* 年度分析视图 */}
          <TabView.Item style={styles.tabViewItem}>
            <Animated.View style={[styles.tabContentContainer, {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }]}>
              <AnalysisView
                periodIndex={periodIndex}
                typeIndex={typeIndex}
                setTypeIndex={setTypeIndex}
                assetDetailData={assetDetailData}
                fadeAnim={fadeAnim}
                slideAnim={slideAnim}
                isLoading={isLoading}
              />
            </Animated.View>
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: theme.SPACING.xxl,
    alignItems: 'center',
  },
  tabContainer: {
    backgroundColor: theme.COLORS.white,
    marginTop: theme.SPACING.md,
    marginBottom: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.lg,
    paddingHorizontal: theme.SPACING.xs,
    paddingVertical: theme.SPACING.xxs,
    elevation: 2,
    shadowColor: theme.COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: theme.SPACING.md,
  },
  tabViewContainer: {
    transition: 'all 0.3s ease',
    flex: 1,
  },
  innerTabContainer: {
    backgroundColor: 'transparent',
    marginVertical: theme.SPACING.md,
  },
  tabViewItem: {
    width: '100%',
    flex: 1,
  },
  tabContentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginHorizontal: theme.SPACING.xs,
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
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm,
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
    backgroundColor: theme.COLORS.backgroundLight,
    marginRight: theme.SPACING.sm,
  },
  timeFilterItemActive: {
    backgroundColor: theme.COLORS.primary,
  },
  timeFilterText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
  },
  timeFilterTextActive: {
    color: theme.COLORS.white,
    fontWeight: theme.FONT_WEIGHTS.medium,
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