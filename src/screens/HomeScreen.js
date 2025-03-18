import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, SafeAreaView, useWindowDimensions, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Icon, SearchBar, Chip, Card, Badge, Divider } from '@rneui/themed';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { getRecommendedProducts } from '../services/recommendService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 导入统一主题
import theme, { getResponsiveSize } from '../utils/theme';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  // 使用useWindowDimensions钩子获取当前窗口尺寸，实现响应式布局
  const { width, height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { user } = useAuthStore();
  const { products, fetchProducts, filters, isLoading } = useProductStore();
  
  // 轮播图状态
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef(null);
  
  // 轮播图数据
  const banners = [
    {
      id: 1,
      title: '新手专享理财产品',
      subtitle: '首次投资享8.8%年化收益',
      backgroundColor: theme.COLORS.primary,
      imageUrl: 'https://example.com/banner1.png'
    },
    {
      id: 2,
      title: '稳健理财90天',
      subtitle: '低风险，稳定收益',
      backgroundColor: theme.COLORS.secondary,
      imageUrl: 'https://example.com/banner2.png'
    },
    {
      id: 3,
      title: '创新科技基金',
      subtitle: '高风险，高回报',
      backgroundColor: theme.COLORS.accent,
      imageUrl: 'https://example.com/banner3.png'
    }
  ];
  
  // 轮播图自动滚动
  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (currentBannerIndex + 1) % banners.length;
        scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentBannerIndex(nextIndex);
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [currentBannerIndex, width]);
  
  // 处理轮播图滚动事件
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentBannerIndex) {
      setCurrentBannerIndex(index);
    }
  };
  
  // 风险等级选项
  const riskLevels = ['全部', '低风险', '中风险', '高风险'];
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    
    // 请求产品数据
    await fetchProducts();
    
    // 获取热门推荐产品
    const recommendResult = await getRecommendedProducts();
    if (recommendResult.success) {
      setRecommendedProducts(recommendResult.products);
    }
    
    setRefreshing(false);
  };
  
  // 筛选产品
  const filterProducts = async (riskLevel) => {
    const filter = riskLevel === '全部' ? {} : { riskLevel };
    await fetchProducts(filter);
  };
  
  // 搜索产品
  const searchProducts = () => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 跳转到产品详情
  const navigateToProductDetail = (productId) => {
    console.log('Navigating to product detail with ID:', productId);
    navigation.navigate('ProductDetail', { productId });
  };
  
  // 渲染产品项 - 响应式设计
  const renderProductItem = ({ item }) => {
    // 根据风险等级设置标签颜色
    let riskColor = theme.COLORS.success;
    if (item.riskLevel === '中风险') {
      riskColor = theme.COLORS.warning;
    } else if (item.riskLevel === '高风险') {
      riskColor = theme.COLORS.error;
    }
    
    // 根据屏幕宽度调整字体大小 (使用组件顶层已定义的width)
    const nameFontSize = width < 350 ? theme.FONT_SIZES.sm : theme.FONT_SIZES.md;
    const valueFontSize = width < 350 ? theme.FONT_SIZES.md : theme.FONT_SIZES.lg;
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => navigateToProductDetail(item.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={theme.GRADIENTS.card}
          style={styles.productCardGradient}
        >
          <View style={styles.productCardHeader}>
            <Text style={[styles.productName, {fontSize: nameFontSize}]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Badge 
              value={item.riskLevel} 
              badgeStyle={[styles.riskBadge, {backgroundColor: riskColor}]}
              textStyle={styles.riskBadgeText}
            />
          </View>
          
          <View style={styles.productCardBody}>
            <View style={styles.productInfoRow}>
              <Text style={styles.infoLabel}>预期收益</Text>
              <Text style={[styles.infoValue, styles.returnValue, {fontSize: valueFontSize}]}>{item.expectedReturn}</Text>
            </View>
            
            <View style={styles.productInfoRow}>
              <Text style={styles.infoLabel}>投资期限</Text>
              <Text style={styles.infoValue}>{item.investmentTerm}</Text>
            </View>
            
            <View style={styles.productInfoRow}>
              <Text style={styles.infoLabel}>最低投资</Text>
              <Text style={styles.infoValue}>¥{item.minInvestment}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  // 渲染轮播指示器
  const renderBannerIndicator = () => {
    return (
      <View style={styles.bannerIndicator}>
        {banners.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.bannerDot,
              index === currentBannerIndex && styles.bannerDotActive
            ]}
          />
        ))}
      </View>
    );
  };
  
  // 渲染轮播项
  const renderBannerItem = (item, index) => {
    // 根据屏幕宽度计算响应式样式
    const titleSize = getResponsiveSize(theme.FONT_SIZES.lg, theme.FONT_SIZES.xl, theme.FONT_SIZES.xxl);
    const subtitleSize =  getResponsiveSize(theme.FONT_SIZES.sm, theme.FONT_SIZES.md,  theme.FONT_SIZES.lg);
    const buttonPadding = width < 380 ? theme.SPACING.xxs : theme.SPACING.xs;
    
    return (
      <TouchableOpacity 
        style={[styles.bannerItem, {width}]}
        onPress={() => navigateToProductDetail(item.id)}
        activeOpacity={0.9}
        key={item.id}
      >
        <LinearGradient
          colors={[item.backgroundColor, `${item.backgroundColor}99`]}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={[styles.bannerTitle, {fontSize: titleSize}]}>{item.title}</Text>
              <Text style={[styles.bannerSubtitle, {fontSize: subtitleSize}]}>{item.subtitle}</Text>
              <Button
                title="了解详情"
                buttonStyle={[styles.bannerButton, {paddingVertical: buttonPadding}]}
                titleStyle={styles.bannerButtonText}
                onPress={() => navigateToProductDetail(1)}
              />
            </View>
            <View style={styles.bannerImageContainer}>
              {/* 这里可以放置轮播图片 */}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
    <View style={styles.container}>
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientBackground}
      >
        {/* 搜索栏 - 优化样式 */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="搜索产品..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            lightTheme
            round
          />
        </View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.COLORS.primary]}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* 轮播广告 - 优化样式 */}
          <View style={styles.bannerContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {banners.map((item, index) => renderBannerItem(item, index))}
            </ScrollView>
            {renderBannerIndicator()}
          </View>
          
          {/* 热门推荐 - 优化样式 */}
          <View style={styles.recommendSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>热门推荐</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ProductsScreen')}
                style={styles.viewMoreButton}
              >
                <Text style={styles.viewMoreText}>查看更多</Text>
                <Icon name="chevron-right" type="material" size={16} color={theme.COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendScrollContent}
            >
              {recommendedProducts.map((item, index) => (
                <TouchableOpacity 
                  key={item.id}
                  style={[styles.recommendCard, {width: Math.min(160, width * 0.45)}]}
                  onPress={() => navigateToProductDetail(item.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[theme.COLORS.backgroundLight, theme.COLORS.white]}
                    style={styles.recommendCardGradient}
                  >
                    <Text style={styles.recommendProductName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={styles.recommendReturn}>{item.expectedReturn}</Text>
                    <Text style={styles.recommendLabel}>预期收益</Text>
                    <View style={styles.recommendFooter}>
                      <Text style={styles.recommendTerm}>{item.investmentTerm}</Text>
                      <Badge 
                        value={item.riskLevel} 
                        badgeStyle={[styles.recommendRiskBadge, {
                          backgroundColor: 
                            item.riskLevel === '低风险' ? theme.COLORS.success :
                            item.riskLevel === '中风险' ? theme.COLORS.warning :
                            theme.COLORS.error
                        }]}
                        textStyle={styles.recommendRiskText}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* 风险等级筛选 - 优化样式 */}
          <View style={styles.filterContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>理财产品</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {riskLevels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterButton,
                    filters.riskLevel === level || (level === '全部' && !filters.riskLevel) 
                      ? styles.filterButtonActive 
                      : styles.filterButtonInactive
                  ]}
                  onPress={() => filterProducts(level)}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[
                      styles.filterButtonText,
                      filters.riskLevel === level || (level === '全部' && !filters.riskLevel) 
                        ? styles.filterButtonTextActive 
                        : styles.filterButtonTextInactive
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* 产品列表 - 响应式布局 */}
          <View style={styles.productListContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text>加载中...</Text>
              </View>
            ) : (() => {
              const filteredProducts = searchProducts();
              return filteredProducts.length > 0 ? (
                filteredProducts.map(item => (
                  <View 
                    key={item.id} 
                    style={styles.productItemContainer}
                  >
                    {renderProductItem({item})}
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无产品</Text>
                </View>
              );
            })()}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    paddingHorizontal: theme.SPACING.md,
    paddingTop: theme.SPACING.xs,
    paddingBottom: theme.SPACING.md, // 增加底部内边距，确保边框完全显示
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    marginBottom: theme.SPACING.sm,
    height: 50, // 设置固定高度
    overflow: 'visible', // 确保边框可见
  },
  searchBarInputContainer: {
    backgroundColor: theme.COLORS.white,
    height: 44,
    borderRadius: theme.BORDER_RADIUS.md,
    borderWidth: 2, // 增加边框宽度，使其更明显
    borderColor: theme.COLORS.primary, // 使用更深的蓝色，增强边框可见性
    ...theme.SHADOWS.sm,
  },
  // 轮播图样式优化
  bannerContainer: {
    height: 180,
    marginBottom: theme.SPACING.md,
    marginHorizontal: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
  },
  bannerItem: {
    height: 180,
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  bannerGradient: {
    flex: 1,
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.sm,
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.lg,
    letterSpacing: 0.3,
  },
  bannerButton: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.md,
    alignSelf: 'flex-start',
    ...theme.SHADOWS.xs,
  },
  bannerButtonText: {
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  bannerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: theme.SPACING.sm,
    width: '100%',
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.COLORS.white + '80',
    marginHorizontal: 4,
  },
  bannerDotActive: {
    backgroundColor: theme.COLORS.white,
    width: 16, // 活动指示器宽度增加
    borderRadius: 4,
  },
  // 热门推荐样式优化
  recommendSection: {
    marginVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    letterSpacing: 0.5,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.SPACING.xxs,
    paddingHorizontal: theme.SPACING.xs,
  },
  viewMoreText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.primary,
    marginRight: theme.SPACING.xxs,
  },
  recommendScrollContent: {
    paddingVertical: theme.SPACING.xs,
    flex:1,
    justifyContent: 'space-between',
  },
  recommendCard: {
    width: 160,
    height: 120, // 减小高度，使卡片更紧凑
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
    elevation: 2,
  },
  recommendCardGradient: {
    flex: 1,
    padding: theme.SPACING.md, // 减小内边距，使内容更紧凑
    justifyContent: 'space-between',
  },
  recommendProductName: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xxs, // 减小底部间距
  },
  recommendReturn: {
    fontSize: theme.FONT_SIZES.md, // 减小字体大小
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.success,
    marginBottom: 0, // 移除底部间距
  },
  recommendLabel: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.xs, // 减小底部间距
  },
  recommendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.SPACING.xxs, // 添加顶部间距
  },
  recommendTerm: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
  },
  recommendRiskBadge: {
    borderRadius: theme.BORDER_RADIUS.xs,
    paddingHorizontal: theme.SPACING.xxs,
    height: 20,
  },
  recommendRiskText: {
    fontSize: 12, // 更小的字体
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  // 筛选区域样式优化
  filterContainer: {
    marginBottom: theme.SPACING.md,
    paddingTop: theme.SPACING.sm,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.xs,
  },
  filterScrollContent: {
    paddingVertical: theme.SPACING.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    marginRight: 0,
    borderRadius: 0,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.SHADOWS.xs,
  },
  filterButtonActive: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  filterButtonInactive: {
    backgroundColor: theme.COLORS.white,
    borderColor: theme.COLORS.border,
  },
  filterButtonText: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  filterButtonTextActive: {
    color: theme.COLORS.white,
  },
  filterButtonTextInactive: {
    color: theme.COLORS.textLight,
  },
  // 产品列表样式优化 - 响应式布局
  productListContainer: {
    paddingHorizontal: theme.SPACING.md,
    paddingBottom: theme.SPACING.xxxl,
    marginTop: 0, // 移除顶部间距
    flexDirection: 'column', // 改为列布局，一行一个产品
  },
  productItemContainer: {
    marginBottom: theme.SPACING.md, // 底部间距
    width: '100%', // 宽度占满整行
  },
  productCard: {
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
  },
  productCardGradient: {
    padding: theme.SPACING.sm, // 适当增加内边距
  },
  productCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xxs, // 减小底部间距
    paddingBottom: theme.SPACING.xxs,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  productCardBody: {
    marginVertical: theme.SPACING.xxs, // 减小上下间距
    flexDirection: 'row', // 改为横向布局
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfoItem: {
    marginBottom: theme.SPACING.xxs, // 减小底部间距
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.SPACING.xxs, // 减小顶部间距
  },
  infoLabel: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
    marginRight: theme.SPACING.xs, // 添加右侧间距
  },
  infoValue: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textDark,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  productName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    flex: 1,
    marginRight: theme.SPACING.xs,
  },
  returnValue: {
    color: theme.COLORS.success,
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
  },
  investButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingVertical: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.xs,
    elevation: 1,
  },
  investButtonText: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
    backgroundColor: theme.COLORS.backgroundLight,
    borderRadius: theme.BORDER_RADIUS.md,
    marginTop: theme.SPACING.md,
  },
  emptyText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
  },
});

export default HomeScreen;