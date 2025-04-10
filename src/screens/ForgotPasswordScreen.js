import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, useWindowDimensions } from 'react-native';
import { Text, Input, Button, Icon, Card } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { ErrorModal } from '../components';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  // 使用useWindowDimensions钩子获取当前窗口尺寸，实现响应式布局
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 输入邮箱, 2: 输入验证码, 3: 设置新密码
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuthStore();
  
  const handleSendVerificationCode = async () => {
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // 调用发送验证码API
      await resetPassword.sendResetPasswordCode(email);
      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || '发送验证码失败，请重试');
    }
  };
  
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('请输入验证码');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // 调用验证码验证API
      await resetPassword.verifyResetCode(email, verificationCode);
      setIsLoading(false);
      setStep(3);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || '验证码验证失败，请重试');
    }
  };
  
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // 调用重置密码API
      const result = await resetPassword.resetPassword(email, newPassword);
      setIsLoading(false);
      if (result.success) {
        // 重置成功，跳转到登录页
        navigation.navigate('Login');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || '重置密码失败，请重试');
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
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
            
            <Button
              title="发送验证码"
              onPress={handleSendVerificationCode}
              loading={isLoading}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.resetButton}
              titleStyle={styles.buttonTitle}
              loadingProps={{ color: 'white' }}
            />
          </>
        );
      case 2:
        return (
          <>
            <Input
              placeholder="验证码"
              leftIcon={<Icon name="vpn-key" type="material" size={24} color={theme.COLORS.secondary} />}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuterContainer}
            />
            
            <Button
              title="验证"
              onPress={handleVerifyCode}
              loading={isLoading}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.resetButton}
              titleStyle={styles.buttonTitle}
              loadingProps={{ color: 'white' }}
            />
          </>
        );
      case 3:
        return (
          <>
            <Input
              placeholder="新密码"
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
              value={newPassword}
              onChangeText={setNewPassword}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuterContainer}
            />
            
            <Input
              placeholder="确认新密码"
              leftIcon={<Icon name="lock" type="material" size={24} color={theme.COLORS.secondary} />}
              secureTextEntry={!isPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuterContainer}
            />
            
            <Button
              title="重置密码"
              onPress={handleResetPassword}
              loading={isLoading}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.resetButton}
              titleStyle={styles.buttonTitle}
              loadingProps={{ color: 'white' }}
            />
          </>
        );
      default:
        return null;
    }
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
                  name="lock-reset" 
                  type="material-community"
                  size={60} 
                  color={theme.COLORS.primary} 
                  containerStyle={styles.iconContainer}
                />
                <Text h3 style={[styles.title, { fontSize: theme.getResponsiveSize(16, 20, 24) }]}>重置密码</Text>
                <Text style={[styles.subtitle, { fontSize: theme.getResponsiveSize(14, 16, 18) }]}>
                  {step === 1 ? '请输入您的邮箱地址' : 
                   step === 2 ? '请输入您收到的验证码' : 
                   '请设置您的新密码'}
                </Text>
              </View>
              
              <Card containerStyle={styles.formCard}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                {renderStepContent()}
                
                <Button
                  title="返回登录"
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
    minHeight: '100%'
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.SPACING.lg,
    paddingTop: theme.SPACING.sm
  },
  formCard: {
    width: '100%',
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.sm,
    ...theme.SHADOWS.md,
    backgroundColor: theme.COLORS.cardBackground,
    elevation: 4,
    maxWidth: 500, // 限制在大屏幕上的最大宽度
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)'
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.xs,
    width: '100%',
    maxWidth: 500, // 限制在大屏幕上的最大宽度
    paddingVertical: theme.SPACING.xs
  },
  iconContainer: {
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    padding: theme.getResponsiveSize(12, 15, 18),
    borderRadius: 60,
    marginBottom: theme.SPACING.sm,
    ...theme.SHADOWS.md
  },
  title: {
    marginTop: theme.SPACING.sm,
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.bold,
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: theme.SPACING.xs
  },
  subtitle: {
    color: theme.COLORS.secondary,
    marginTop: theme.SPACING.xs,
    marginBottom: theme.SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
    maxWidth: '90%',
    lineHeight: 20
  },
  errorText: {
    color: theme.COLORS.error,
    textAlign: 'center',
    marginBottom: theme.SPACING.md,
    fontSize: theme.FONT_SIZES.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.COLORS.error,
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  inputOuterContainer: {
    marginBottom: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.sm,
    width: '100%'
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.md,
    height: theme.getResponsiveSize(50, 55, 60),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // 添加输入框焦点状态样式，移除黑色边框
    ...(Platform.OS === 'web' ? { outlineWidth: 0, outlineStyle: 'none' } : {}),
    shadowColor: theme.COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  buttonContainer: {
    marginTop: theme.SPACING.xs,
    marginBottom: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    width: '100%',
    ...theme.SHADOWS.sm
  },
  resetButton: {
    backgroundColor: theme.COLORS.primary,
    height: theme.getResponsiveSize(50, 55, 60),
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.md
  },
  buttonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  loginButtonContainer: {
    alignSelf: 'center',
    paddingVertical: theme.SPACING.xs
  },
  loginButtonTitle: {
    color: theme.COLORS.secondary,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    textDecorationLine: 'underline'
  }
});

export default ForgotPasswordScreen;