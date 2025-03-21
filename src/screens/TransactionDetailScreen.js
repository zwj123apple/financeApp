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
  
  return (
    <LinearGradient
      colors={theme.GRADIENTS.background}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* 顶部交易信息卡片 */}
          <Card containerStyle={styles.headerCard}>
            <LinearGradient
              colors={isBuyTransaction ? theme.GRADIENTS.primary : theme.GRADIENTS.success}
              style={styles.headerGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <View style={styles.headerContainer}>
                <View style={styles.headerIconContainer}>
                  <Icon
                    name={isBuyTransaction ? 'arrow-downward' : 'arrow-upward'}
                    type="material"
                    color={theme.COLORS.white}
                    size={36}
                  />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.productName}>{transaction.productName}</Text>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                </View>
                <Text style={styles.amount}>
                  {isBuyTransaction ? '-' : '+'}{transaction.amount}元
                </Text>
              </View>
            </LinearGradient>
          </Card>
          
          {/* 连接元素 */}
          <View style={styles.cardConnector} />
          
          {/* 交易基本信息卡片 */}
          <Card containerStyle={styles.detailCard}>
            <Card.Title style={styles.cardTitle}>基本信息</Card.Title>
            <Card.Divider style={styles.cardDivider} />
            
            <View style={styles.detailContainer}>
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
                <Text style={[styles.detailValue, styles.statusText]}>{transaction.status}</Text>
              </View>
              
              {transaction.transactionCode && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>交易编号</Text>
                  <Text style={styles.detailValue}>{transaction.transactionCode}</Text>
                </View>
              )}
            </View>
          </Card>
          
          {/* 连接元素 */}
          <View style={styles.cardConnector} />
          
          {/* 交易详细信息卡片 */}
          <Card containerStyle={styles.detailCard}>
            <Card.Title style={styles.cardTitle}>交易详情</Card.Title>
            <Card.Divider style={styles.cardDivider} />
            
            <View style={styles.detailContainer}>
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
            </View>
          </Card>
          
          {/* 连接元素 */}
          <View style={styles.cardConnector} />
          
          {/* 产品信息卡片 */}
          <Card containerStyle={styles.detailCard}>
            <Card.Title style={styles.cardTitle}>产品信息</Card.Title>
            <Card.Divider style={styles.cardDivider} />
            
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
            </View>
          </Card>
          
          {/* 连接元素 */}
          {transaction.remark && <View style={styles.cardConnector} />}
          
          {/* 备注信息卡片 */}
          {transaction.remark && (
            <Card containerStyle={styles.detailCard}>
              <Card.Title style={styles.cardTitle}>备注</Card.Title>
              <Card.Divider style={styles.cardDivider} />
              
              <View style={styles.remarkContainer}>
                <Text style={styles.remarkText}>{transaction.remark}</Text>
              </View>
            </Card>
          )}
          
          <Button
            title="返回"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.backButton}
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
    paddingTop: theme.SPACING.md,
    paddingBottom: theme.SPACING.md
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
    margin: theme.SPACING.xxs, // 减小边距
    marginBottom: theme.SPACING.sm, // 减小底部边距
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: theme.COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 0,
    backgroundColor: theme.COLORS.white // 确保背景色与主题一致
  },
  headerGradient: {
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.SPACING.md
  },
  headerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.SPACING.md
  },
  headerInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.FONT_SIZES.lg,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.xxs
  },
  transactionType: {
    fontSize: theme.FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  amount: {
    fontSize: theme.FONT_SIZES.xl,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.white
  },
  detailCard: {
    borderRadius: theme.BORDER_RADIUS.md,
    margin: theme.SPACING.xxs, // 减小边距
    marginBottom: theme.SPACING.sm, // 减小底部边距
    padding: theme.SPACING.sm,
    elevation: 2,
    shadowColor: theme.COLORS.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 0,
    backgroundColor: theme.COLORS.white // 确保背景色与主题一致
  },
  cardTitle: {
    fontSize: theme.FONT_SIZES.md,
    fontWeight: theme.FONT_WEIGHTS.bold,
    color: theme.COLORS.primary,
    textAlign: 'left',
    marginBottom: 0,
    marginTop: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.COLORS.primary,
    paddingLeft: theme.SPACING.sm
  },
  detailContainer: {
    marginTop: theme.SPACING.xs
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.COLORS.borderLight,
    marginHorizontal: theme.SPACING.xxs // 添加水平边距，改善内部布局
  },
  detailLabel: {
    fontSize: theme.FONT_SIZES.sm,
    color: theme.COLORS.textLight,
    flex: 1
  },
  detailValue: {
    fontSize: theme.FONT_SIZES.sm,
    fontWeight: theme.FONT_WEIGHTS.medium,
    color: theme.COLORS.text,
    textAlign: 'right',
    flex: 1
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
    marginTop: theme.SPACING.md, // 减小顶部边距
    marginBottom: theme.SPACING.md,
    width: '100%',
    paddingHorizontal: theme.SPACING.sm // 减小水平内边距
  },
  backButton: {
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: theme.SPACING.sm
  },
  bottomPadding: {
    height: 60 // 为底部导航栏预留空间
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
  }
});

export default TransactionDetailScreen;