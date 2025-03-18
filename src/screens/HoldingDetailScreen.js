import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Alert, StatusBar, SafeAreaView, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Icon, Divider, ListItem, Input } from '@rneui/themed';
import { useAssetStore } from '../store/assetStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { LineChart } from '../components/charts';
import theme from '../utils/theme';

const HoldingDetailScreen = ({ route, navigation }) => {
  const { holdingId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const { fetchProductDetail, currentProduct } = useProductStore();
  const { holdings, fetchHoldings, sellHolding, isLoading } = useAssetStore();
  const [currentHolding, setCurrentHolding] = useState(null);
  
  // 使用useWindowDimensions钩子获取屏幕尺寸
  const { width } = useWindowDimensions();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, [holdingId]);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    
    // 获取持仓列表
    const result = await fetchHoldings(user?.id || 1);
    
    if (result.success) {
      // 找到当前持仓
      const holding = result.holdings.find(h => h.id === holdingId);
      setCurrentHolding(holding);
      
      // 获取产品详情
      if (holding) {
        await fetchProductDetail(holding.productId);
      }
    }
    
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 状态管理 - 卖出相关
  const [sellAmount, setSellAmount] = useState('');
  const [showSellForm, setShowSellForm] = useState(false);

  // 处理卖出
  const handleSell = async () => {
    // 如果未显示卖出表单，则显示表单
    if (!showSellForm) {
      setShowSellForm(true);
      return;
    }
    
    // 验证输入金额
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('输入错误', '请输入有效的金额');
      return;
    }
    
    if (currentHolding && amount > currentHolding.currentValue) {
      Alert.alert('金额错误', `您的持仓价值为 ¥${currentHolding.currentValue.toFixed(2)}，不能卖出更多`);
      return;
    }
    
    Alert.alert(
      '确认卖出',
      `确定要卖出 ${currentHolding.productName} ¥${amount.toFixed(2)} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: async () => {
            const result = await sellHolding({
              userId: user?.id || 1,
              holdingId: currentHolding.id,
              amount: amount
            });
            
            if (result.success) {
              Alert.alert('卖出成功', '您已成功卖出该产品', [
                { text: '查看交易记录', onPress: () => navigation.navigate('TransactionRecords') },
                { text: '确定', onPress: () => {
                  setSellAmount('');
                  setShowSellForm(false);
                  navigation.goBack();
                }}
              ]);
            }
          } 
        }
      ]
    );
  };
  
  // 取消卖出
  const cancelSell = () => {
    setSellAmount('');
    setShowSellForm(false);
  };
  
  // 准备收益走势数据
  const prepareProfitTrendData = () => {
    if (!currentProduct || !currentProduct.historicalReturns) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = currentProduct.historicalReturns.map(item => item.date.substring(5)); // 只显示月份
    const data = currentProduct.historicalReturns.map(item => item.value);
    
    return {
      labels,
      datasets: [{ data }]
    };
  };
  
  // 计算持有天数
  const calculateHoldingDays = () => {
    if (!currentHolding) return 0;
    
    const purchaseDate = new Date(currentHolding.purchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today - purchaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // 如果持仓数据未加载，显示加载状态
  if (!currentHolding) {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* 持仓概览部分 */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{currentHolding.productName}</Text>
            <Divider style={styles.divider} />
        
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>持仓金额</Text>
                <Text style={styles.infoValue}>¥{currentHolding.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>当前价值</Text>
                <Text style={styles.infoValue}>¥{currentHolding.currentValue.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>累计收益</Text>
                <Text style={[styles.infoValue, { color: currentHolding.profit >= 0 ? theme.COLORS.success : theme.COLORS.error }]}>
                  {currentHolding.profit >= 0 ? '+' : ''}{currentHolding.profit.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>收益率</Text>
                <Text style={[styles.infoValue, { color: currentHolding.profit >= 0 ? theme.COLORS.success : theme.COLORS.error }]}>
                  {currentHolding.profitRate}
                </Text>
              </View>
            </View>
          </View>
      
          {/* 持仓详情部分 */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>持仓详情</Text>
            <Divider style={styles.divider} />
        
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>购买日期</Text>
              <Text style={styles.detailValue}>{currentHolding.purchaseDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>到期日期</Text>
              <Text style={styles.detailValue}>{currentHolding.expiryDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>已持有</Text>
              <Text style={styles.detailValue}>{calculateHoldingDays()}天</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>产品类型</Text>
              <Text style={styles.detailValue}>{currentProduct?.riskLevel || '未知'}</Text>
            </View>
          </View>
      
          {/* 收益走势图 */}
          {currentProduct && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>历史收益走势</Text>
              <Divider style={styles.divider} />
              <LineChart 
                data={prepareProfitTrendData()} 
                height={200}
                width={width * 0.85} // 设置图表宽度为屏幕宽度的85%
                yAxisSuffix="%"
              />
            </View>
          )}
          
          {/* 操作按钮 */}
          <View style={styles.sectionContainer}>
            {showSellForm ? (
              <View style={styles.sellFormContainer}>
                <Input
                  placeholder="请输入卖出金额"
                  keyboardType="numeric"
                  value={sellAmount}
                  onChangeText={setSellAmount}
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                  leftIcon={<Icon name="attach-money" type="material" size={20} color={theme.COLORS.error} />}
                />
                <Text style={styles.holdingText}>
                  当前持有: ¥{currentHolding.currentValue.toFixed(2)}
                </Text>
                <View style={styles.buttonRow}>
                  <Button
                    title="取消"
                    onPress={cancelSell}
                    buttonStyle={[styles.sellButton, styles.cancelButton]}
                    containerStyle={styles.buttonContainer}
                  />
                  <Button
                    title="确认卖出"
                    onPress={handleSell}
                    loading={isLoading}
                    buttonStyle={styles.sellButton}
                    containerStyle={styles.buttonContainer}
                    icon={<Icon name="monetization-on" color="white" style={{ marginRight: 10 }} />}
                  />
                </View>
              </View>
            ) : (
              <Button
                title="卖出产品"
                onPress={handleSell}
                loading={isLoading}
                buttonStyle={styles.sellButton}
                icon={<Icon name="monetization-on" color="white" style={{ marginRight: 10 }} />}
              />
            )}
          </View>
          
          {/* 底部填充，确保内容可以滚动到底部导航栏上方 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
        </KeyboardAvoidingView>
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
    paddingBottom: theme.SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.backgroundLight
  },
  sectionContainer: {
    marginBottom: theme.SPACING.lg,
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
    padding: theme.SPACING.sm,
    backgroundColor: 'rgba(239, 246, 255, 0.6)',
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.xs,
    marginHorizontal: theme.SPACING.xxs
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
  sellButton: {
    backgroundColor: theme.COLORS.error,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.sm,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  sellFormContainer: {
    width: '100%',
    paddingHorizontal: 16
  },
  inputContainer: {
    marginBottom: 8
  },
  inputText: {
    fontSize: 16
  },
  holdingText: {
    fontSize: 14,
    color: theme.COLORS.grey1,
    marginBottom: 16,
    textAlign: 'right'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 4
  },
  cancelButton: {
    backgroundColor: theme.COLORS.grey3
  },
  bottomPadding: {
    height: 80, // 确保底部有足够的空间，使内容可以滚动到底部导航栏上方
  }
});

export default HoldingDetailScreen;