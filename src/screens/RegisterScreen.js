import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, ImageBackground, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Input, Button, Icon } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { ErrorModal } from '../components';

// 导入统一主题
import theme from '../utils/theme';

const RegisterScreen = ({ navigation }) => {
  // 使用useWindowDimensions钩子获取当前窗口尺寸，实现响应式布局
  const { width, height } = useWindowDimensions();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 动画值
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  useEffect(() => {
    // 启动进入动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.ANIMATION.normal,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.ANIMATION.normal,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const { register } = useAuthStore();
  
  const handleRegister = async () => {
    // 简单验证
    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    const userData = {
      username,
      email,
      password,
      phone,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
    };
    
    const result = await register(userData);
    setIsLoading(false);
    
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <ImageBackground 
      source={require('../../assets/splash-icon.png')} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <Animated.View 
              style={[styles.animatedContainer, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }]}
            >
              <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                  <Icon 
                    name="account-balance" 
                    size={60} 
                    color={theme.COLORS.primary} 
                    containerStyle={styles.iconContainer}
                  />
                  <Text style={styles.title}>注册新账号</Text>
                  <Text style={styles.subtitle}>加入我们的财富管理平台</Text>
                </View>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <Input
                  placeholder="用户名"
                  placeholderTextColor={theme.COLORS.placeholder}
                  leftIcon={<Icon name="person" type="material" size={24} color={theme.COLORS.secondary} containerStyle={{marginRight: theme.SPACING.sm}} />}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  inputContainerStyle={styles.inputContainer}
                  containerStyle={styles.inputOuterContainer}
                />
                
                <Input
                  placeholder="邮箱"
                  placeholderTextColor={theme.COLORS.placeholder}
                  leftIcon={<Icon name="email" type="material" size={24} color={theme.COLORS.secondary} containerStyle={{marginRight: theme.SPACING.sm}} />}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  inputContainerStyle={styles.inputContainer}
                  containerStyle={styles.inputOuterContainer}
                />
                
                <Input
                  placeholder="手机号码（选填）"
                  placeholderTextColor={theme.COLORS.placeholder}
                  leftIcon={<Icon name="phone" type="material" size={24} color={theme.COLORS.secondary} containerStyle={{marginRight: theme.SPACING.sm}} />}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  inputContainerStyle={styles.inputContainer}
                  containerStyle={styles.inputOuterContainer}
                />
                
                <Input
                  placeholder="密码"
                  placeholderTextColor={theme.COLORS.placeholder}
                  leftIcon={<Icon name="lock" type="material" size={24} color={theme.COLORS.secondary} containerStyle={{marginRight: theme.SPACING.sm}} />}
                  rightIcon={
                    <Icon
                      name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                      type="material"
                      size={24}
                      color={theme.COLORS.secondary}
                      onPress={togglePasswordVisibility}
                    />
                  }
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  inputContainerStyle={styles.inputContainer}
                  containerStyle={styles.inputOuterContainer}
                />
                
                <Input
                  placeholder="确认密码"
                  placeholderTextColor={theme.COLORS.placeholder}
                  leftIcon={<Icon name="lock" type="material" size={24} color={theme.COLORS.secondary} containerStyle={{marginRight: theme.SPACING.sm}} />}
                  secureTextEntry={!isPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  inputContainerStyle={styles.inputContainer}
                  containerStyle={styles.inputOuterContainer}
                />
                
                <Button
                  title="注册"
                  onPress={handleRegister}
                  loading={isLoading}
                  containerStyle={styles.buttonContainer}
                  buttonStyle={styles.registerButton}
                  titleStyle={styles.buttonTitle}
                  loadingProps={{ color: 'white' }}
                />
                
                <Button
                  title="已有账号？返回登录"
                  type="clear"
                  onPress={navigateToLogin}
                  containerStyle={styles.loginButtonContainer}
                  titleStyle={styles.loginButtonTitle}
                />
              </View>
        </Animated.View>
      </ScrollView>
      <ErrorModal />
    </KeyboardAvoidingView>
    </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.15,
    resizeMode: 'cover',
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.SPACING.md,
    paddingTop: theme.SPACING.md, // 减小顶部间距
    paddingBottom: theme.SPACING.md, // 减小底部间距
    minHeight: '100%'
  },
  animatedContainer: {
    width: '100%',
    justifyContent: 'center', // 添加居中对齐
    flex: 1, // 使用flex布局自适应高度
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.SPACING.md, // 减小底部间距
    maxWidth: 500, // 限制在大屏幕上的最大宽度
    alignSelf: 'center'
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.md, // 减小底部间距
    marginTop: theme.SPACING.sm, // 减小顶部间距
    width: '100%',
    maxWidth: 500 // 限制在大屏幕上的最大宽度
  },
  iconContainer: {
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    padding: theme.getResponsiveSize(12, 14, 16), // 减小内边距
    borderRadius: 50,
    marginBottom: theme.SPACING.sm,
    ...theme.SHADOWS.md,
    elevation: 3
  },
  inputOuterContainer: {
    marginBottom: theme.SPACING.sm, // 减小底部间距
    paddingHorizontal: theme.SPACING.xs,
    width: '100%'
  },
  inputContainer: {
    borderWidth: 0.5,
    borderColor: theme.COLORS.primaryLight,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.md,
    height: theme.getResponsiveSize(44, 48, 52), // 减小高度，使其更紧凑
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginVertical: 2,
    ...theme.SHADOWS.sm,
    // 添加输入框焦点状态样式
    ...(Platform.OS === 'web' ? { outline: 'none' } : {})
  },
  buttonContainer: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    width: '100%',
    ...theme.SHADOWS.sm,
    elevation: 2,
    maxWidth: 500
  },
  registerButton: {
    backgroundColor: theme.COLORS.primary,
    height: theme.getResponsiveSize(44, 48, 52), // 减小高度，使其更紧凑
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.md,
    elevation: 4
  },
  buttonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 0.5
  },
  loginButtonContainer: {
    marginTop: theme.SPACING.md,
    alignSelf: 'center',
    marginBottom: theme.SPACING.md
  },
  loginButtonTitle: {
    color: theme.COLORS.secondary,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium
  }
});

export default RegisterScreen;