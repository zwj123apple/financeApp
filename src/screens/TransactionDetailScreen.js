import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Text, Button, Icon, Divider } from '@rneui/themed';
import { useTransactionStore } from '../store/transactionStore';
import theme from '../utils/theme';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const { transactions } = useTransactionStore();
  
  // 查找对应的交易记录
  const transaction = transactions.find(t => t.id === transactionId);
  
  // 如果没有找到交易记录
  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>交易详情</Text>
          <Divider style={styles.divider} />
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
          <Text style={styles.title}>交易详情</Text>
          <Divider style={styles.divider} />
          
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
          
          {/* 添加底部填充，确保内容不被底部导航栏遮挡 */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.backgroundLight
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: theme.SPACING.md,
    paddingTop: theme.SPACING.md,
    paddingBottom: theme.SPACING.md
  },
  contentContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.sm
  },
  title: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.textDark,
    marginBottom: theme.SPACING.xs,
    textAlign: 'center'
  },
  divider: {
    marginVertical: theme.SPACING.md
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    color: theme.COLORS.error
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.SPACING.md
  },
  iconContainer: {
    backgroundColor: theme.COLORS.backgroundLight,
    padding: 10,
    borderRadius: 50
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15
  },
  productName: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  transactionType: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginTop: 5
  },
  amount: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  buyAmount: {
    color: theme.COLORS.error
  },
  sellAmount: {
    color: theme.COLORS.success
  },
  detailContainer: {
    marginBottom: theme.SPACING.md
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  detailLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight
  },
  detailValue: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  remarkContainer: {
    marginTop: 10
  },
  remarkText: {
    fontSize: theme.FONT_SIZES.sm,
    marginTop: 5,
    color: theme.COLORS.text,
    backgroundColor: theme.COLORS.backgroundLight,
    padding: 10,
    borderRadius: theme.BORDER_RADIUS.sm
  },
  buttonContainer: {
    marginTop: theme.SPACING.md
  },
  backButton: {
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.primary
  },
  bottomPadding: {
    height: 60 // 为底部导航栏预留空间
  }
});

export default TransactionDetailScreen;