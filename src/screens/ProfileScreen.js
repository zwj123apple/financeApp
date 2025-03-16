import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Avatar, ListItem, Icon } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  
  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={theme.GRADIENTS.background}
          style={styles.gradientBackground}
        >
          <View style={styles.notLoginContainer}>
            <Icon name="account-circle" type="material" size={80} color={theme.COLORS.textLight} />
            <Text style={styles.notLoginText}>您尚未登录</Text>
            <Text style={styles.notLoginSubText}>登录后可查看个人资料和管理账户</Text>
            <Button
              title="去登录"
              onPress={() => navigation.navigate('Login')}
              buttonStyle={styles.loginButton}
              titleStyle={styles.loginButtonTitle}
              icon={{
                name: 'login',
                type: 'material',
                size: 20,
                color: 'white'
              }}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
  
  // 跳转到账户设置
  const navigateToAccountSettings = () => {
    navigation.navigate('AccountSettings');
  };
  
  // 跳转到交易记录
  const navigateToTransactionRecords = () => {
    navigation.navigate('TransactionRecords');
  };
  
  // 跳转到资产详情
  const navigateToAssets = () => {
    navigation.navigate('Assets');
  };
  
  // 处理退出登录
  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientBackground}
      >
        {/* 用户信息头部 */}
        <View style={styles.userInfoContainer}>
          <Avatar
            rounded
            size="large"
            source={{ uri: user.avatar }}
            containerStyle={styles.avatarContainer}
          />
          <View style={styles.userTextInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        
        {/* 功能列表 */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>账户管理</Text>
            
            <ListItem onPress={navigateToAccountSettings} containerStyle={styles.listItem}>
              <Icon name="settings" type="material" color={theme.COLORS.primary} />
              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>账户设置</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron color={theme.COLORS.primary} />
            </ListItem>
            
            <ListItem onPress={navigateToTransactionRecords} containerStyle={styles.listItem}>
              <Icon name="receipt" type="material" color={theme.COLORS.primary} />
              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>交易记录</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron color={theme.COLORS.primary} />
            </ListItem>
            
            <ListItem onPress={navigateToAssets} containerStyle={styles.listItem}>
              <Icon name="account-balance-wallet" type="material" color={theme.COLORS.primary} />
              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>我的资产</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron color={theme.COLORS.primary} />
            </ListItem>
          </View>
          
          {/* 退出登录按钮 */}
          <Button
            title="退出登录"
            onPress={handleLogout}
            buttonStyle={styles.logoutButton}
            containerStyle={styles.logoutButtonContainer}
            type="outline"
            titleStyle={styles.logoutButtonTitle}
            icon={{
              name: 'logout',
              type: 'material',
              size: 20,
              color: theme.COLORS.error
            }}
            iconRight
          />
          
          {/* 底部填充，确保滚动时底部导航栏不会遮挡内容 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  notLoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.xl,
  },
  notLoginText: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginTop: theme.SPACING.md,
  },
  notLoginSubText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.md,
    color: theme.COLORS.textMuted,
    fontSize: theme.FONT_SIZES.md,
  },
  loginButton: {
    marginTop: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.md,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.sm,
    minWidth: 150,
  },
  loginButtonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarContainer: {
    ...theme.SHADOWS.sm
  },
  userTextInfo: {
    marginLeft: theme.SPACING.lg
  },
  username: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.text
  },
  userEmail: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: theme.SPACING.xs
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.SPACING.xxxl,
    width: '100%'
  },
  sectionContainer: {
    marginTop: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    marginHorizontal: theme.SPACING.md,
    ...theme.SHADOWS.sm,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    padding: theme.SPACING.md,
    backgroundColor: theme.COLORS.backgroundLight,
  },
  listItem: {
    paddingVertical: theme.SPACING.sm,
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  listItemTitle: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.text
  },
  logoutButtonContainer: {
    marginTop: theme.SPACING.xl,
    marginHorizontal: theme.SPACING.md,
  },
  logoutButton: {
    borderColor: theme.COLORS.error,
    borderWidth: 1,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingVertical: theme.SPACING.sm
  },
  logoutButtonTitle: {
    color: theme.COLORS.error,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  bottomPadding: {
    height: 80, // 底部导航栏的高度，确保内容不被遮挡
  },
});

export default ProfileScreen;