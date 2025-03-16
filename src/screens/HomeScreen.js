import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, FlatList, useWindowDimensions, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Icon, SearchBar, Chip, Card, Badge, Divider } from '@rneui/themed';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { getRecommendedProducts } from '../services/recommendService';

// 导入统一主题
import theme from '../utils/theme';

const HomeScreen = ({ navigation }) => {
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
  const riskLevels = ['全部', '低风险', '中风险', '中高风险', '高风险'];
  
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
  
  // 渲染产品项
  renderProductItem = ({ item }) => {
    // 根据风险等级设置标签颜色
    let riskColor = theme.COLORS.success;
    if (item.riskLevel === '中风险') {
      riskColor = theme.COLORS.warning;
    } else if (item.riskLevel === '中高风险') {
      riskColor = theme.COLORS.accent;
    } else if (item.riskLevel === '高风险') {
      riskColor = theme.COLORS.error;
    }
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => navigateToProductDetail(item.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.productCardGradient}
        >
          <View style={styles.productCardHeader}>
            <Text style={styles.productName}>{item.name}</Text>
            <Badge 
              value={item.riskLevel} 
              badgeStyle={[styles.riskBadge, {backgroundColor: riskColor}]}
              textStyle={styles.riskBadgeText}
            />
          </View>
          
          <View style={styles.productCardBody}>
            <View style={styles.productInfoItem}>
              <Text style={styles.infoLabel}>预期收益</Text>
              <Text style={[styles.infoValue, styles.returnValue]}>{item.expectedReturn}</Text>
            </View>
            
            <View style={styles.productInfoRow}>
              <View style={styles.productInfoItem}>
                <Text style={styles.infoLabel}>投资期限</Text>
                <Text style={styles.infoValue}>{item.investmentTerm}</Text>
              </View>
              
              <View style={styles.productInfoItem}>
                <Text style={styles.infoLabel}>起投金额</Text>
                <Text style={styles.infoValue}>¥{item.minInvestment}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.productCardFooter}>
            <Button
              title="立即投资"
              buttonStyle={styles.investButton}
              titleStyle={styles.investButtonText}
              onPress={() => navigateToProductDetail(item.id)}
            />
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
  const renderBannerItem = (item, index) => (
    <TouchableOpacity 
      style={[styles.bannerItem, {width}]}
      onPress={() => navigateToProductDetail(item.id)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[item.backgroundColor, `${item.backgroundColor}99`]}
        style={styles.bannerGradient}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
            <Button
              title="了解详情"
              buttonStyle={styles.bannerButton}
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
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientBackground}
      >
        {/* 搜索栏 */}
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
        >
          {/* 轮播广告 */}
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
          
          {/* 热门推荐 */}
          <View style={styles.recommendSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>热门推荐</Text>
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
                            item.riskLevel === '中高风险' ? theme.COLORS.accent :
                            theme.COLORS.error
                        }]}
                        textStyle={styles.recommendRiskText}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* 查看更多按钮 - 新行显示 */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProductsScreen')}
              style={styles.viewMoreButtonRow}
            >
              <Text style={styles.viewMoreText}>查看更多</Text>
              <Icon name="chevron-right" type="material" size={16} color={theme.COLORS.primary} />
            </TouchableOpacity>
          </View>
          {/* 风险等级筛选 */}
          <View style={styles.filterContainer}>
            <Text style={styles.sectionTitle}>理财产品</Text>
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
          
          {/* 产品列表 */}
          <View style={styles.productListContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text>加载中...</Text>
              </View>
            ) : searchProducts().length > 0 ? (
              searchProducts().map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.productItemContainer}
                  onPress={() => navigateToProductDetail(item.id)}
                  activeOpacity={0.7}
                >
                  {renderProductItem({item})}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无产品</Text>
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
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    paddingHorizontal: theme.SPACING.sm,
    paddingTop: theme.SPACING.sm,
    paddingBottom: theme.SPACING.xs,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    marginBottom: theme.SPACING.xs
  },
  searchBarInputContainer: {
    backgroundColor: theme.COLORS.white,
    height: 40,
    borderRadius: theme.BORDER_RADIUS.md,
    borderWidth: 0.5,
    borderColor: theme.COLORS.primaryLight
  },
  filterContainer: {
    marginVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
  },
  filterScrollContent: {
    paddingVertical: theme.SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.xs,
    marginRight: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.xl,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
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
  filterChip: {
    marginRight: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: theme.SPACING.md,
    paddingBottom: theme.SPACING.xxxl, // 确保底部有足够空间
    width: '100%'
  },
  section: {
    marginBottom: theme.SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.SPACING.md,
    marginBottom: theme.SPACING.sm,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.primary,
    marginRight: 2,
  },
  productsList: {
    paddingHorizontal: theme.SPACING.md,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    marginBottom: theme.SPACING.sm,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm,
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs,
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.xs,
  },
  productInfoItem: {
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
  bottomPadding: {
    height: 60, // 底部导航栏的高度
  },
  bannerContainer: {
    height: 180,
    marginBottom: theme.SPACING.md,
  },
  bannerItem: {
    height: 180,
  },
  bannerGradient: {
    flex: 1,
    borderRadius: theme.BORDER_RADIUS.md,
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
    marginBottom: theme.SPACING.xs,
  },
  bannerSubtitle: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.md,
  },
  bannerButton: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.md,
    alignSelf: 'flex-start',
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
  },
  recommendSection: {
    marginVertical: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.sm,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.SPACING.sm,
    marginTop: theme.SPACING.xs,
    backgroundColor: theme.COLORS.backgroundLight,
    borderRadius: theme.BORDER_RADIUS.md,
  },
  viewMoreText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.primary,
    marginRight: theme.SPACING.xxs,
  },
  recommendScrollContent: {
    paddingVertical: theme.SPACING.sm,
    paddingRight: theme.SPACING.md,
    paddingLeft: theme.SPACING.xs,
  },
  recommendCard: {
    width: 160,
    height: 180,
    marginRight: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
  },
  recommendCardGradient: {
    flex: 1,
    padding: theme.SPACING.md,
    justifyContent: 'space-between',
  },
  recommendProductName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.md,
  },
  recommendReturn: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.success,
    marginBottom: theme.SPACING.xxs,
  },
  recommendLabel: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.md,
  },
  recommendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendTerm: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
  },
  recommendRiskBadge: {
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingHorizontal: theme.SPACING.xs,
  },
  recommendRiskText: {
    fontSize: theme.FONT_SIZES.xxs,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  productListContainer: {
    paddingHorizontal: theme.SPACING.md,
    paddingBottom: theme.SPACING.xxxl,
  },
  productItemContainer: {
    marginBottom: theme.SPACING.md,
  },
  productCard: {
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    ...theme.SHADOWS.sm,
  },
  productCardGradient: {
    padding: theme.SPACING.sm, // 减小内边距从md到sm
  },
  productCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs, // 减小底部间距从sm到xs
  },
  productCardBody: {
    marginBottom: theme.SPACING.sm, // 减小底部间距从md到sm
  },
  productCardFooter: {
    alignItems: 'center',
  },
  riskBadge: {
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingHorizontal: theme.SPACING.xs, // 减小水平内边距从sm到xs
  },
  riskBadgeText: {
    fontSize: theme.FONT_SIZES.xxs, // 减小字体大小从xs到xxs
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  productName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: 0, // 移除底部间距
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.xxs, // 减小顶部间距从xs到xxs
  },
  productInfoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.FONT_SIZES.xxs, // 减小字体大小从xs到xxs
    color: theme.COLORS.textLight,
    marginBottom: 1, // 减小底部间距从2到1
  },
  infoValue: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.text,
  },
  returnValue: {
    color: theme.COLORS.success,
    fontSize: theme.FONT_SIZES.md, // 减小字体大小从lg到md
    fontWeight: theme.FONT_WEIGHTS.bold,
  },
  investButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.xs, // 减小垂直内边距从sm到xs
    paddingHorizontal: theme.SPACING.md, // 减小水平内边距从lg到md
  },
  investButtonText: {
    fontSize: theme.FONT_SIZES.sm, // 减小字体大小从md到sm
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  loadingContainer: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
  },
});

export default HomeScreen;