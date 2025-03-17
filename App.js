import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// 导入主题配置
import theme from './src/utils/theme';

// 定义应用全局主题
const appTheme = {
  colors: theme.COLORS,
  // 响应式字体大小
  fontSizes: theme.FONT_SIZES,
  // 响应式间距
  spacing: theme.SPACING,
  // 边框圆角
  borderRadius: theme.BORDER_RADIUS,
  // 阴影样式
  shadows: theme.SHADOWS
};

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider theme={appTheme}>
        <AppNavigator />
        <StatusBar 
          style="auto" 
          translucent={Platform.OS === 'ios'}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
