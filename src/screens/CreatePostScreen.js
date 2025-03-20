import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Input, Divider } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories, selectForumLoading, createPostThunk, selectUser } from '../store';
import theme from '../utils/theme';

const CreatePostScreen = ({ route, navigation }) => {
  const { categoryId } = route.params || {};
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || null);
  
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectForumLoading);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  
  // 初始加载分类数据
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, []);
  
  // 处理发布帖子
  const handleSubmitPost = async () => {
    // 验证输入
    if (!title.trim()) {
      Alert.alert('提示', '标题不能为空');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('提示', '内容不能为空');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('提示', '请选择分类');
      return;
    }
    
    // 构建帖子数据
    const postData = {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      categoryId: selectedCategory,
      title: title.trim(),
      content: content.trim()
    };
    
    // 调用发布接口
    const result = await dispatch(createPostThunk(postData)).unwrap().catch(err => ({ success: false, error: err }));
    
    if (!result.error) {
      Alert.alert('成功', '帖子发布成功', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    }
  };
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.COLORS.backgroundLight} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 发表新帖区域 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>发表新帖</Text>
              <Divider style={styles.divider} />
              
              {/* 分类选择 */}
              <Text style={styles.label}>选择分类</Text>
              <View style={styles.pickerContainer}>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    title={category.name}
                    type={selectedCategory === category.id ? 'solid' : 'outline'}
                    onPress={() => setSelectedCategory(category.id)}
                    buttonStyle={styles.categoryButton}
                    containerStyle={styles.categoryButtonContainer}
                  />
                ))}
              </View>
              
              <Input
                label="标题"
                value={title}
                onChangeText={setTitle}
                placeholder="请输入帖子标题"
                maxLength={50}
                labelStyle={styles.inputLabel}
              />
              
              <Text style={styles.label}>内容</Text>
              <TextInput
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                placeholder="请输入帖子内容"
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
              
              <Button
                title="发布帖子"
                onPress={handleSubmitPost}
                loading={isLoading}
                buttonStyle={styles.submitButton}
              />
            </View>
            
            {/* 底部填充，确保内容不被底部导航栏遮挡 */}
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
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    paddingVertical: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.md,
    paddingBottom: theme.SPACING.xl
  },
  section: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.sm
  },
  divider: {
    marginBottom: theme.SPACING.md
  },
  label: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.textLight,
    marginLeft: 10,
    marginTop: theme.SPACING.sm,
    marginBottom: theme.SPACING.sm
  },
  inputLabel: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.textLight,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.SPACING.md
  },
  categoryButtonContainer: {
    margin: theme.SPACING.xs
  },
  categoryButton: {
    paddingHorizontal: theme.SPACING.sm,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.sm
  },
  contentInput: {
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: theme.BORDER_RADIUS.sm,
    padding: theme.SPACING.sm,
    marginHorizontal: 10,
    marginBottom: theme.SPACING.md,
    minHeight: 150,
    color: theme.COLORS.text
  },
  submitButton: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    backgroundColor: theme.COLORS.primary
  },
  bottomPadding: {
    height: 60 // 为底部导航栏预留空间
  }
});

export default CreatePostScreen;