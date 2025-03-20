import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Text, Button, ListItem, Icon, Divider } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store';
import { fetchTransactions, resetTransactionFilters, selectTransactions, selectTransactionLoading, selectTransactionFilters } from '../store';
import { LineChart } from '../components/charts';
import { Dimensions, useWindowDimensions } from 'react-native';

// 移除静态Dimensions获取方式
// const screenWidth = Dimensions.get('window').width;

const TransactionRecordsScreen = ({ navigation }) => {
  // 使用Redux的useSelector替代useAuthStore
  const user = useSelector(selectUser);
  const transactions = useSelector(selectTransactions);
  const isLoading = useSelector(selectTransactionLoading);
  const transactionFilters = useSelector(selectTransactionFilters);
  const dispatch = useDispatch();
  
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const { width, height } = useWindowDimensions();
  
  // 筛选条件状态
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: ''
  });
  
  // 显示筛选面板状态
  const [showFilters, setShowFilters] = useState(false);
  
  // 加载交易记录
  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions({ userId: user.id }));
    }
  }, [user, dispatch]);
  
  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loginContainer}>
            <Text style={styles.sectionTitle}>您尚未登录</Text>
            <Divider style={styles.divider} />
            <Text style={styles.notLoginText}>登录后可查看交易记录</Text>
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
  
  // 应用筛选条件
  const applyFilters = () => {
    dispatch(fetchTransactions({ userId: user.id, filters }));
    setShowFilters(false);
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    const emptyFilters = {
      type: '',
      startDate: '',
      endDate: ''
    };
    setFilters(emptyFilters);
    if (user) {
      dispatch(resetTransactionFilters());
      dispatch(fetchTransactions({ userId: user.id }));
    }
    setShowFilters(false);
  };
  
  // 切换筛选类型
  const toggleType = (type) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        type: prev.type === type ? '' : type
      };
      // 立即应用筛选条件
      if (user) {
        dispatch(fetchTransactions({ userId: user.id, filters: newFilters }));
      }
      return newFilters;
    });
  };
  
  // 计算交易活跃度数据
  const getTransactionActivityData = () => {
    // 按月份分组交易
    const monthlyTransactions = {};
    
    transactions.forEach(transaction => {
      const month = transaction.date.substring(0, 7); // 获取YYYY-MM格式
      if (!monthlyTransactions[month]) {
        monthlyTransactions[month] = 0;
      }
      monthlyTransactions[month] += 1;
    });
    
    // 转换为图表数据格式
    const months = Object.keys(monthlyTransactions).sort();
    const counts = months.map(month => monthlyTransactions[month]);
    
    // 如果数据少于2个点，添加一些默认数据以便显示图表
    if (months.length < 2) {
      months.push(...['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'].slice(0, Math.max(2 - months.length, 0)));
      counts.push(...[0, 0].slice(0, Math.max(2 - counts.length, 0)));
    }
    
    return {
      labels: months.map(month => month.substring(5)), // 只显示MM部分
      datasets: [
        {
          data: counts,
          color: (opacity = 1) => `rgba(32, 137, 220, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };
  
  // 获取交易类型统计
  const getTransactionTypeStats = () => {
    const buyCount = transactions.filter(t => t.type === '买入').length;
    const sellCount = transactions.filter(t => t.type === '卖出').length;
    const total = transactions.length;
    
    return {
      buy: {
        count: buyCount,
        percentage: total > 0 ? Math.round(buyCount / total * 100) : 0
      },
      sell: {
        count: sellCount,
        percentage: total > 0 ? Math.round(sellCount / total * 100) : 0
      }
    };
  };
  
  const transactionStats = getTransactionTypeStats();
  const chartData = getTransactionActivityData();
  
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
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {/* 交易统计部分 */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>交易统计</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{transactions.length}</Text>
                <Text style={styles.statLabel}>总交易次数</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{transactionStats.buy.count}</Text>
                <Text style={styles.statLabel}>买入 ({transactionStats.buy.percentage}%)</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{transactionStats.sell.count}</Text>
                <Text style={styles.statLabel}>卖出 ({transactionStats.sell.percentage}%)</Text>
              </View>
            </View>
          </View>
          
          {/* 交易活跃度图表 */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>交易活跃度</Text>
            <Divider style={styles.divider} />
            
            <LineChart
              data={chartData}
              title="交易活跃度"
              height={220}
              width={width * 0.9}
              bezier
              yAxisSuffix="次"
            />
          </View>
          
          {/* 筛选器和交易记录 */}
          <View style={styles.sectionContainer}>
            <View style={styles.filterHeader}>
              <Text style={styles.sectionTitle}>交易记录</Text>
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                <Icon name="filter-list" type="material" color={theme.COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Divider style={styles.divider} />
        
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterSectionTitle}>交易类型</Text>
            <View style={styles.typeFilters}>
              <Button
                title="买入"
                type={filters.type === '买入' ? 'solid' : 'outline'}
                onPress={() => toggleType('买入')}
                buttonStyle={styles.filterButton}
                containerStyle={styles.filterButtonContainer}
              />
              <Button
                title="卖出"
                type={filters.type === '卖出' ? 'solid' : 'outline'}
                onPress={() => toggleType('卖出')}
                buttonStyle={styles.filterButton}
                containerStyle={styles.filterButtonContainer}
              />
            </View>
            
            <View style={styles.filterActions}>
              <Button
                title="应用筛选"
                onPress={applyFilters}
                buttonStyle={styles.applyButton}
                containerStyle={styles.actionButtonContainer}
              />
              <Button
                title="重置"
                type="outline"
                onPress={resetFilters}
                buttonStyle={styles.resetButton}
                containerStyle={styles.actionButtonContainer}
              />
            </View>
          </View>
        )}
        
            {/* 交易记录列表 */}
            {isLoading ? (
              <Text style={styles.loadingText}>加载中...</Text>
            ) : transactions.length === 0 ? (
              <Text style={styles.emptyText}>暂无交易记录</Text>
            ) : (
              <View style={styles.transactionList}>
                {transactions.map((transaction, index) => (
                  <TouchableOpacity 
                    key={transaction.id} 
                    style={styles.transactionItem}
                    onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.transactionHeader}>
                      <View style={styles.transactionIconContainer}>
                        <Icon
                          name={transaction.type === '买入' ? 'arrow-downward' : 'arrow-upward'}
                          type="material"
                          color={transaction.type === '买入' ? theme.COLORS.success : theme.COLORS.error}
                          size={20}
                        />
                      </View>
                      <View style={styles.transactionContent}>
                        <Text style={styles.transactionTitle}>
                          {transaction.productName}
                        </Text>
                        <Text style={styles.transactionSubtitle}>
                          {transaction.date} · {transaction.status}
                        </Text>
                      </View>
                      <Text
                        style={[styles.transactionAmount, transaction.type === '买入' ? styles.buyAmount : styles.sellAmount]}
                      >
                        {transaction.type === '买入' ? '-' : '+'}{transaction.amount}元
                      </Text>
                    </View>
                    <View style={styles.chevronContainer}>
                      <Icon name="chevron-right" size={20} color={theme.COLORS.textLight} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* 底部填充，确保内容可以滚动到底部导航栏上方 */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.SPACING.sm,
    paddingTop: theme.SPACING.md,
    paddingBottom: theme.SPACING.xl,
  },
  sectionContainer: {
    marginBottom: theme.SPACING.lg,
    padding: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.sm,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.SPACING.sm,
    overflow: 'visible', // 允许图表内容溢出，解决图表被覆盖问题
  },
  loginContainer: {
    margin: theme.SPACING.lg,
    padding: theme.SPACING.lg,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.SPACING.md
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.primary
  },
  statLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: theme.SPACING.xs
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.SPACING.xs,
    paddingVertical: theme.SPACING.xs
  },
  filtersContainer: {
    marginBottom: theme.SPACING.md
  },
  filterSectionTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    marginVertical: theme.SPACING.sm,
    marginLeft: theme.SPACING.sm
  },
  typeFilters: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: theme.SPACING.md
  },
  filterButtonContainer: {
    marginHorizontal: theme.SPACING.xs
  },
  filterButton: {
    paddingHorizontal: theme.SPACING.md
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.SPACING.sm
  },
  actionButtonContainer: {
    marginHorizontal: theme.SPACING.xs,
    width: '40%'
  },
  applyButton: {
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.primary
  },
  resetButton: {
    borderRadius: theme.BORDER_RADIUS.sm,
    borderColor: theme.COLORS.primary
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.lg,
    color: theme.COLORS.textLight
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.lg,
    color: theme.COLORS.textLight
  },
  transactionList: {
    marginTop: theme.SPACING.sm
  },
  transactionItem: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.sm,
    marginVertical: theme.SPACING.xs,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.COLORS.primary
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 246, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.SPACING.sm
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.text
  },
  transactionSubtitle: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: 2
  },
  transactionAmount: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.md
  },
  buyAmount: {
    color: theme.COLORS.error
  },
  sellAmount: {
    color: theme.COLORS.success
  },
  chevronContainer: {
    position: 'absolute',
    right: theme.SPACING.md,
    bottom: theme.SPACING.md,
  },
  bottomPadding: {
    height: 60// 增加底部填充高度，确保内容可以滚动到底部导航栏上方
  },

});

export default TransactionRecordsScreen;