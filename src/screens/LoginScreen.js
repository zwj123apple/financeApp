import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, ImageBackground, useWindowDimensions } from 'react-native';
import { Text, Input, Button, Icon, Card } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { ErrorModal } from '../components';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题和验证工具
import theme from '../utils/theme';
import { isNotEmpty } from '../utils/validation';

const LoginScreen = ({ navigation }) => {
  // 使用useWindowDimensions钩子获取当前窗口尺寸，实现响应式布局
  const { width, height } = useWindowDimensions();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // 动画值
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  const { login } = useAuthStore();
  
  useEffect(() => {
    // 启动进入动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const handleLogin = async () => {
    // 重置错误状态
    setUsernameError('');
    setPasswordError('');
    
    // 验证输入
    let hasError = false;
    
    if (!isNotEmpty(username)) {
      setUsernameError('请输入用户名');
      hasError = true;
    }
    
    if (!isNotEmpty(password)) {
      setPasswordError('请输入密码');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    setIsLoading(true);
    const result = await login({ username, password });
    setIsLoading(false);
    
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else if (result.error) {
      // 后端错误只在密码框下方显示一次
      if (result.error.includes('用户名或密码错误')) {
        setPasswordError('用户名或密码错误');
      } else {
        setPasswordError(result.error);
      }
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };
  
  return (
    <ImageBackground 
      source={require('../../assets/splash-icon.png')} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(239,246,255,0.98)']}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  <Text style={styles.title}>金融理财助手</Text>
                  <Text style={styles.subtitle}>专业的个人财富管理平台</Text>
                </View>
                
                <Input
                  placeholder="用户名/邮箱"
                  placeholderTextColor={theme.COLORS.placeholder}
                  leftIcon={<Icon name="person" type="material" size={24} color={theme.COLORS.secondary} containerStyle={{marginRight: theme.SPACING.sm}} />}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (usernameError) setUsernameError('');
                  }}
                  autoCapitalize="none"
                  inputContainerStyle={[styles.inputContainer, usernameError ? styles.inputError : null]}
                  containerStyle={styles.inputOuterContainer}
                  errorStyle={styles.errorText}
                  errorMessage={usernameError}
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
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  inputContainerStyle={[styles.inputContainer, passwordError ? styles.inputError : null]}
                  containerStyle={styles.inputOuterContainer}
                  errorStyle={styles.errorText}
                  errorMessage={passwordError}
                />
                
                <Button
                  title="登录"
                  onPress={handleLogin}
                  loading={isLoading}
                  containerStyle={styles.buttonContainer}
                  buttonStyle={styles.loginButton}
                  titleStyle={styles.buttonTitle}
                  loadingProps={{ color: 'white' }}
                />
                
                <View style={styles.bottomButtonsContainer}>
                  <Button
                    title="注册新账号"
                    type="clear"
                    onPress={navigateToRegister}
                    containerStyle={styles.registerButtonContainer}
                    titleStyle={styles.registerButtonTitle}
                  />
                  
                  <Button
                    title="忘记密码？"
                    type="clear"
                    onPress={() => navigation.navigate('ForgotPassword')}
                    containerStyle={styles.forgotPasswordContainer}
                    titleStyle={styles.forgotPasswordTitle}
                  />
                </View>
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
  errorText: {
    color: theme.COLORS.error,
    fontSize: theme.FONT_SIZES.sm,
    marginTop: 2,
    marginBottom: 0,
  },
  inputError: {
    borderColor: theme.COLORS.error,
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
    paddingVertical: theme.SPACING.lg,
    minHeight: '100%'
  },
  animatedContainer: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.SPACING.xl
  },
  formCard: {
    width: '100%',
    borderRadius: theme.BORDER_RADIUS.lg,
    padding: theme.SPACING.md,
    marginTop: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
    ...theme.SHADOWS.md,
    backgroundColor: theme.COLORS.cardBackground,
    elevation: 4,
    maxWidth: 500, // 限制在大屏幕上的最大宽度
    alignSelf: 'center'
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
    marginTop: theme.SPACING.md,
    width: '100%',
    maxWidth: 500 // 限制在大屏幕上的最大宽度
  },
  iconContainer: {
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    padding: theme.getResponsiveSize(16, 18, 20),
    borderRadius: 50,
    marginBottom: theme.SPACING.sm,
    ...theme.SHADOWS.md,
    elevation: 3
  },
  title: {
    marginTop: theme.SPACING.xs,
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.bold,
    textAlign: 'center',
    letterSpacing: 0.8,
    fontSize: theme.getResponsiveSize(22, 26, 30)
  },
  subtitle: {
    color: theme.COLORS.secondary,
    marginTop: theme.SPACING.xs,
    marginBottom: theme.SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.3,
    fontSize: theme.FONT_SIZES.md
  },
  inputOuterContainer: {
    marginBottom: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.xs,
    width: '100%'
  },
  inputContainer: {
    borderWidth: 0.5,
    borderColor: theme.COLORS.primaryLight,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.md,
    height: theme.getResponsiveSize(48, 52, 56),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginVertical: 2,
    ...theme.SHADOWS.sm,
    // 添加输入框焦点状态样式，移除黑色边框
    outlineStyle: 'none',
    outlineWidth: 0
  },
  buttonContainer: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    width: '100%',
    ...theme.SHADOWS.sm,
    elevation: 2
  },
  loginButton: {
    backgroundColor: theme.COLORS.primary,
    height: theme.getResponsiveSize(48, 52, 56),
    borderRadius: theme.BORDER_RADIUS.md,
    ...theme.SHADOWS.md,
    elevation: 4
  },
  buttonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 0.5
  },
  registerButtonContainer: {
    marginTop: theme.SPACING.md,
    marginBottom: theme.SPACING.xs
  },
  registerButtonTitle: {
    color: theme.COLORS.secondary,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  forgotPasswordContainer: {
    marginTop: theme.SPACING.sm,
    marginBottom: theme.SPACING.xs
  },
  forgotPasswordTitle: {
    color: theme.COLORS.secondary,
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
    textDecorationLine: 'underline'
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.md,
    width: '100%'
  }
});

export default LoginScreen;