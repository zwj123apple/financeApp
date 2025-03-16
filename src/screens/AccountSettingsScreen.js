import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Input, Avatar, Divider } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import theme from '../utils/theme';

const AccountSettingsScreen = ({ navigation }) => {
  const { user, updateUserProfile, isLoading } = useAuthStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // 处理更新个人信息
  const handleUpdateProfile = async () => {
    // 验证输入
    if (!username.trim()) {
      Alert.alert('提示', '用户名不能为空');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('提示', '邮箱不能为空');
      return;
    }
    
    // 构建更新数据
    const updateData = {
      username,
      email,
      phone
    };
    
    // 调用更新接口
    const result = await updateUserProfile(updateData);
    
    if (result.success) {
      Alert.alert('成功', '个人信息更新成功');
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
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 头像区域 */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Avatar
                  rounded
                  size="large"
                  source={{ uri: user?.avatar }}
                />
                <Button
                  title="更换头像"
                  type="outline"
                  buttonStyle={styles.avatarButton}
                  titleStyle={styles.avatarButtonText}
                  icon={{
                    name: 'camera',
                    type: 'font-awesome',
                    size: 15,
                    color: theme.COLORS.primary,
                  }}
                  iconRight
                  iconContainerStyle={{ marginLeft: 10 }}
                />
              </View>
            </View>
            
            {/* 基本信息区域 */}
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>基本信息</Text>
              <Divider style={styles.divider} />
              
              <Input
                label="用户名"
                value={username}
                onChangeText={setUsername}
                placeholder="请输入用户名"
                leftIcon={{ type: 'material', name: 'person' }}
                containerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
              />
              
              <Input
                label="邮箱"
                value={email}
                onChangeText={setEmail}
                placeholder="请输入邮箱"
                leftIcon={{ type: 'material', name: 'email' }}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
              />
              
              <Input
                label="手机号"
                value={phone}
                onChangeText={setPhone}
                placeholder="请输入手机号"
                leftIcon={{ type: 'material', name: 'phone' }}
                keyboardType="phone-pad"
                containerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
              />
              
              <Button
                title="保存基本信息"
                onPress={handleUpdateProfile}
                loading={isLoading}
                buttonStyle={styles.saveButton}
                icon={{
                  name: 'save',
                  type: 'font-awesome',
                  size: 15,
                  color: 'white',
                }}
                iconContainerStyle={{ marginRight: 10 }}
              />
            </View>
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
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: theme.SPACING.md,
    paddingTop: theme.SPACING.md,
    paddingBottom: theme.SPACING.xl,
  },
  profileSection: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs
  },
  divider: {
    marginBottom: theme.SPACING.sm
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: theme.SPACING.sm
  },
  avatarButton: {
    marginTop: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.round,
    paddingHorizontal: theme.SPACING.md,
    borderColor: theme.COLORS.primary
  },
  avatarButtonText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.primary
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: theme.SPACING.xs
  },
  inputLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textDark,
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  saveButton: {
    marginTop: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.md,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.xs
  }
});

export default AccountSettingsScreen;