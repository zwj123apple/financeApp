import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Text, Button, Icon, Divider } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../store';
import theme from '../utils/theme';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const transactions = useSelector(selectTransactions);
  
  // 查找对应的交易记录
  const transaction = transactions.find(t => t.id === transactionId);
  
  // 如果没有找到交易记录
  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>未找到该交易记录</Text>
          <Button
            title="返回"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.COLORS.backgroundLight} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Icon
              name={transaction.type === '买入' ? 'arrow-downward' : 'arrow-upward'}
              type="material"
              color={transaction.type === '买入' ? '#4CAF50' : '#F44336'}
              size={40}
              containerStyle={styles.iconContainer}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.productName}>{transaction.productName}</Text>
              <Text style={styles.transactionType}>{transaction.type}</Text>
            </View>
            <Text
              style={[styles.amount, transaction.type === '买入' ? styles.buyAmount : styles.sellAmount]}
            >
              {transaction.type === '买入' ? '-' : '+'}{transaction.amount}元
            </Text>
          </View>
          <Divider style={styles.divider} />
          
          <View style={styles.detailContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>交易日期</Text>
              <Text style={styles.detailValue}>{transaction.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>交易状态</Text>
              <Text style={styles.detailValue}>{transaction.status}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>交易编号</Text>
              <Text style={styles.detailValue}>{transaction.id}</Text>
            </View>
            
            {transaction.purchasePrice && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>购买价格</Text>
                <Text style={styles.detailValue}>{transaction.purchasePrice}元</Text>
              </View>
            )}
            
            {transaction.quantity && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>数量</Text>
                <Text style={styles.detailValue}>{transaction.quantity}</Text>
              </View>
            )}
            
            {transaction.fee && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>手续费</Text>
                <Text style={styles.detailValue}>{transaction.fee}元</Text>
              </View>
            )}
            
            {transaction.remark && (
              <View style={styles.remarkContainer}>
                <Text style={styles.detailLabel}>备注</Text>
                <Text style={styles.remarkText}>{transaction.remark}</Text>
              </View>
            )}
          </View>
          
          <Button
            title="返回"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.backButton}
            containerStyle={styles.buttonContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: theme.SPACING.md,
  },
  contentContainer: {
    flex: 1,
    padding: theme.SPACING.md,
  },
  title: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginVertical: theme.SPACING.sm,
    textAlign: 'center',
  },
  divider: {
    marginVertical: theme.SPACING.sm,
    backgroundColor: theme.COLORS.borderLight,
    height: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.COLORS.cardBackground,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginVertical: theme.SPACING.sm,
    ...theme.SHADOWS.md,
  },
  iconContainer: {
    backgroundColor: theme.COLORS.backgroundLight,
    borderRadius: theme.BORDER_RADIUS.round,
    padding: theme.SPACING.xs,
    marginRight: theme.SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.semibold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs,
  },
  transactionType: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
  },
  amount: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
  },
  buyAmount: {
    color: theme.COLORS.error,
  },
  sellAmount: {
    color: theme.COLORS.success,
  },
  detailContainer: {
    backgroundColor: theme.COLORS.cardBackground,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginVertical: theme.SPACING.sm,
    ...theme.SHADOWS.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight,
  },
  detailLabel: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textLight,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textDark,
    fontWeight: theme.FONT_WEIGHTS.medium,
    textAlign: 'right',
    flex: 1,
  },
  remarkContainer: {
    marginTop: theme.SPACING.sm,
    paddingTop: theme.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.borderLight,
  },
  remarkText: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.textDark,
    marginTop: theme.SPACING.xs,
  },
  backButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.BORDER_RADIUS.sm,
    paddingVertical: theme.SPACING.sm,
  },
  buttonContainer: {
    marginTop: theme.SPACING.md,
  },
  errorText: {
    fontSize: theme.FONT_SIZES.lg,
    color: theme.COLORS.error,
    textAlign: 'center',
    marginVertical: theme.SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionDetailScreen;