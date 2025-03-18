import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Alert, SafeAreaView, StatusBar, Animated, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [activeTab, setActiveTab] = useState('description');
  const { user } = useAuthStore();
  const { currentProduct, fetchProductDetail, purchaseProduct, isLoading } = useProductStore();
  
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const { width, height } = useWindowDimensions();
  
  // 动画值
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // 初始加载数据
  useEffect(() => {
    loadData();
    
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
      })
    ]).start();
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
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      </LinearGradient>
    );
  }
  
  // 根据风险等级设置标签颜色
  let riskColor = theme.COLORS.success;
  if (currentProduct.riskLevel === '中风险') {
    riskColor = theme.COLORS.warning;
  } else if (currentProduct.riskLevel === '中高风险') {
    riskColor = theme.COLORS.accent;
  } else if (currentProduct.riskLevel === '高风险') {
    riskColor = theme.COLORS.error;
  }
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.COLORS.primary]} />}
        >
          {/* 产品基本信息区域 - 使用卡片设计 */}
          <Animated.View style={[styles.card, styles.headerCard, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.productName}>{currentProduct.name}</Text>
                <Badge
                  value={currentProduct.riskLevel}
                  badgeStyle={[styles.riskBadge, {backgroundColor: riskColor}]}
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
          </Animated.View>
          
          {/* 历史收益走势图 - 增强视觉效果 */}
          <Animated.View style={[styles.card, styles.chartCard, {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [100, 0]}) }]
          }]}>
            <Text style={styles.cardTitle}>历史收益走势</Text>
            <Divider style={styles.divider} />
            <View style={styles.chartWrapper}>
              <LineChart 
                data={prepareHistoricalReturnsData()} 
                height={220}
                width={width * 0.85}
                yAxisSuffix="%"
                bezier={true}
              />
            </View>
          </Animated.View>
          
          {/* 产品详情区域 - 使用选项卡设计 */}
          <Animated.View style={[styles.card, styles.detailCard, {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [150, 0]}) }]
          }]}>
            <Text style={styles.cardTitle}>产品详情</Text>
            <Divider style={styles.divider} />
            
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
          </Animated.View>
          
          {/* 交易区域 - 买入选项卡 */}
          <Animated.View style={[styles.card, styles.tradeCard, {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [200, 0]}) }]
          }]}>
            <Text style={styles.cardTitle}>交易</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.tradeContent}>
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
            </View>
          </Animated.View>
          
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
    alignItems: 'center',
    height: 300
  },
  // 卡片通用样式
  card: {
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    marginHorizontal: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    ...theme.SHADOWS.md,
    width: '92%',
    alignSelf: 'center'
  },
  // 头部卡片样式
  headerCard: {
    marginTop: theme.SPACING.sm,
  },
  chartCard: {
    paddingBottom: theme.SPACING.lg,
  },
  detailCard: {},
  tradeCard: {
    marginBottom: theme.SPACING.xl,
  },
  cardTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs
  },
  // 头部信息样式
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    marginBottom: theme.SPACING.md,
    backgroundColor: theme.COLORS.primaryLight,
    opacity: 0.5,
    height: 1
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.SPACING.sm
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
  // 图表样式
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.SPACING.sm
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
    padding: theme.SPACING.md,
    backgroundColor: theme.COLORS.backgroundLight,
    borderRadius: theme.BORDER_RADIUS.md
  },
  descriptionText: {
    lineHeight: 22,
    color: theme.COLORS.text,
    fontSize: theme.FONT_SIZES.sm
  },
  // 交易区域
  tradeContent: {
    padding: theme.SPACING.sm
  },
  // 输入框和按钮
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.sm,
    marginBottom: theme.SPACING.sm,
    backgroundColor: theme.COLORS.white
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