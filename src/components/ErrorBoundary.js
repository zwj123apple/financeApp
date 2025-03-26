import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import theme from '../utils/theme';

/**
 * 错误边界组件，用于捕获子组件树中的JavaScript错误
 * 并显示备用UI，防止整个应用崩溃
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，下次渲染时显示备用UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 可以在这里记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // 自定义备用UI
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>出现了一些问题</Text>
          <Text style={styles.errorMessage}>
            {this.props.fallbackMessage || '应用遇到了错误，请尝试重新加载。'}
          </Text>
          <Button
            title="重试"
            onPress={this.resetError}
            buttonStyle={styles.retryButton}
            titleStyle={styles.buttonTitle}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.lg,
    backgroundColor: theme.COLORS.background,
  },
  errorTitle: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.error,
    marginBottom: theme.SPACING.md,
  },
  errorMessage: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textDark,
    textAlign: 'center',
    marginBottom: theme.SPACING.lg,
  },
  retryButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.md,
    paddingHorizontal: theme.SPACING.lg,
  },
  buttonTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.medium,
  },
});

export default ErrorBoundary;