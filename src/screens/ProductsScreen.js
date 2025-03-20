import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Icon, SearchBar, Chip } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, resetFilters, selectProducts, selectProductFilters, selectProductLoading } from '../store';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';

const ProductsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const products = useSelector(selectProducts);
  const filters = useSelector(selectProductFilters);
  const isLoading = useSelector(selectProductLoading);
  const dispatch = useDispatch();
  
  // 风险等级选项
  const riskLevels = ['全部', '低风险', '中风险', '中高风险', '高风险'];
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 筛选产品
  const filterProducts = async (riskLevel) => {
    const filter = riskLevel === '全部' ? {} : { riskLevel };
    await dispatch(fetchProducts(filter));
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
  
  // 渲染产品项
  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productInfoRow}>
          <View style={styles.productInfoItem}>
            <Text style={styles.infoLabel}>预期收益</Text>
            <Text style={styles.infoValue}>{item.expectedReturn}</Text>
          </View>
          <View style={styles.productInfoItem}>
            <Text style={styles.infoLabel}>风险等级</Text>
            <Text style={styles.infoValue}>{item.riskLevel}</Text>
          </View>
          <View style={styles.productInfoItem}>
            <Text style={styles.infoLabel}>投资期限</Text>
            <Text style={styles.infoValue}>{item.investmentTerm}</Text>
          </View>
          <View style={styles.productInfoItem}>
            <Text style={styles.infoLabel}>最低投资</Text>
            <Text style={styles.infoValue}>¥{item.minInvestment}</Text>
          </View>
        </View>
      </View>
      <Icon name="chevron-right" type="material" size={20} color={theme.COLORS.textLight} />
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
            // 移除round属性，它会覆盖底部边框
          />
          
          {/* 风险等级筛选 */}
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {riskLevels.map((level, index) => (
                <Chip
                  key={index}
                  title={level}
                  type={filters.riskLevel === level || (level === '全部' && !filters.riskLevel) ? 'solid' : 'outline'}
                  onPress={() => filterProducts(level)}
                  containerStyle={styles.filterChip}
                  buttonStyle={{
                    backgroundColor: filters.riskLevel === level || (level === '全部' && !filters.riskLevel) 
                      ? theme.COLORS.primary 
                      : 'transparent'
                  }}
                  titleStyle={{
                    color: filters.riskLevel === level || (level === '全部' && !filters.riskLevel) 
                      ? theme.COLORS.white 
                      : theme.COLORS.primary
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
      
      {/* 产品列表 */}
      <FlatList
        data={searchProducts()}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={50} color="#ccc" />
            <Text style={styles.emptyText}>未找到产品</Text>
          </View>
        }
        ListFooterComponent={<View style={styles.bottomPadding} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight
  },
  gradientBackground: {
    width: '100%',
    paddingBottom: theme.SPACING.sm
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
    height: theme.getResponsiveSize(40, 45, 50),
    borderRadius: theme.BORDER_RADIUS.md,
    borderWidth: 0.5,
    borderColor: theme.COLORS.primaryLight
  },
  filterScrollContainer: {
    paddingVertical: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.xs
  },
  chipContainer: {
    marginRight: theme.SPACING.sm,
    marginBottom: theme.SPACING.xs
  },
  productsList: {
    paddingBottom: theme.SPACING.xxxl, // 确保底部有足够空间
    paddingHorizontal: theme.SPACING.sm
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.xs,
  },
  productInfoItem: {
    width: '48%',
    marginBottom: theme.SPACING.xs,
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
  filterContainer: {
    marginVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
  },
  filterScrollContent: {
    paddingVertical: theme.SPACING.sm,
  },
  filterChip: {
    marginRight: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
  },
  bottomPadding: {
    height: 80 // 确保底部有足够的空间，使内容可以滚动到底部导航栏上方
  }
});

export default ProductsScreen;