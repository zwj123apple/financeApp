import React from 'react';
import { StyleSheet } from 'react-native';
import { Overlay, Text, Button } from '@rneui/themed';
import { useErrorStore } from '../store/errorStore';

/**
 * 错误提示模态框组件
 * 用于统一显示应用中的错误信息
 */
const ErrorModal = () => {
  const { error, isVisible, clearError } = useErrorStore();

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={clearError}
      overlayStyle={styles.overlay}
    >
      <Text style={styles.title}>提示</Text>
      <Text style={styles.message}>{error}</Text>
      <Button
        title="确定"
        onPress={clearError}
        buttonStyle={styles.button}
      />
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  button: {
    paddingHorizontal: 30
  }
});

export default ErrorModal;