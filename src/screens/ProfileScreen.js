import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 导入统一主题
import theme from '../utils/theme';
import { Text, Button, Avatar, ListItem, Icon, Divider } from '@rneui/themed';
import { useAuthStore } from '../store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  
  // 根据滚动位置计算头部动画效果
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 120],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp'
  });
  
  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={theme.GRADIENTS.background}
          style={styles.gradientBackground}
        >
          <View style={styles.notLoginContainer}>
            <View style={styles.notLoginIconContainer}>
              <Icon name="account-circle" type="material" size={100} color={theme.COLORS.primaryLight} />
            </View>
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
              raised
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
  <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={theme.GRADIENTS.background}                                 
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 用户信息头部 - 现代化设计 */}
          <View style={styles.profileHeaderContainer}>
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
              <TouchableOpacity 
                onPress={navigateToAccountSettings}
                style={styles.editButton}
              >
                <Icon name="edit" type="material" size={22} color={theme.COLORS.white} />
              </TouchableOpacity>
            </View>
            
            {/* 用户数据概览 */}
            <View style={styles.userStatsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>交易</Text>
              </View>
              <Divider orientation="vertical" width={1} color={theme.COLORS.borderLight} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>资产</Text>
              </View>
              <Divider orientation="vertical" width={1} color={theme.COLORS.borderLight} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>收藏</Text>
              </View>
            </View>
          </View>
          
          {/* 功能列表 - 现代化设计 */}
          <Text style={styles.sectionTitle}>账户管理</Text>
          <View style={styles.sectionContainer}>        
            <ListItem onPress={navigateToAccountSettings} containerStyle={styles.listItem}>
              <View style={[styles.iconBackground, { backgroundColor: `${theme.COLORS.primary}20` }]}>
                <Icon name="settings" type="material" color={theme.COLORS.primary} size={22} />
              </View>
              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>账户设置</ListItem.Title>
                <ListItem.Subtitle style={styles.listItemSubtitle}>管理您的个人信息和账户安全</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron color={theme.COLORS.primary} />
            </ListItem>
            
            <ListItem onPress={navigateToTransactionRecords} containerStyle={styles.listItem}>
              <View style={[styles.iconBackground, { backgroundColor: `${theme.COLORS.secondary}20` }]}>
                <Icon name="receipt" type="material" color={theme.COLORS.secondary} size={22} />
              </View>
              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>交易记录</ListItem.Title>
                <ListItem.Subtitle style={styles.listItemSubtitle}>查看您的所有交易历史</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron color={theme.COLORS.primary} />
            </ListItem>
            
            <ListItem onPress={navigateToAssets} containerStyle={styles.listItem}>
              <View style={[styles.iconBackground, { backgroundColor: `${theme.COLORS.accent}20` }]}>
                <Icon name="account-balance-wallet" type="material" color={theme.COLORS.accent} size={22} />
              </View>
              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>我的资产</ListItem.Title>
                <ListItem.Subtitle style={styles.listItemSubtitle}>管理您的资产组合</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron color={theme.COLORS.primary} />
            </ListItem>
          </View>
          
          {/* 退出登录按钮 - 现代化设计 */}
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
              size: 22,
              color: theme.COLORS.error
            }}
            iconRight
          />
          
          {/* 底部填充，确保滚动时底部导航栏不会遮挡内容 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight,
  },

  notLoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.xl,
  },
  notLoginIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${theme.COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
    ...theme.SHADOWS.md,
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
    ...theme.SHADOWS.md,
  },
  loginButtonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.semibold
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
    marginTop: theme.SPACING.md, // 顶部间距
  },
  scrollContent: {
    paddingTop: theme.SPACING.md,
    paddingBottom: theme.SPACING.xxxl,
    paddingHorizontal: theme.SPACING.md,
  },
  // 现代化用户信息头部样式
  profileHeaderContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    marginBottom: theme.SPACING.lg,
    overflow: 'hidden',
    ...theme.SHADOWS.md,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.SPACING.lg,
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  avatarContainer: {
    ...theme.SHADOWS.md,
    borderRadius: 50,
    padding: 3,
    backgroundColor: theme.COLORS.white,
  },
  userTextInfo: {
    marginLeft: theme.SPACING.lg,
    flex: 1,
  },
  username: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
  },
  userEmail: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: theme.SPACING.xs,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.SHADOWS.sm,
  },
  // 用户数据统计区域
  userStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.SPACING.md,
    backgroundColor: theme.COLORS.backgroundLight,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: theme.SPACING.md,
  },
  statValue: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.primary,
    marginBottom: theme.SPACING.xxs,
  },
  statLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
  },
  // 分区标题
  sectionTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.sm,
    marginLeft: theme.SPACING.xs,
  },
  sectionContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.lg,
    marginBottom: theme.SPACING.lg,
    ...theme.SHADOWS.md,
    overflow: 'hidden',
  },
  // 图标背景
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.SPACING.sm,
  },
  listItem: {
    paddingVertical: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  listItemTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.text,
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
  },
  logoutButtonContainer: {
    marginTop: theme.SPACING.xl,
    marginHorizontal: theme.SPACING.md,
  },
  logoutButton: {
    borderColor: theme.COLORS.error,
    borderWidth: 1,
    borderRadius: theme.BORDER_RADIUS.lg,
    paddingVertical: theme.SPACING.md,
    ...theme.SHADOWS.sm,
  },
  logoutButtonTitle: {
    color: theme.COLORS.error,
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
  bottomPadding: {
    height: 80, // 底部导航栏的高度，确保内容不被遮挡
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});

export default ProfileScreen;