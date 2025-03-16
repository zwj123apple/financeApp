import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Icon, ListItem, Divider } from '@rneui/themed';
import { useForumStore } from '../store/forumStore';
import { useAuthStore } from '../store/authStore';

const ForumScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { categories, fetchCategories, isLoading } = useForumStore();
  const { user } = useAuthStore();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 跳转到分类帖子列表
  const navigateToCategoryPosts = (categoryId, categoryName) => {
    navigation.navigate('ForumCategory', { categoryId, categoryName });
  };
  
  // 跳转到发帖页面
  const navigateToCreatePost = () => {
    if (!user) {
      // 如果用户未登录，跳转到登录页面
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('CreatePost');
  };
  
  // 渲染分类项
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigateToCategoryPosts(item.id, item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIconContainer}>
        <Icon name={item.icon} type="material" size={24} color={theme.COLORS.primary} />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
      </View>
      <View style={styles.categoryMeta}>
        <Text style={styles.postsCount}>{item.postsCount} 帖子</Text>
        <Icon name="chevron-right" type="material" size={20} color={theme.COLORS.textLight} />
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientBackground}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>论坛讨论</Text>
        </View>
      </LinearGradient>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.categoriesList}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="forum" size={50} color="#ccc" />
            <Text style={styles.emptyText}>暂无论坛分类</Text>
          </View>
        }
      />
      
      {/* 发帖按钮 */}
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={navigateToCreatePost}
      >
        <Icon name="add" type="material" color="#fff" size={30} />
      </TouchableOpacity>
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
  },
  headerContainer: {
    paddingHorizontal: theme.SPACING.md,
    paddingTop: theme.SPACING.lg,
    paddingBottom: theme.SPACING.md,
  },
  headerTitle: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
  },
  categoriesList: {
    paddingBottom: theme.SPACING.xxxl, // 确保底部有足够空间
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    padding: theme.SPACING.md,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.SPACING.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xxs,
  },
  categoryDescription: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postsCount: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginRight: theme.SPACING.xs,
  },
  divider: {
    backgroundColor: theme.COLORS.borderLight,
    marginHorizontal: theme.SPACING.md,
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
  createPostButton: {
    position: 'absolute',
    bottom: theme.SPACING.lg,
    right: theme.SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.SHADOWS.md,
  }
});

export default ForumScreen;