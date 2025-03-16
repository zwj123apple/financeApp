import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Input, Button, Icon, Card } from '@rneui/themed';
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
        colors={['rgba(255,255,255,0.95)', 'rgba(239,246,255,0.98)']}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Icon 
              name="account-balance" 
              size={60} 
              color={theme.COLORS.primary} 
              containerStyle={styles.iconContainer}
            />
            <Text h3 style={styles.title}>注册新账号</Text>
          </View>
          
          <Card containerStyle={styles.formCard}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Input
              placeholder="用户名"
              leftIcon={<Icon name="person" type="material" size={24} color={theme.COLORS.secondary} />}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuterContainer}
            />
            
            <Input
              placeholder="邮箱"
              leftIcon={<Icon name="email" type="material" size={24} color={theme.COLORS.secondary} />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuterContainer}
            />
            
            <Input
              placeholder="手机号码（选填）"
              leftIcon={<Icon name="phone" type="material" size={24} color={theme.COLORS.secondary} />}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuterContainer}
            />
            
            <Input
              placeholder="密码"
              leftIcon={<Icon name="lock" type="material" size={24} color={theme.COLORS.secondary} />}
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
              leftIcon={<Icon name="lock" type="material" size={24} color={theme.COLORS.secondary} />}
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
          </Card>
        </View>
      </ScrollView>
      <ErrorModal />
    </KeyboardAvoidingView>
    </LinearGradient>
    </ImageBackground>
  );
};

// 根据屏幕尺寸计算响应式尺寸的辅助函数
const getResponsiveSize = (smallSize, mediumSize, largeSize) => {
  const { width } = Dimensions.get('window');
  if (width < 380) return smallSize;
  if (width < 768) return mediumSize;
  return largeSize;
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
    paddingVertical: theme.SPACING.lg,
    minHeight: '100%'
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
    marginBottom: theme.SPACING.md,
    width: '100%',
    maxWidth: 500 // 限制在大屏幕上的最大宽度
  },
  iconContainer: {
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    padding: theme.getResponsiveSize(12, 15, 18),
    borderRadius: 50,
    marginBottom: theme.SPACING.sm,
    ...theme.SHADOWS.sm
  },
  title: {
    marginTop: theme.SPACING.xs,
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontSize: theme.getResponsiveSize(22, 26, 30)
  },
  errorText: {
    color: theme.COLORS.error,
    textAlign: 'center',
    marginBottom: theme.SPACING.sm,
    fontSize: theme.FONT_SIZES.sm
  },
  inputOuterContainer: {
    marginBottom: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.xs,
    width: '100%'
  },
  inputContainer: {
    borderWidth: 0.5,
    borderColor: theme.COLORS.primaryLight,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.sm,
    height: theme.getResponsiveSize(45, 50, 55),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    // 添加输入框焦点状态样式，移除黑色边框
    outlineStyle: 'none',
    outlineWidth: 0
  },
  buttonContainer: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    width: '100%',
    ...theme.SHADOWS.sm
  },
  registerButton: {
    backgroundColor: theme.COLORS.primary,
    height: theme.getResponsiveSize(45, 50, 55),
    borderRadius: theme.BORDER_RADIUS.md,
  },
  buttonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 0.5
  },
  loginButtonContainer: {
    marginTop: theme.SPACING.md,
    alignSelf: 'center'
  },
  loginButtonTitle: {
    color: theme.COLORS.secondary,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium
  }
});

export default RegisterScreen;