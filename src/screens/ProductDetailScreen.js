import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Alert, SafeAreaView, StatusBar, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Icon, Divider, Input, Card, Badge } from '@rneui/themed';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { LineChart } from '../components/charts';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' 或 'sell'
  const { user } = useAuthStore();
  const { currentProduct, fetchProductDetail, purchaseProduct, sellProduct, isLoading } = useProductStore();
  
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const { width, height } = useWindowDimensions();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, [productId]);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    await fetchProductDetail(productId);
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 处理购买
  const handlePurchase = async () => {
    // 验证输入金额
    const amount = parseFloat(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('输入错误', '请输入有效的金额');
      return;
    }
    
    if (currentProduct && amount < currentProduct.minInvestment) {
      Alert.alert('金额不足', `最低投资金额为 ¥${currentProduct.minInvestment}`);
      return;
    }
    
    // 执行购买
    const result = await purchaseProduct({
      userId: user?.id || 1,
      productId: currentProduct.id,
      amount: amount
    });
    
    if (result.success) {
      Alert.alert('购买成功', '您已成功购买该产品', [
        { text: '查看持仓', onPress: () => navigation.navigate('Holdings') },
        { text: '确定', onPress: () => setPurchaseAmount('') }
      ]);
    }
  };
  
  // 处理卖出
  const handleSell = async () => {
    // 验证输入金额
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('输入错误', '请输入有效的金额');
      return;
    }
    
    // 这里应该获取用户的持仓信息，验证是否有足够的持仓可卖出
    // 简化处理，假设用户有该产品的持仓，且持仓ID为1
    const holdingId = 1;
    
    // 执行卖出
    const result = await sellProduct({
      userId: user?.id || 1,
      holdingId: holdingId,
      amount: amount
    });
    
    if (result.success) {
      Alert.alert('卖出成功', '您已成功卖出该产品', [
        { text: '查看交易记录', onPress: () => navigation.navigate('TransactionRecords') },
        { text: '确定', onPress: () => setSellAmount('') }
      ]);
    }
  };
  
  // 准备历史收益数据
  const prepareHistoricalReturnsData = () => {
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
  
  // 如果产品数据未加载，显示加载状态
  if (!currentProduct) {
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.COLORS.backgroundLight} />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* 产品基本信息区域 - 使用卡片设计 */}
          <Card containerStyle={styles.headerCard}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text h4 style={styles.productName}>{currentProduct.name}</Text>
                <Badge
                  value={currentProduct.riskLevel}
                  badgeStyle={styles.riskBadge}
                  textStyle={styles.riskBadgeText}
                />
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.returnLabel}>预期年化收益</Text>
                <Text style={styles.returnValue}>{currentProduct.expectedReturn}</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Icon name="schedule" type="material" size={20} color={theme.COLORS.primary} />
                <Text style={styles.infoLabel}>投资期限</Text>
                <Text style={styles.infoValue}>{currentProduct.investmentTerm}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="account-balance-wallet" type="material" size={20} color={theme.COLORS.primary} />
                <Text style={styles.infoLabel}>最低投资</Text>
                <Text style={styles.infoValue}>¥{currentProduct.minInvestment}</Text>
              </View>
            </View>
          </Card>
          
          {/* 历史收益走势图 - 增强视觉效果 */}
          <Card containerStyle={styles.chartCard}>
            <Card.Title style={styles.cardTitle}>历史收益走势</Card.Title>
            <Card.Divider />
            <LineChart 
              data={prepareHistoricalReturnsData()} 
              height={220}
              width={width * 0.85}
              yAxisSuffix="%"
              bezier={true}
            />
          </Card>
          
          {/* 产品详情区域 - 使用选项卡设计 */}
          <Card containerStyle={styles.detailCard}>
            <Card.Title style={styles.cardTitle}>产品详情</Card.Title>
            <Card.Divider />
            
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, styles.tabButtonLeft, 
                  { backgroundColor: activeTab === 'description' ? theme.COLORS.primary : theme.COLORS.backgroundLight }]}
                onPress={() => setActiveTab('description')}
              >
                <Text style={[styles.tabButtonText, 
                  { color: activeTab === 'description' ? theme.COLORS.white : theme.COLORS.textLight }]}>产品描述</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, styles.tabButtonMiddle, 
                  { backgroundColor: activeTab === 'assets' ? theme.COLORS.primary : theme.COLORS.backgroundLight }]}
                onPress={() => setActiveTab('assets')}
              >
                <Text style={[styles.tabButtonText, 
                  { color: activeTab === 'assets' ? theme.COLORS.white : theme.COLORS.textLight }]}>资产配置</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, styles.tabButtonRight, 
                  { backgroundColor: activeTab === 'fees' ? theme.COLORS.primary : theme.COLORS.backgroundLight }]}
                onPress={() => setActiveTab('fees')}
              >
                <Text style={[styles.tabButtonText, 
                  { color: activeTab === 'fees' ? theme.COLORS.white : theme.COLORS.textLight }]}>费用说明</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tabContent}>
              {activeTab === 'description' && (
                <Text style={styles.descriptionText}>{currentProduct.description}</Text>
              )}
              {activeTab === 'assets' && (
                <Text style={styles.descriptionText}>{currentProduct.assets}</Text>
              )}
              {activeTab === 'fees' && (
                <Text style={styles.descriptionText}>{currentProduct.fees}</Text>
              )}
            </View>
          </Card>
          
          {/* 交易区域 - 买入/卖出选项卡 */}
          <Card containerStyle={styles.tradeCard}>
            <Card.Title style={styles.cardTitle}>交易</Card.Title>
            <Card.Divider />
            
            <View style={styles.tradeTabContainer}>
              <TouchableOpacity 
                style={[styles.tradeTabButton, styles.tradeTabButtonLeft, 
                  { backgroundColor: activeTab === 'buy' ? theme.COLORS.primary : theme.COLORS.backgroundLight }]}
                onPress={() => setActiveTab('buy')}
              >
                <Text style={[styles.tradeTabButtonText, 
                  { color: activeTab === 'buy' ? theme.COLORS.white : theme.COLORS.textLight }]}>买入</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tradeTabButton, styles.tradeTabButtonRight, 
                  { backgroundColor: activeTab === 'sell' ? theme.COLORS.primary : theme.COLORS.backgroundLight }]}
                onPress={() => setActiveTab('sell')}
              >
                <Text style={[styles.tradeTabButtonText, 
                  { color: activeTab === 'sell' ? theme.COLORS.white : theme.COLORS.textLight }]}>卖出</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tradeContent}>
              {activeTab === 'buy' && (
                <>
                  <Input
                    placeholder="请输入买入金额"
                    keyboardType="numeric"
                    value={purchaseAmount}
                    onChangeText={setPurchaseAmount}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    leftIcon={<Icon name="attach-money" type="material" size={20} color={theme.COLORS.primary} />}
                  />
                  <Text style={styles.minInvestmentText}>
                    最低投资金额: ¥{currentProduct.minInvestment}
                  </Text>
                  <Button
                    title="确认买入"
                    onPress={handlePurchase}
                    loading={isLoading}
                    buttonStyle={styles.actionButton}
                    titleStyle={styles.actionButtonText}
                    icon={{
                      name: 'shopping-cart',
                      type: 'material',
                      size: 20,
                      color: 'white',
                    }}
                    iconRight
                  />
                </>
              )}
              
              {activeTab === 'sell' && (
                <>
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
                    当前持有: ¥10,000.00
                  </Text>
                  <Button
                    title="确认卖出"
                    onPress={handleSell}
                    loading={isLoading}
                    buttonStyle={[styles.actionButton, { backgroundColor: theme.COLORS.error }]}
                    titleStyle={styles.actionButtonText}
                    icon={{
                      name: 'monetization-on',
                      type: 'material',
                      size: 20,
                      color: 'white',
                    }}
                    iconRight
                  />
                </>
              )}
            </View>
          </Card>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingVertical: theme.SPACING.md,
    paddingHorizontal: 0,
    paddingBottom: theme.SPACING.xl,
    width: '100%',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // 卡片样式
  headerCard: {
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.md,
    borderWidth: 0,
    width: '92%',
    alignSelf: 'center'
  },
  chartCard: {
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.md,
    borderWidth: 0,
    width: '92%',
    alignSelf: 'center'
  },
  detailCard: {
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.md,
    borderWidth: 0,
    width: '92%',
    alignSelf: 'center'
  },
  tradeCard: {
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.md,
    borderWidth: 0,
    width: '92%',
    alignSelf: 'center'
  },
  cardTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    textAlign: 'left',
    marginBottom: 0
  },
  // 头部信息样式
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
    width: '100%'
  },
  headerLeft: {
    flex: 1.5,
    paddingRight: theme.SPACING.sm
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  productName: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs
  },
  riskBadge: {
    backgroundColor: theme.COLORS.warning,
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingHorizontal: theme.SPACING.sm
  },
  riskBadgeText: {
    fontSize: theme.FONT_SIZES.xs,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  returnLabel: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.xs
  },
  returnValue: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.success
  },
  // 基本信息行
  divider: {
    marginBottom: theme.SPACING.md
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.SPACING.md
  },
  infoItem: {
    alignItems: 'center',
    flex: 1
  },
  infoLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: theme.SPACING.xs
  },
  infoValue: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    marginTop: theme.SPACING.xs,
    color: theme.COLORS.textDark
  },
  // 产品详情选项卡
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: theme.COLORS.backgroundLight
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabButtonLeft: {
    borderTopLeftRadius: theme.BORDER_RADIUS.md,
    borderBottomLeftRadius: theme.BORDER_RADIUS.md
  },
  tabButtonMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.COLORS.backgroundLight
  },
  tabButtonRight: {
    borderTopRightRadius: theme.BORDER_RADIUS.md,
    borderBottomRightRadius: theme.BORDER_RADIUS.md
  },
  tabButtonText: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  tabContent: {
    padding: theme.SPACING.sm
  },
  descriptionText: {
    lineHeight: 22,
    color: theme.COLORS.text
  },
  // 交易选项卡
  tradeTabContainer: {
    flexDirection: 'row',
    marginBottom: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: theme.COLORS.backgroundLight
  },
  tradeTabButton: {
    flex: 1,
    paddingVertical: theme.SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tradeTabButtonLeft: {
    borderTopLeftRadius: theme.BORDER_RADIUS.md,
    borderBottomLeftRadius: theme.BORDER_RADIUS.md
  },
  tradeTabButtonRight: {
    borderTopRightRadius: theme.BORDER_RADIUS.md,
    borderBottomRightRadius: theme.BORDER_RADIUS.md
  },
  tradeTabButtonText: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  tradeContent: {
    padding: theme.SPACING.md
  },
  // 输入框和按钮
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.sm,
    marginBottom: theme.SPACING.sm
  },
  inputText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textDark
  },
  minInvestmentText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.md,
    marginLeft: theme.SPACING.sm
  },
  holdingText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.md,
    marginLeft: theme.SPACING.sm
  },
  actionButton: {
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.md,
    backgroundColor: theme.COLORS.primary,
    ...theme.SHADOWS.sm
  },
  actionButtonText: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  bottomPadding: {
    height: 80 // 增加底部填充空间，确保内容可以滚动到底部导航栏上方
  }
});

export default ProductDetailScreen;