import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Text, Icon, ListItem, Button, Divider } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../utils/theme';
import { useForumStore } from '../store/forumStore';

const ForumCategoryScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const { posts, pagination, fetchCategoryPosts, isLoading } = useForumStore();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
  }, [categoryId]);
  
  // 加载数据函数
  const loadData = async (page = 1) => {
    setRefreshing(true);
    await fetchCategoryPosts(categoryId, page);
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData(1);
  };
  
  // 加载更多
  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      loadData(pagination.page + 1);
    }
  };
  
  // 跳转到帖子详情
  const navigateToPostDetail = (postId) => {
    navigation.navigate('ForumPost', { postId });
  };
  
  // 跳转到发帖页面
  const navigateToCreatePost = () => {
    navigation.navigate('CreatePost', { categoryId });
  };
  
  // 渲染帖子项
  const renderPostItem = (post, index) => (
    <ListItem 
      key={index} 
      onPress={() => navigateToPostDetail(post.id)}
      bottomDivider
    >
      <ListItem.Content>
        <ListItem.Title style={styles.postTitle}>{post.title}</ListItem.Title>
        <View style={styles.postMeta}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.postStats}>
            <Icon name="visibility" type="material" size={16} color="#999" />
            <Text style={styles.statText}>{post.viewCount}</Text>
            <Icon name="thumb-up" type="material" size={16} color="#999" style={styles.statIcon} />
            <Text style={styles.statText}>{post.likesCount}</Text>
            <Icon name="comment" type="material" size={16} color="#999" style={styles.statIcon} />
            <Text style={styles.statText}>{post.commentsCount}</Text>
          </View>
        </View>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{categoryName}</Text>
            <Divider style={styles.divider} />
            
            {posts.length > 0 ? (
              <View style={styles.postsContainer}>
                {posts.map((post, index) => renderPostItem(post, index))}
                {pagination.page < pagination.totalPages && (
                  <Button
                    title="加载更多"
                    onPress={loadMore}
                    loading={isLoading}
                    buttonStyle={styles.loadMoreButton}
                    type="outline"
                  />
                )}
              </View>
            ) : (
              <Text style={styles.emptyText}>暂无帖子</Text>
            )}
          </View>
          
          {/* 底部填充，确保内容可以滚动到底部导航栏上方 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* 发帖按钮 */}
        <TouchableOpacity 
          style={styles.createPostButton}
          onPress={navigateToCreatePost}
        >
          <Icon name="add" type="material" color="#fff" size={30} />
        </TouchableOpacity>
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
    position: 'relative'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: theme.SPACING.md,
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
  postsContainer: {
    marginTop: theme.SPACING.sm,
  },
  postTitle: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.md,
    marginBottom: theme.SPACING.xs
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    fontSize: 14,
    color: '#666'
  },
  postDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statIcon: {
    marginLeft: 10
  },
  statText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2
  },
  emptyText: {
    textAlign: 'center',
    padding: theme.SPACING.lg,
    color: theme.COLORS.textLight
  },
  loadMoreButton: {
    marginTop: theme.SPACING.md
  },
  createPostButton: {
    position: 'absolute',
    bottom: theme.SPACING.lg,
    right: theme.SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
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
  bottomPadding: {
    height: 80, // 确保底部有足够的空间，使内容可以滚动到底部导航栏上方
  }
});

export default ForumCategoryScreen;