import React from 'react';
import { View, Text, Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { useTheme } from '@rneui/themed';

/**
 * 响应式饼图组件
 * @param {Object} props
 * @param {Array} props.data - 饼图数据，格式为 [{name: '名称', value: 数值, color: '颜色代码'}]
 * @param {String} props.title - 图表标题
 * @param {Boolean} props.showLegend - 是否显示图例
 * @param {Number} props.height - 图表高度
 * @param {Number} props.width - 图表宽度，如果不提供则使用屏幕宽度减去边距
 */
const PieChart = ({ 
  data = [], 
  title = '饼图', 
  showLegend = true, 
  height = 220,
  width
}) => {
  const { theme } = useTheme();
  // 使用useWindowDimensions钩子获取屏幕尺寸，这样在屏幕旋转或尺寸变化时会自动更新
  const dimensions = useWindowDimensions();
  const screenWidth = width || dimensions.width - 32; // 如果提供了width则使用，否则使用屏幕宽度减去边距
  
  // 转换数据格式以适应图表库
  const chartData = data.map(item => ({
    name: item.name,
    population: item.value,
    color: item.color || theme.colors.primary,
    legendFontColor: theme.colors.grey1,
    legendFontSize: 12
  }));
  
  // 如果没有数据，显示空状态
  if (!data.length) {
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
      <View style={styles.chartWrapper}>
        <RNPieChart
          data={chartData}
          width={screenWidth}
          height={height}
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: (opacity = 1) => theme.colors.grey1,
            style: {
              borderRadius: 16
            },
            propsForLabels: {
              fontSize: 10,
              fontWeight: '500'
            }
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={showLegend}
          center={[screenWidth / 2, 0]} // 调整中心点位置，使饼图在不同屏幕尺寸下都能正确居中显示
          avoidFalseZero
          style={{
            marginVertical: 8,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden' // 防止图表溢出
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

export default PieChart;