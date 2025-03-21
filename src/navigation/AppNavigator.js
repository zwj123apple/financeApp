import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

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

// 创建导航器
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ForumStack = createStackNavigator();

// Home页面的子导航栈
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
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
  <ProfileStack.Navigator>
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
      name="HoldingDetail" 
      component={HoldingDetailScreen} 
      options={{ title: '持仓详情' }}
    />
  </ProfileStack.Navigator>
);

// Forum页面的子导航栈
const ForumStackNavigator = () => (
  <ForumStack.Navigator>
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

// 主页面底部标签导航
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
      // 添加重置导航栈的选项，确保每次点击底部标签时都会重置到该标签的初始页面
      unmountOnBlur: true,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStackNavigator} 
      options={{ title: '首页', headerShown: false }}
    />
    <Tab.Screen 
      name="Forum" 
      component={ForumStackNavigator} 
      options={{ title: '论坛', headerShown: false }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileStackNavigator} 
      options={{ title: '我的', headerShown: false }}
    />
  </Tab.Navigator>
);

// 应用导航容器
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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