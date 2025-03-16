import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Animated, TouchableOpacity, StatusBar, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Icon, Divider } from '@rneui/themed';
import { useAssetStore } from '../store/assetStore';
import { useAuthStore } from '../store/authStore';
import { LineChart, PieChart } from '../components/charts';
import theme from '../utils/theme';

const AssetDetailScreen = ({ route, navigation }) => {
  const { assetId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const { 
    holdings, 
    assetOverview, 
    fetchHoldings, 
    fetchAssetOverview, 
    isLoading 
  } = useAssetStore();
  const [currentAsset, setCurrentAsset] = useState(null);
  
  // 使用useWindowDimensions钩子获取屏幕尺寸
  const { width } = useWindowDimensions();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, [assetId]);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    
    if (user) {
      // 获取资产概览
      await fetchAssetOverview(user.id);
      
      // 获取持仓列表
      const result = await fetchHoldings(user.id);
      
      if (result.success) {
        // 找到当前资产
        const asset = result.holdings.find(h => h.id === assetId);
        setCurrentAsset(asset);
      }
    }
    
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 准备收益走势数据
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
  
  // 计算持有天数
  const calculateHoldingDays = () => {
    if (!currentAsset) return 0;
    
    const purchaseDate = new Date(currentAsset.purchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today - purchaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // 如果资产数据未加载，显示加载状态
  if (!currentAsset) {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }
  
  // 准备动画值
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // 启动进入动画
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, [currentAsset]);
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.COLORS.primary]} />}
          showsVerticalScrollIndicator={false}
        >
          {/* 资产概览部分 */}
          <Animated.View style={[styles.sectionContainer, {opacity: fadeAnim}]}>
            <Text style={styles.sectionTitle}>{currentAsset.productName}</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>持仓金额</Text>
                <Text style={styles.infoValue}>¥{currentAsset.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>当前价值</Text>
                <Text style={styles.infoValue}>¥{currentAsset.currentValue.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>累计收益</Text>
                <Text style={[styles.infoValue, { color: currentAsset.profit >= 0 ? theme.COLORS.success : theme.COLORS.error }]}>
                  {currentAsset.profit >= 0 ? '+' : ''}{currentAsset.profit.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>收益率</Text>
                <Text style={[styles.infoValue, { color: currentAsset.profit >= 0 ? theme.COLORS.success : theme.COLORS.error }]}>
                  {currentAsset.profitRate}
                </Text>
              </View>
            </View>
          </Animated.View>
          
          {/* 资产详情部分 */}
          <Animated.View style={[
            styles.sectionContainer, 
            {opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [50, 0]})}]}
          ]}>
            <Text style={styles.sectionTitle}>资产详情</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>购买日期</Text>
              <Text style={styles.detailValue}>{currentAsset.purchaseDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>到期日期</Text>
              <Text style={styles.detailValue}>{currentAsset.expiryDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>已持有</Text>
              <Text style={styles.detailValue}>{calculateHoldingDays()}天</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>产品类型</Text>
              <Text style={styles.detailValue}>{currentAsset.productName.includes('稳健') ? '低风险' : 
                                               currentAsset.productName.includes('成长') ? '中风险' : '高风险'}</Text>
            </View>
          </Animated.View>
          
          {/* 收益走势图 */}
          <Animated.View style={[
            styles.sectionContainer, 
            {opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [100, 0]})}]}
          ]}>
            <Text style={styles.sectionTitle}>收益走势</Text>
            <Divider style={styles.divider} />
            <View style={styles.chartWrapper}>
              <LineChart 
                data={prepareProfitTrendData()} 
                title="历史收益走势" 
                height={200}
                width={width * 0.85} // 设置图表宽度为屏幕宽度的85%
                yAxisSuffix="元"
                bezier
              />
            </View>
          </Animated.View>
          
          {/* 操作按钮 */}
          <Animated.View style={[styles.sectionContainer, {opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [150, 0]})}]}]}>
            <Button
              title="查看更多详情"
              onPress={() => navigation.navigate('AssetAnalysis')}
              buttonStyle={styles.actionButton}
              icon={<Icon name="analytics" color="white" style={{ marginRight: 10 }} />}
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
  contentContainer: {
    paddingHorizontal: theme.SPACING.md,
    paddingTop: theme.SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.backgroundLight
  },
  sectionContainer: {
    marginBottom: theme.SPACING.md,
    padding: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.sm,
  },
  sectionTitle: {
    color: theme.COLORS.primary,
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
    marginBottom: theme.SPACING.xs,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: theme.COLORS.primaryLight,
    height: 1,
    opacity: 0.5,
    marginVertical: theme.SPACING.sm
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.xs
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
    padding: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.md,
    backgroundColor: 'rgba(239, 246, 255, 0.5)'
  },
  infoLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.xxs
  },
  infoValue: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    marginTop: theme.SPACING.xs,
    color: theme.COLORS.textDark
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
    marginBottom: theme.SPACING.xxs
  },
  detailLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight
  },
  detailValue: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.text
  },
  actionButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.sm,
    marginHorizontal: theme.SPACING.md
  },
  buttonTitle: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.md,
    letterSpacing: 0.5
  },
  bottomPadding: {
    height: 80, // 确保底部有足够的空间，使内容可以滚动到底部导航栏上方
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.SPACING.sm,
    overflow: 'hidden' // 防止图表溢出
  }
});

export default AssetDetailScreen;