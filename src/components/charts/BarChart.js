import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { useTheme } from '@rneui/themed';

/**
 * 响应式柱状图组件
 * @param {Object} props
 * @param {Array} props.data - 柱状图数据，格式为 {labels: ['标签1', '标签2'], datasets: [{data: [值1, 值2]}]}
 * @param {String} props.title - 图表标题
 * @param {Number} props.height - 图表高度
 * @param {Number} props.width - 图表宽度，如果不提供则使用屏幕宽度减去边距
 * @param {String} props.yAxisSuffix - Y轴后缀
 * @param {Boolean} props.showValuesOnTopOfBars - 是否在柱子顶部显示数值
 */
const BarChart = ({ 
  data = {labels: [], datasets: [{data: []}]}, 
  title = '柱状图', 
  height = 220,
  width,
  yAxisSuffix = '',
  showValuesOnTopOfBars = false
}) => {
  const { theme } = useTheme();
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const dimensions = useWindowDimensions();
  const screenWidth = width || dimensions.width - 32; // 如果提供了width则使用，否则使用屏幕宽度减去边距
  
  // 如果没有数据，显示空状态
  if (!data.datasets[0].data.length) {
    return (
      <View style={[styles.container, { height, width: screenWidth }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无数据</Text>
          <Text style={styles.emptySubText}>请添加资产后查看</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <Text style={styles.title}>{title}</Text>
      <RNBarChart
        data={data}
        width={screenWidth}
        height={height}
        yAxisSuffix={yAxisSuffix}
        chartConfig={{
          backgroundColor: theme.colors.background,
          backgroundGradientFrom: theme.colors.background,
          backgroundGradientTo: theme.colors.background,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          labelColor: (opacity = 1) => theme.colors.grey1,
          style: {
            borderRadius: 16
          },
          barPercentage: 0.7,
          propsForLabels: {
            fontSize: 10,
            fontWeight: '500'
          },
          fillShadowGradient: theme.colors.secondary,
          fillShadowGradientOpacity: 0.8
        }}
        showValuesOnTopOfBars={showValuesOnTopOfBars}
        fromZero
        style={{
          marginVertical: 8,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3
        }}
        withInnerLines={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    borderRadius: 8,
    padding: 16,
    width: '100%'
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic'
  }
});

export default BarChart;