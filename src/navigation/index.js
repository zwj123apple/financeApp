import { enableScreens } from 'react-native-screens';
import { Platform } from 'react-native';

// 启用原生屏幕容器以提高性能
enableScreens(true);

// 配置react-native-screens以正确处理刘海屏
if (Platform.OS === 'ios') {
  // 确保内容不会被刘海遮挡
  if (Platform.isPad === false) {
    // 仅对iPhone设备应用此配置
    // 这里不需要额外代码，因为enableScreens(true)已经启用了原生屏幕
    // 结合app.json中的配置和SafeAreaProvider，应用将正确处理刘海屏
  }
}