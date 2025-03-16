import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, TextInput, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Text, Icon, Button, Divider, Avatar } from '@rneui/themed';
import { useForumStore } from '../store/forumStore';
import { useAuthStore } from '../store/authStore';
import theme from '../utils/theme';

const ForumPostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { currentPost, comments, fetchPostDetail, createComment, likePost, likeComment, isLoading } = useForumStore();
  const { user } = useAuthStore();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
    
    // 组件卸载时清除当前帖子
    return () => {
      useForumStore.getState().clearCurrentPost();
    };
  }, [postId]);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    await fetchPostDetail(postId);
    setRefreshing(false);
  };
  
  // 下拉刷新
  const onRefresh = () => {
    loadData();
  };
  
  // 处理点赞帖子
  const handleLikePost = async () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    
    await likePost(postId);
  };
  
  // 处理点赞评论
  const handleLikeComment = async (commentId) => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    
    await likeComment(commentId);
  };
  
  // 处理发表评论
  const handleSubmitComment = async () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    
    if (!commentText.trim()) {
      Alert.alert('提示', '评论内容不能为空');
      return;
    }
    
    const result = await createComment({
      postId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: commentText.trim()
    });
    
    if (result.success) {
      setCommentText('');
    }
  };
  
  // 如果帖子数据未加载，显示加载状态
  if (!currentPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.COLORS.backgroundLight} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 帖子内容区域 */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <Avatar
                rounded
                source={{ uri: currentPost.avatar }}
                size="medium"
              />
              <View style={styles.userTextInfo}>
                <Text style={styles.username}>{currentPost.username}</Text>
                <Text style={styles.postDate}>
                  {new Date(currentPost.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.postTitle}>{currentPost.title}</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.postContent}>{currentPost.content}</Text>
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLikePost}>
              <Icon name="thumb-up" type="material" size={20} color="#666" />
              <Text style={styles.actionText}>{currentPost.likesCount} 点赞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="comment" type="material" size={20} color="#666" />
              <Text style={styles.actionText}>{comments.length} 评论</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 评论列表区域 */}
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>评论 ({comments.length})</Text>
          <Divider style={styles.divider} />
          
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentUserInfo}>
                    <Avatar
                      rounded
                      source={{ uri: comment.avatar }}
                      size="small"
                    />
                    <View style={styles.commentUserTextInfo}>
                      <Text style={styles.commentUsername}>{comment.username}</Text>
                      <Text style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleLikeComment(comment.id)}>
                    <View style={styles.commentLike}>
                      <Icon name="thumb-up" type="material" size={16} color="#666" />
                      <Text style={styles.commentLikeCount}>{comment.likesCount}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.commentContent}>{comment.content}</Text>
                
                {index < comments.length - 1 && <Divider style={styles.commentDivider} />}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>暂无评论，快来发表第一条评论吧</Text>
          )}
        </View>
        
        {/* 底部填充，确保内容不被底部导航栏和评论框遮挡 */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* 评论输入框 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="写下你的评论..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <Button
          title="发送"
          onPress={handleSubmitComment}
          loading={isLoading}
          buttonStyle={styles.sendButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: theme.SPACING.md,
    paddingTop: theme.SPACING.md,
    paddingBottom: theme.SPACING.md
  },
  postContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  commentsContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userTextInfo: {
    marginLeft: 10
  },
  username: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.md
  },
  postDate: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight
  },
  postTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginTop: 10,
    marginBottom: 5
  },
  divider: {
    marginVertical: theme.SPACING.sm
  },
  postContent: {
    fontSize: theme.FONT_SIZES.md,
    lineHeight: 24,
    marginVertical: theme.SPACING.md,
    color: theme.COLORS.text
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.SPACING.sm,
    paddingTop: theme.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.borderLight
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  actionText: {
    marginLeft: 5,
    color: theme.COLORS.textLight
  },
  commentsTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: 5
  },
  commentItem: {
    marginBottom: 15
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentUserTextInfo: {
    marginLeft: 10
  },
  commentUsername: {
    fontWeight: theme.FONT_WEIGHTS.bold,
    fontSize: theme.FONT_SIZES.sm
  },
  commentDate: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentLikeCount: {
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight,
    marginLeft: 3
  },
  commentContent: {
    fontSize: theme.FONT_SIZES.sm,
    lineHeight: 20,
    marginTop: 5,
    marginLeft: 40, // 与头像对齐
    color: theme.COLORS.text
  },
  commentDivider: {
    marginTop: 15,
    marginBottom: 15
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: theme.COLORS.textLight
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.borderLight,
    ...theme.SHADOWS.md
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: theme.COLORS.backgroundLight
  },
  sendButton: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: theme.COLORS.primary
  },
  bottomPadding: {
    height: 80 // 为底部评论框和导航栏预留空间
  }
});

export default ForumPostScreen;