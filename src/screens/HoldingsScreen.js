import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Animated, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Icon, ListItem, SearchBar, Divider } from '@rneui/themed';
import { useAssetStore } from '../store/assetStore';
import { useAuthStore } from '../store/authStore';
import theme from '../utils/theme';

const HoldingsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { user } = useAuthStore();
  const { holdings, fetchHoldings, isLoading } = useAssetStore();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 启动进入动画
  useEffect(() => {
    if (holdings) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
    }
  }, [holdings]);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    await fetchHoldings(user?.id || 1);
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 搜索持仓
  const searchHoldings = () => {
    if (!searchQuery.trim()) {
      return holdings;
    }
    
    return holdings.filter(holding => 
      holding.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // 导航到持仓详情
  const navigateToHoldingDetail = (holdingId) => {
    navigation.navigate('HoldingDetail', { holdingId });
  };
  
  // 渲染持仓项
  const renderHoldingItem = ({ item, index }) => (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50 + (index * 10), 0]
      }) }]
    }}>
      <TouchableOpacity 
        onPress={() => navigateToHoldingDetail(item.id)}
        activeOpacity={0.7}
        style={styles.holdingItem}
      >
        <View style={styles.holdingHeader}>
          <Text style={styles.productName}>{item.productName}</Text>
          <View style={styles.profitContainer}>
            <Text style={[styles.profitValue, { color: item.profit >= 0 ? theme.COLORS.success : theme.COLORS.error }]}>
              {item.profit >= 0 ? '+' : ''}{item.profit.toFixed(2)}
            </Text>
            <Text style={[styles.profitRate, { color: item.profit >= 0 ? theme.COLORS.success : theme.COLORS.error }]}>
              {item.profitRate}
            </Text>
          </View>
        </View>
        
        <Divider style={styles.itemDivider} />
        
        <View style={styles.holdingInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>购买金额</Text>
            <Text style={styles.infoValue}>¥{item.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>购买日期</Text>
            <Text style={styles.infoValue}>{item.purchaseDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>到期日期</Text>
            <Text style={styles.infoValue}>{item.expiryDate}</Text>
          </View>
        </View>
        
        <View style={styles.chevronContainer}>
          <Icon name="chevron-right" size={20} color={theme.COLORS.textLight} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 搜索栏 */}
          <SearchBar
            placeholder="搜索持仓..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            lightTheme
            // 移除round属性，它会覆盖底部边框
          />
          
          {/* 持仓列表 */}
          <FlatList
            data={searchHoldings()}
            renderItem={renderHoldingItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.holdingsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.COLORS.primary]} />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="account-balance-wallet" size={60} color={theme.COLORS.textMuted} />
                <Text style={styles.emptyText}>暂无持仓</Text>
                <Button
                  title="去选购产品"
                  onPress={() => navigation.navigate('Products')}
                  buttonStyle={styles.browseButton}
                  containerStyle={styles.browseButtonContainer}
                />
              </View>
            }
            ListFooterComponent={<View style={styles.bottomPadding} />}
          />
        </View>
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
    paddingTop: theme.SPACING.sm
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: theme.SPACING.md,
    marginBottom: theme.SPACING.sm,
    elevation: 0,
    shadowOpacity: 0
  },
  searchBarInputContainer: {
    backgroundColor: theme.COLORS.white,
    height: 44,
    borderRadius: theme.BORDER_RADIUS.lg,
    borderWidth: 0.5,
    borderColor: theme.COLORS.primaryLight
  },
  holdingsList: {
    paddingBottom: theme.SPACING.xl,
    paddingHorizontal: theme.SPACING.md
  },
  holdingItem: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    marginVertical: theme.SPACING.sm,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs,
  },
  productName: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.lg,
    color: theme.COLORS.primary,
    letterSpacing: 0.5,
    flex: 1,
  },
  itemDivider: {
    backgroundColor: theme.COLORS.borderLight,
    height: 1,
    marginVertical: theme.SPACING.sm,
  },
  holdingInfo: {
    marginTop: theme.SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.SPACING.xs,
  },
  infoLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.text,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  profitContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  profitValue: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.success,
  },
  profitRate: {
    fontSize: theme.FONT_SIZES.sm,
    marginTop: 2,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  chevronContainer: {
    position: 'absolute',
    right: theme.SPACING.md,
    bottom: theme.SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.SPACING.xxxl,
    backgroundColor: 'rgba(239, 246, 255, 0.3)',
    margin: theme.SPACING.lg,
    borderRadius: theme.BORDER_RADIUS.xl,
    padding: theme.SPACING.xl
  },
  emptyText: {
    marginTop: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
    color: theme.COLORS.textMuted,
    fontSize: theme.FONT_SIZES.lg,
    textAlign: 'center'
  },
  browseButtonContainer: {
    width: '60%',
    marginTop: theme.SPACING.sm
  },
  browseButton: {
    borderRadius: theme.BORDER_RADIUS.lg,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.sm,
    elevation: 2
  },
  bottomPadding: {
    height: 120, // 增加底部填充高度，确保内容可以滚动到底部导航栏上方
  }
});

export default HoldingsScreen;