import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { mockCreditRecords, creditRules } from '@/data/credit';

const CreditPage: React.FC = () => {
  const currentScore = 958;

  const getScoreLevel = (score: number) => {
    if (score >= 900) return '信誉极佳';
    if (score >= 800) return '信誉优秀';
    if (score >= 700) return '信誉良好';
    if (score >= 600) return '信誉一般';
    return '信誉较差';
  };

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.scoreHeader}>
        <Text className={styles.scoreValue}>{currentScore}</Text>
        <View className={styles.scoreLevel}>
          <Text>{getScoreLevel(currentScore)}</Text>
        </View>
        <Text className={styles.scoreLabel}>当前信用分</Text>
      </View>

      <View className={styles.explanationCard}>
        <Text className={styles.explanationText}>
          信用分是平台衡量用户信誉的核心指标，初始分为 800 分。
          通过完成职业认证、发布优质内容、参与社区互动等方式可提升信用分；
          发布违规内容、恶意举报等行为将被扣减信用分。
          信用分越高，在平台内享有更多权益与信任。
        </Text>
      </View>

      <View className={styles.card}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>📋</Text>
          <Text className={styles.cardTitle}>信用规则</Text>
        </View>
        <View className={styles.rulesList}>
          {creditRules.map((rule, idx) => (
            <View key={idx} className={styles.ruleItem}>
              <View className={`${styles.ruleType} ${rule.type === 'plus' ? styles.ruleTypePlus : styles.ruleTypeMinus}`}>
                <Text>{rule.type === 'plus' ? '+' : '-'}</Text>
              </View>
              <View className={styles.ruleContent}>
                <View className={styles.ruleItemRow}>
                  <Text className={styles.ruleItemName}>{rule.item}</Text>
                  <Text className={`${styles.ruleScore} ${rule.type === 'plus' ? styles.ruleScorePlus : styles.ruleScoreMinus}`}>
                    {rule.score}
                  </Text>
                </View>
                <Text className={styles.ruleDesc}>{rule.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.card}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>📜</Text>
          <Text className={styles.cardTitle}>信用记录</Text>
        </View>
        <View className={styles.timelineList}>
          {mockCreditRecords.map(record => (
            <View key={record.id} className={styles.timelineItem}>
              <View className={`${styles.timelineDot} ${record.type === 'plus' ? styles.timelineDotPlus : styles.timelineDotMinus}`}>
                <Text>{record.type === 'plus' ? '+' : '-'}</Text>
              </View>
              <View className={styles.timelineContent}>
                <View className={styles.timelineTop}>
                  <Text className={styles.timelineReason}>{record.reason}</Text>
                  <Text className={`${styles.timelineAmount} ${record.type === 'plus' ? styles.timelineAmountPlus : styles.timelineAmountMinus}`}>
                    {record.type === 'plus' ? '+' : '-'}{record.amount}
                  </Text>
                </View>
                <Text className={styles.timelineTime}>{record.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CreditPage;
