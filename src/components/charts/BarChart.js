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
          // 更新为更鲜艳的配色方案
          color: (opacity = 1, index) => {
            // 使用主题中定义的鲜艳图表颜色
            const colors = [
              'rgba(37, 99, 235, 1)', // 蓝色
              'rgba(16, 185, 129, 1)', // 绿色
              'rgba(245, 158, 11, 1)', // 橙色
              'rgba(139, 92, 246, 1)', // 紫色
              'rgba(236, 72, 153, 1)', // 粉色
              'rgba(20, 184, 166, 1)', // 青色
              'rgba(244, 63, 94, 1)', // 红色
              'rgba(99, 102, 241, 1)'  // 靛蓝色
            ];
            // 根据数据值的正负选择颜色
            if (data.datasets[0].data[index] >= 0) {
              return `rgba(16, 185, 129, ${opacity})`; // 正值使用绿色
            } else {
              return `rgba(244, 63, 94, ${opacity})`; // 负值使用红色
            }
          },
          labelColor: (opacity = 1) => theme.colors.grey1,
          style: {
            borderRadius: 16
          },
          barPercentage: 0.7,
          propsForLabels: {
            fontSize: 10,
            fontWeight: '500'
          },
          // 移除填充渐变，使用纯色
          fillShadowGradient: null,
          fillShadowGradientOpacity: 1,
          // 修改网格线样式
          propsForBackgroundLines: {
            strokeDasharray: '', // 移除虚线
            stroke: 'rgba(0, 0, 0, 0.05)', // 更淡的网格线颜色
            strokeWidth: 1
          }
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