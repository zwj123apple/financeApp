import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, TextInput, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Icon, Button, Divider, Avatar } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchPostDetail, createCommentThunk, likePostThunk, likeCommentThunk, selectCurrentPost, selectComments, selectForumLoading, clearCurrentPost, updatePostLikeInList ,updateCommentLikeInList} from '../store';
import theme from '../utils/theme';

const ForumPostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const currentPost = useSelector(selectCurrentPost);
  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectForumLoading);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  
  // 初始加载数据
  useEffect(() => {
    loadData();
    
    // 组件卸载时清除当前帖子
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [postId]);
  
  // 加载数据函数
  const loadData = async () => {
    setRefreshing(true);
    await dispatch(fetchPostDetail(postId));
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
    
    try {
      // 确保postId是数字类型
      const numericPostId = parseInt(postId);
      if (isNaN(numericPostId)) {
        throw new Error('无效的帖子ID');
      }
      // 调用Redux action并等待结果
      const result = await dispatch(likePostThunk(numericPostId)).unwrap();
      
      // 更新帖子列表中的点赞数
      if (result) {
        dispatch(updatePostLikeInList(result));
      }
    } catch (error) {
      console.error('点赞失败:', error);
      Alert.alert('提示', '点赞失败，请稍后再试');
    }
  };
  
  // 处理点赞评论
  const handleLikeComment = async (commentId) => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    
    try {
      // 确保commentId是数字类型
      const numericCommentId = parseInt(commentId);
      if (isNaN(numericCommentId)) {
        throw new Error('无效的评论ID');
      }
      // 调用Redux action并等待结果
      const result = await dispatch(likeCommentThunk(numericCommentId)).unwrap();
      
      // 不需要额外更新UI，Redux store会自动更新
      if (result) {
        dispatch(updateCommentLikeInList(result));
      }
    } catch (error) {
      console.error('点赞评论失败:', error);
      Alert.alert('提示', '点赞失败，请稍后再试');
    }
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
    
    const commentData = {
      postId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: commentText.trim()
    };
    
    const result = await dispatch(createCommentThunk(commentData)).unwrap().catch(err => ({ success: false, error: err }));
    
    if (!result.error) {
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled"
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
            placeholderTextColor={theme.COLORS.placeholder}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Button
            title="发送"
            onPress={handleSubmitComment}
            buttonStyle={styles.commentButton}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: theme.SPACING.md,
  },
  postContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.md
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userTextInfo: {
    marginLeft: theme.SPACING.sm
  },
  username: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark
  },
  postDate: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: 2
  },
  postTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.sm
  },
  divider: {
    marginVertical: theme.SPACING.sm
  },
  postContent: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textDark,
    lineHeight: 22,
    marginBottom: theme.SPACING.md
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.borderLight,
    paddingTop: theme.SPACING.sm,
    marginTop: theme.SPACING.sm
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.SPACING.lg
  },
  actionText: {
    marginLeft: 5,
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight
  },
  commentsContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  commentsTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark
  },
  commentItem: {
    marginVertical: theme.SPACING.sm
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentUserTextInfo: {
    marginLeft: theme.SPACING.sm
  },
  commentUsername: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark
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
    marginLeft: 3,
    fontSize: theme.FONT_SIZES.xs,
    color: theme.COLORS.textLight
  },
  commentContent: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textDark,
    lineHeight: 20
  },
  commentDivider: {
    marginVertical: theme.SPACING.sm,
    backgroundColor: theme.COLORS.borderLight
  },
  emptyText: {
    textAlign: 'center',
    padding: theme.SPACING.md,
    color: theme.COLORS.textLight
  },
  bottomPadding: {
    height: 80
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.borderLight,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    maxHeight: 100,
    fontSize: theme.FONT_SIZES.sm,
    borderWidth: 1,
    borderColor: theme.COLORS.primaryLight,
    color: theme.COLORS.textDark
  },
  commentButton: {
    marginLeft: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.sm
  }
});

export default ForumPostScreen;