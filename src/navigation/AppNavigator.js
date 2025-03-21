import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { useAuthStore } from '../store/authStore';

// 导入屏幕组件
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import HoldingsScreen from '../screens/HoldingsScreen';
import HoldingDetailScreen from '../screens/HoldingDetailScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ForumScreen from '../screens/ForumScreen';
import ForumCategoryScreen from '../screens/ForumCategoryScreen';
import ForumPostScreen from '../screens/ForumPostScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import TransactionRecordsScreen from '../screens/TransactionRecordsScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import AssetsScreen from '../screens/AssetsScreen';
import AssetDetailScreen from '../screens/AssetDetailScreen';
import AssetAnalysisScreen from '../screens/AssetAnalysisScreen';
import AssetAnalysisDetailScreen from '../screens/AssetAnalysisDetailScreen';

// 创建导航器
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ForumStack = createStackNavigator();

// Home页面的子导航栈
const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      // 保留屏幕状态，不完全卸载屏幕
      detachInactiveScreens: false,
      // 移除此选项，确保屏幕在不活跃时不被卸载
      unmountOnBlur: false
    }}
    // 确保导航栈在每次返回时都重置到初始路由
    initialRouteName="HomeMain"
  >
    <HomeStack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <HomeStack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen} 
      options={{ title: '产品详情' }}
    />
    <HomeStack.Screen 
      name="ProductsScreen" 
      component={ProductsScreen} 
      options={{ title: '全部产品' }}
    />
  </HomeStack.Navigator>
);

// Profile页面的子导航栈
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      // 保留屏幕状态，不完全卸载屏幕
      detachInactiveScreens: false,
      // 移除此选项，确保屏幕在不活跃时不被卸载
      unmountOnBlur: false
    }}
    // 确保导航栈在每次返回时都重置到初始路由
    initialRouteName="ProfileMain"
  >
    <ProfileStack.Screen 
      name="ProfileMain" 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen 
      name="AccountSettings" 
      component={AccountSettingsScreen} 
      options={{ title: '账户设置' }}
    />
    <ProfileStack.Screen 
      name="TransactionRecords" 
      component={TransactionRecordsScreen} 
      options={{ title: '交易记录' }}
    />
    <ProfileStack.Screen 
      name="TransactionDetail" 
      component={TransactionDetailScreen} 
      options={{ title: '交易详情' }}
    />
    <ProfileStack.Screen 
      name="Assets" 
      component={AssetsScreen} 
      options={{ title: '我的资产' }}
    />
    <ProfileStack.Screen 
      name="AssetDetail" 
      component={AssetDetailScreen} 
      options={{ title: '资产详情' }}
    />
    <ProfileStack.Screen 
      name="AssetAnalysis" 
      component={AssetAnalysisScreen} 
      options={{ title: '资产分析' }}
    />
    <ProfileStack.Screen 
      name="AssetAnalysisDetail" 
      component={AssetAnalysisDetailScreen} 
      options={{ title: '资产分析详情' }}
    />
    <ProfileStack.Screen 
      name="HoldingDetail" 
      component={HoldingDetailScreen} 
      options={{ title: '持仓详情' }}
    />
  </ProfileStack.Navigator>
);

// Forum页面的子导航栈
const ForumStackNavigator = () => (
  <ForumStack.Navigator
    screenOptions={{
      // 保留屏幕状态，不完全卸载屏幕
      detachInactiveScreens: false,
      // 移除此选项，确保屏幕在不活跃时不被卸载
      unmountOnBlur: false
    }}
    // 确保导航栈在每次返回时都重置到初始路由
    initialRouteName="ForumMain"
  >
    <ForumStack.Screen 
      name="ForumMain" 
      component={ForumScreen} 
      options={{ headerShown: false }}
    />
    <ForumStack.Screen 
      name="ForumCategory" 
      component={ForumCategoryScreen} 
      options={({ route }) => ({ title: route.params.categoryName })}
    />
    <ForumStack.Screen 
      name="ForumPost" 
      component={ForumPostScreen} 
      options={{ title: '帖子详情' }}
    />
    <ForumStack.Screen 
      name="CreatePost" 
      component={CreatePostScreen} 
      options={{ title: '发表帖子' }}
    />
  </ForumStack.Navigator>
);

// 主页面底部标签导航 - 只有在已登录状态下才会显示
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Forum') {
          iconName = 'forum';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }

        return <Icon name={iconName} type="material" size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2089dc',
      tabBarInactiveTintColor: 'gray',
      // 修改为false，确保在切换标签时不会完全卸载屏幕
      detachInactiveScreens: false,
      // 确保屏幕在不活跃时不被卸载
      unmountOnBlur: false,
      // 启用懒加载，提高性能
      lazy: true,
    })}
    // 保持初始路由行为，但不会在每次切换时重置
    backBehavior="history"
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStackNavigator} 
      options={{ 
        title: '首页', 
        headerShown: false
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          // 阻止默认行为
          e.preventDefault();
          // 重置Home导航栈到初始路由
          navigation.navigate('Home', {
            screen: 'HomeMain'
          });
        }
      })}
    />
    <Tab.Screen 
      name="Forum" 
      component={ForumStackNavigator} 
      options={{ 
        title: '论坛', 
        headerShown: false
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          // 阻止默认行为
          e.preventDefault();
          // 重置Forum导航栈到初始路由
          navigation.navigate('Forum', {
            screen: 'ForumMain'
          });
        }
      })}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileStackNavigator} 
      options={{ 
        title: '我的', 
        headerShown: false
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          // 阻止默认行为
          e.preventDefault();
          // 重置Profile导航栈到初始路由
          navigation.navigate('Profile', {
            screen: 'ProfileMain'
          });
        }
      })}
    />
  </Tab.Navigator>
);

// 应用导航容器
const AppNavigator = () => {
  // 使用authStore检查用户是否已登录
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  // 添加本地状态来跟踪认证状态
  const [authChecked, setAuthChecked] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); // 默认设置为未认证状态
  
  // 在组件挂载时检查用户认证状态 - 只在应用启动时执行一次
  useEffect(() => {
    // 检查用户认证状态（异步操作）
    const checkAuthStatus = async () => {
      try {
        console.log('正在检查认证状态...');
        // 设置一个超时，确保不会无限等待认证检查
        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            console.log('认证状态检查超时，默认为未认证');
            resolve(false);
          }, 5000); // 增加超时时间到5秒
        });
        
        // 使用Promise.race确保认证检查不会无限等待
        const authStatus = await Promise.race([
          checkAuth(),
          timeoutPromise
        ]);
        
        console.log('认证状态检查结果:', authStatus);
        // 确保认证状态是布尔值
        setIsUserAuthenticated(!!authStatus);
      } catch (error) {
        console.error('检查认证状态失败:', error);
        setIsUserAuthenticated(false);
      } finally {
        console.log('认证状态检查完成，设置authChecked为true');
        setAuthChecked(true);
      }
    };
    
    checkAuthStatus();
    // 空依赖数组确保这个效果只在组件挂载时运行一次
  }, []); // 移除checkAuth依赖，确保只在应用启动时执行一次
  
  // 监听认证状态变化，但只在应用启动时更新状态，避免在页面切换时错误跳转
  // 这个useEffect不再需要，因为我们只在应用启动时检查一次认证状态
  // 登录和退出操作会直接通过导航重置来处理，而不是依赖于状态变化
  
  // 根据用户登录状态设置初始路由，默认进入Login页面，强制用户登录
  // 只有登录后才能访问应用内容
  const initialRouteName = isUserAuthenticated ? "Main" : "Login";
  console.log('设置初始路由:', initialRouteName, '认证状态:', isUserAuthenticated);
  
  // 在认证状态检查完成前，显示加载状态或默认显示登录页面
  if (!authChecked) {
    console.log('认证状态检查未完成，默认显示登录页面');
    // 直接进入导航容器，默认显示登录页面
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {/* 认证相关页面 */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }}
        />
        
        {/* 主应用页面 */}
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
        
        {/* 详情页面已移至HomeStackNavigator */}
        
        {/* 论坛相关页面已移至ForumStackNavigator */}
        
        {/* 个人资料相关页面已移至ProfileStackNavigator */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;