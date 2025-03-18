import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Input, Avatar, Divider, Icon } from '@rneui/themed';
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
    
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 头像区域 - 水平紧凑设计 */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Avatar
                  rounded
                  size={70}
                  source={{ uri: user?.avatar }}
                  containerStyle={styles.avatar}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Icon name="camera-alt" type="material" color={theme.COLORS.white} size={16} />
                </TouchableOpacity>
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.avatarName}>{user?.username}</Text>
                <Text style={styles.avatarEmail}>{user?.email}</Text>
              </View>
            </View>
          </View>
          
          {/* 基本信息区域 - 现代化设计 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="person" type="material" color={theme.COLORS.primary} size={22} />
              <Text style={styles.sectionTitle}>基本信息</Text>
            </View>
            <Divider style={styles.divider} />
            
            <Input
              label="用户名"
              value={username}
              onChangeText={setUsername}
              placeholder="请输入用户名"
              leftIcon={{ 
                type: 'material', 
                name: 'person',
                color: theme.COLORS.primary,
                size: 22
              }}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputInnerContainer}
              labelStyle={styles.inputLabel}
            />
            
            <Input
              label="邮箱"
              value={email}
              onChangeText={setEmail}
              placeholder="请输入邮箱"
              leftIcon={{ 
                type: 'material', 
                name: 'email',
                color: theme.COLORS.primary,
                size: 22
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputInnerContainer}
              labelStyle={styles.inputLabel}
            />
            
            <Input
              label="手机号"
              value={phone}
              onChangeText={setPhone}
              placeholder="请输入手机号"
              leftIcon={{ 
                type: 'material', 
                name: 'phone',
                color: theme.COLORS.primary,
                size: 22
              }}
              keyboardType="phone-pad"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputInnerContainer}
              labelStyle={styles.inputLabel}
            />
          </View>
          
          {/* 安全设置区域 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="security" type="material" color={theme.COLORS.secondary} size={22} />
              <Text style={styles.sectionTitle}>安全设置</Text>
            </View>
            <Divider style={styles.divider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Icon 
                  name="lock" 
                  type="material" 
                  color={theme.COLORS.secondary} 
                  size={22}
                  containerStyle={styles.settingItemIcon}
                />
                <View>
                  <Text style={styles.settingItemTitle}>修改密码</Text>
                  <Text style={styles.settingItemSubtitle}>定期更新密码以保护账户安全</Text>
                </View>
              </View>
              <Icon name="chevron-right" type="material" color={theme.COLORS.textLight} size={22} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Icon 
                  name="verified-user" 
                  type="material" 
                  color={theme.COLORS.secondary} 
                  size={22}
                  containerStyle={styles.settingItemIcon}
                />
                <View>
                  <Text style={styles.settingItemTitle}>两步验证</Text>
                  <Text style={styles.settingItemSubtitle}>增加额外的安全层级保护您的账户</Text>
                </View>
              </View>
              <Icon name="chevron-right" type="material" color={theme.COLORS.textLight} size={22} />
            </TouchableOpacity>
          </View>
          
          {/* 保存按钮 */}
          <Button
            title="保存更改"
            onPress={handleUpdateProfile}
            loading={isLoading}
            buttonStyle={styles.saveButton}
            containerStyle={styles.saveButtonContainer}
            icon={{
              name: 'save',
              type: 'material',
              size: 20,
              color: 'white',
            }}
            iconContainerStyle={{ marginRight: 10 }}
            raised
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight,
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
  // 卡片样式
  profileCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.md,
    overflow: 'hidden',
  },
  sectionCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    marginBottom: theme.SPACING.md,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.md,
  },
  // 头像区域
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.md,
    backgroundColor: `${theme.COLORS.primary}10`,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: theme.SPACING.md,
  },
  avatar: {
    borderWidth: 3,
    borderColor: theme.COLORS.white,
    ...theme.SHADOWS.md,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.SHADOWS.sm,
    borderWidth: 2,
    borderColor: theme.COLORS.white,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  avatarName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xxs,
  },
  avatarEmail: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
  },
  // 分区标题
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs,
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginLeft: theme.SPACING.xs,
  },
  divider: {
    marginBottom: theme.SPACING.md,
    marginTop: theme.SPACING.xxs,
  },
  // 输入框样式
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: theme.SPACING.sm,
  },
  inputInnerContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.borderLight,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.sm,
    height: 50,
  },
  inputLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.primary,
    fontWeight: theme.FONT_WEIGHTS.medium,
    marginBottom: theme.SPACING.xxs,
  },
  // 设置项样式
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    marginRight: theme.SPACING.md,
  },
  settingItemTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.textDark,
  },
  settingItemSubtitle: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: 2,
  },
  // 保存按钮
  saveButtonContainer: {
    marginTop: theme.SPACING.lg,
    marginBottom: theme.SPACING.md,
  },
  saveButton: {
    borderRadius: theme.BORDER_RADIUS.md,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.md,
    ...theme.SHADOWS.md,
  }
});

export default AccountSettingsScreen;