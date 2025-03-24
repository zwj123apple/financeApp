import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar, SafeAreaView, useWindowDimensions } from 'react-native';
import { Text, Button, Icon, Divider, Card } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useTransactionStore } from '../store/transactionStore';
import theme from '../utils/theme';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const { transactions } = useTransactionStore();
  const { width } = useWindowDimensions();
  
  // 查找对应的交易记录
  const transaction = transactions.find(t => t.id === transactionId);
  
  // 如果没有找到交易记录
  if (!transaction) {
    return (
      <LinearGradient
        colors={theme.GRADIENTS.background}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.errorText}>未找到该交易记录</Text>
            <Button
              title="返回"
              onPress={() => navigation.goBack()}
              buttonStyle={styles.backButton}
              icon={{
                name: 'arrow-back',
                type: 'material',
                color: theme.COLORS.white,
                size: 20,
              }}
              iconPosition="left"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  
  // 确定是买入还是卖出交易
  const isBuyTransaction = transaction.type === '买入';
  
  // 根据交易类型选择颜色
  const transactionColor = isBuyTransaction ? theme.COLORS.error : theme.COLORS.success;
  // 保持顶部div颜色不变，使用主题的primary渐变
  const transactionGradient = theme.GRADIENTS.primary;
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* 顶部交易信息卡片 - 现代化设计 */}
          <Card containerStyle={styles.headerCard}>
            <LinearGradient
              colors={isBuyTransaction ? theme.GRADIENTS.error : theme.GRADIENTS.success}
              style={styles.headerGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <View style={styles.headerTopRow}>
                <View style={styles.headerIconContainer}>
                  <Icon
                    name={isBuyTransaction ? 'arrow-downward' : 'arrow-upward'}
                    type="material"
                    color={theme.COLORS.white}
                    size={24}
                  />
                </View>
                <Text style={styles.transactionType}>{transaction.type}</Text>
              </View>
              
              <View style={styles.headerContainer}>
                <View style={styles.headerInfo}>
                  <Text style={styles.productName}>{transaction.productName}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text style={styles.amount}>
                  {isBuyTransaction ? '-' : '+'}{transaction.amount}元
                </Text>
              </View>
            </LinearGradient>
          </Card>
          
          {/* 所有交易详情信息整合到一个大卡片中 */}
          <Card containerStyle={[styles.detailCard, styles.mainDetailCard]}>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, {color: transactionColor}]}>交易信息</Text>
              <Divider style={[styles.sectionDivider, {backgroundColor: transactionColor}]} />
              
              <View style={styles.detailContainer}>
                {/* 基本信息 */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>交易日期</Text>
                  <Text style={styles.detailValue}>{transaction.date}</Text>
                </View>
                
                {transaction.time && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>交易时间</Text>
                    <Text style={styles.detailValue}>{transaction.time}</Text>
                  </View>
                )}
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>交易状态</Text>
                  <Text style={[styles.detailValue, {color: theme.COLORS.success, fontWeight: theme.FONT_WEIGHTS.bold}]}>{transaction.status}</Text>
                </View>
                
                {transaction.transactionCode && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>交易编号</Text>
                    <Text style={styles.detailValue}>{transaction.transactionCode}</Text>
                  </View>
                )}
                
                {/* 交易详情 */}
                <View style={styles.sectionSeparator} />
                
                {isBuyTransaction && transaction.purchasePrice && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>购买价格</Text>
                    <Text style={styles.detailValue}>{transaction.purchasePrice}元</Text>
                  </View>
                )}
                
                {!isBuyTransaction && transaction.sellPrice && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>卖出价格</Text>
                    <Text style={styles.detailValue}>{transaction.sellPrice}元</Text>
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
                
                {transaction.paymentMethod && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>支付方式</Text>
                    <Text style={styles.detailValue}>{transaction.paymentMethod}</Text>
                  </View>
                )}
                
                {transaction.redemptionMethod && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>赎回方式</Text>
                    <Text style={styles.detailValue}>{transaction.redemptionMethod}</Text>
                  </View>
                )}
                
                {transaction.bankAccount && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>银行账户</Text>
                    <Text style={styles.detailValue}>{transaction.bankAccount}</Text>
                  </View>
                )}
                
                {transaction.accountInfo && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>账户信息</Text>
                    <Text style={styles.detailValue}>{transaction.accountInfo}</Text>
                  </View>
                )}
                
                {/* 产品信息 */}
                <View style={styles.sectionSeparator} />
                
                <View style={styles.detailContainer}>
                  {transaction.riskLevel && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>风险等级</Text>
                      <Text style={styles.detailValue}>{transaction.riskLevel}</Text>
                    </View>
                  )}
                  
                  {transaction.expectedReturn && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>预期收益</Text>
                      <Text style={styles.detailValue}>{transaction.expectedReturn}</Text>
                    </View>
                  )}
                  
                  {transaction.actualReturn && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>实际收益</Text>
                      <Text style={styles.detailValue}>{transaction.actualReturn}</Text>
                    </View>
                  )}
                  
                  {transaction.maturityDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>到期日期</Text>
                      <Text style={styles.detailValue}>{transaction.maturityDate}</Text>
                    </View>
                  )}
                  
                  {transaction.settlementDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>结算日期</Text>
                      <Text style={styles.detailValue}>{transaction.settlementDate}</Text>
                    </View>
                  )}
                  
                  {transaction.fundManager && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>基金经理</Text>
                      <Text style={styles.detailValue}>{transaction.fundManager}</Text>
                    </View>
                  )}
                  
                  {/* 备注信息 */}
                  {transaction.remark && (
                    <>
                      <View style={styles.sectionSeparator} />
                      <View style={styles.remarkContainer}>
                        <Text style={styles.remarkLabel}>备注</Text>
                        <Text style={styles.remarkText}>{transaction.remark}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Card>
          
          <Button
            title="返回"
            onPress={() => navigation.goBack()}
            buttonStyle={[styles.backButton, {backgroundColor: transactionColor}]}
            containerStyle={styles.buttonContainer}
            icon={{
              name: 'arrow-back',
              type: 'material',
              color: theme.COLORS.white,
              size: 20,
            }}
            iconPosition="left"
          />
          
          {/* 添加底部填充，确保内容不被底部导航栏遮挡 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.COLORS.backgroundLight // 确保背景色与主题一致
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: theme.SPACING.xs, // 减小左右间距，使内容更充分利用屏幕空间
    paddingTop: theme.SPACING.sm, // 减小顶部内边距
    paddingBottom: theme.SPACING.sm // 减小底部内边距
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.lg
  },
  errorText: {
    textAlign: 'center',
    marginVertical: theme.SPACING.lg,
    color: theme.COLORS.error,
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  headerCard: {
    padding: 0,
    margin: theme.SPACING.xxs, // 减小外边距
    marginBottom: theme.SPACING.sm, // 减小底部外边距
    borderRadius: theme.BORDER_RADIUS.lg,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  headerGradient: {
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.sm, // 减小内边距
    overflow: 'hidden'
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs // 减小底部外边距
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.sm
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  headerInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.xs
  },
  transactionDate: {
    fontSize: theme.FONT_SIZES.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.FONT_WEIGHTS.medium
  },
  transactionType: {
    fontSize: theme.FONT_SIZES.md,
    color: theme.COLORS.white,
    fontWeight: theme.FONT_WEIGHTS.semibold
  },
  statusText: {
    color: theme.COLORS.success,
    fontWeight: theme.FONT_WEIGHTS.bold
  },
  remarkContainer: {
    marginTop: theme.SPACING.xs,
    padding: theme.SPACING.sm
  },
  remarkText: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.text,
    lineHeight: 20,
    backgroundColor: theme.COLORS.backgroundLight,
    padding: theme.SPACING.md,
    borderRadius: theme.BORDER_RADIUS.sm
  },
  buttonContainer: {
    marginTop: theme.SPACING.sm, // 进一步减小顶部边距
    marginBottom: theme.SPACING.sm, // 减小底部边距
    width: '100%',
    paddingHorizontal: theme.SPACING.sm // 保持水平内边距
  },
  backButton: {
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.sm
  },
  bottomPadding: {
    height: 40 // 减小底部填充高度
  },
  cardConnector: {
    width: 2,
    height: 20,
    backgroundColor: theme.COLORS.borderLight,
    alignSelf: 'center',
    marginVertical: -theme.SPACING.xs // 负边距使连接器与卡片更紧密
  },
  cardDivider: {
    marginHorizontal: theme.SPACING.sm,
    backgroundColor: theme.COLORS.borderLight,
    height: 1
  },
  // 添加缺失的detailCard样式
  detailCard: {
    padding: theme.SPACING.xs, // 减小内边距
    margin: theme.SPACING.xxs,
    marginBottom: theme.SPACING.xs, // 减小底部外边距
    borderRadius: theme.BORDER_RADIUS.md,
    elevation: 3,
    shadowColor: theme.COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 0,
    backgroundColor: theme.COLORS.white
  },
  mainDetailCard: {
    marginTop: theme.SPACING.xs, // 减小顶部外边距
    marginBottom: theme.SPACING.sm // 减小底部外边距
  },
  sectionContainer: {
    padding: theme.SPACING.xs // 减小内边距
  },
  sectionTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    marginBottom: theme.SPACING.xs
  },
  sectionDivider: {
    marginVertical: theme.SPACING.xs, // 减小垂直外边距
    height: 2
  },
  detailContainer: {
    marginTop: theme.SPACING.xs // 减小顶部外边距
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.SPACING.xxs, // 减小垂直内边距
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.borderLight
  },
  detailLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    flex: 1
  },
  detailValue: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.text,
    fontWeight: theme.FONT_WEIGHTS.medium,
    textAlign: 'right',
    flex: 1
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: theme.COLORS.borderLight,
    marginVertical: theme.SPACING.sm // 减小垂直外边距
  },
  remarkLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    marginBottom: theme.SPACING.xs
  },
  amount: {
    fontSize: theme.FONT_SIZES.xxl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.white,
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)'
  }
});

export default TransactionDetailScreen;