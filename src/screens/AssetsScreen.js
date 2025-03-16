import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Animated, FlatList, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, ListItem, Icon } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { useAssetStore } from '../store/assetStore';
import PieChart from '../components/charts/PieChart';
import { Dimensions } from 'react-native';
import theme from '../utils/theme';

const AssetsScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { 
    assetOverview, 
    holdings, 
    fetchAssetOverview, 
    fetchHoldings, 
    isLoading 
  } = useAssetStore();
  
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const { width, height } = useWindowDimensions();
  
  // 加载资产数据
  useEffect(() => {
    if (user) {
      fetchAssetOverview(user.id);
      fetchHoldings(user.id);
    }
  }, [user]);
  
  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={theme.GRADIENTS.background}
          style={styles.gradientBackground}
        >
          <View style={styles.notLoginContainer}>
            <Icon name="account-balance-wallet" type="material" size={80} color={theme.COLORS.textLight} />
            <Text style={styles.notLoginText}>您尚未登录</Text>
            <Text style={styles.notLoginSubText}>登录后可查看资产信息</Text>
            <Button
              title="去登录"
              onPress={() => navigation.navigate('Login')}
              buttonStyle={styles.loginButton}
              titleStyle={styles.loginButtonTitle}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
  
  // 准备饼图数据
  const getPieChartData = () => {
    if (!holdings || holdings.length === 0) {
      return [
        {
          name: '暂无资产',
          value: 1,
          color: '#CCCCCC',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12
        }
      ];
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
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
  };
  
  // 计算总资产价值
  const getTotalAssetValue = () => {
    if (!holdings || holdings.length === 0) return 0;
    return holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  };
  
  // 计算总收益
  const getTotalProfit = () => {
    if (!holdings || holdings.length === 0) return 0;
    return holdings.reduce((sum, holding) => sum + holding.profit, 0);
  };
  
  // 计算总收益率
  const getTotalProfitRate = () => {
    const totalValue = getTotalAssetValue();
    const totalProfit = getTotalProfit();
    const totalInvestment = totalValue - totalProfit;
    
    if (totalInvestment <= 0) return '0.00%';
    
    const rate = (totalProfit / totalInvestment) * 100;
    return rate.toFixed(2) + '%';
  };
  
  const pieChartData = getPieChartData();
  const totalAssetValue = getTotalAssetValue();
  const totalProfit = getTotalProfit();
  const totalProfitRate = getTotalProfitRate();
  
  // 查看持仓详情
  const viewHoldingDetail = (holdingId) => {
    // 由于HoldingDetail已移至Profile导航栈，需要使用嵌套导航
    navigation.navigate('Profile', { 
      screen: 'HoldingDetail', 
      params: { holdingId } 
    });
  };
  
  // 渲染持仓项
  const renderHoldingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.holdingItem}
      onPress={() => viewHoldingDetail(item.id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[theme.COLORS.white, theme.COLORS.backgroundLight]}
        style={styles.holdingItemGradient}
      >
        <View style={styles.holdingContent}>
          <Text style={styles.holdingName}>{item.productName}</Text>
          <View style={styles.holdingInfoRow}>
            <View style={styles.holdingInfoItem}>
              <Text style={styles.infoLabel}>当前价值</Text>
              <Text style={styles.infoValue}>¥{item.currentValue.toFixed(2)}</Text>
            </View>
            <View style={styles.holdingInfoItem}>
              <Text style={styles.infoLabel}>收益</Text>
              <Text style={[styles.infoValue, item.profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                {item.profit >= 0 ? '+' : ''}{item.profit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.holdingInfoItem}>
              <Text style={styles.infoLabel}>收益率</Text>
              <Text style={[styles.infoValue, parseFloat(item.profitRate) >= 0 ? styles.profitPositive : styles.profitNegative]}>
                {parseFloat(item.profitRate) >= 0 ? '+' : ''}{item.profitRate}
              </Text>
            </View>
          </View>
        </View>
        <Icon name="chevron-right" type="material" size={20} color={theme.COLORS.textLight} />
      </LinearGradient>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 资产总览 */}
          <View style={styles.overviewSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>资产总览</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('AssetAnalysis')}
                style={styles.analysisButton}
              >
                <Text style={styles.analysisButtonText}>分析</Text>
                <Icon name="analytics" type="material" size={16} color={theme.COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <LinearGradient
              colors={[theme.COLORS.backgroundLight, theme.COLORS.white]}
              style={styles.overviewContainer}
            >
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>总资产</Text>
                <Text style={styles.overviewValue}>{totalAssetValue.toFixed(2)}元</Text>
              </View>
              
              <View style={styles.overviewDivider} />
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>总收益</Text>
                <Text style={[styles.overviewValue, totalProfit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                  {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}元
                </Text>
              </View>
              
              <View style={styles.overviewDivider} />
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>收益率</Text>
                <Text style={[styles.overviewValue, parseFloat(totalProfitRate) >= 0 ? styles.profitPositive : styles.profitNegative]}>
                  {parseFloat(totalProfitRate) >= 0 ? '+' : ''}{totalProfitRate}
                </Text>
              </View>
            </LinearGradient>
          </View>
          
          {/* 持仓列表 */}
          <View style={styles.holdingsSection}>
           <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的持仓</Text>
           </View>
            {holdings && holdings.length > 0 ? (
              <FlatList
                data={holdings}
                renderItem={renderHoldingItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.holdingsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="account-balance-wallet" size={50} color="#ccc" />
                <Text style={styles.emptyText}>暂无持仓</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.md,
    paddingBottom: theme.SPACING.xl,
    width: '100%',
    alignItems: 'center'
  },
  notLoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.xl,
  },
  notLoginText: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginTop: theme.SPACING.md,
  },
  notLoginSubText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.md,
    color: theme.COLORS.textMuted,
    fontSize: theme.FONT_SIZES.md,
  },
  loginButton: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.sm,
    minWidth: 150,
  },
  loginButtonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold
  },
  overviewSection: {
    width: '100%',
    marginBottom: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...theme.SHADOWS.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.backgroundLight,
    paddingHorizontal: theme.SPACING.sm,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.md,
  },
  analysisButtonText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.primary,
    marginRight: theme.SPACING.xs,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.SPACING.md,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.SPACING.md,
  },
  overviewDivider: {
    width: 1,
    height: '60%',
    backgroundColor: theme.COLORS.borderLight,
  },
  overviewLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.xs,
    textAlign: 'center',
  },
  overviewValue: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    textAlign: 'center',
  },
  holdingsSection: {
    width: '100%',
    marginTop: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: theme.COLORS.white,
    ...theme.SHADOWS.md,
  },
  holdingsList: {
    padding: theme.SPACING.sm,
  },
  holdingItem: {
    width: '100%',
    marginBottom: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
  },
  holdingItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.SPACING.md,
  },
  holdingContent: {
    flex: 1,
  },
  holdingName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs,
  },
  holdingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.xs,
  },
  holdingInfoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.text,
  },
  profitPositive: {
    color: theme.COLORS.success,
  },
  profitNegative: {
    color: theme.COLORS.error,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.xl,
  },
  emptyText: {
    marginTop: theme.SPACING.sm,
    color: theme.COLORS.textLight,
    fontSize: theme.FONT_SIZES.md,
  },
  bottomPadding: {
    height: 120 // 增加底部填充高度，确保内容可以滚动到底部导航栏上方
  },
});

export default AssetsScreen;