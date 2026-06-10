import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Question, QaStatus } from '@/types';
import { mockQuestions } from '@/data/qa';
import EmptyState from '@/components/EmptyState';

type FilterType = 'all' | QaStatus | 'reward' | 'mine';

const QaPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [filter, setFilter] = useState<FilterType>('all');

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部问题' },
    { key: 'open', label: '待回答' },
    { key: 'resolved', label: '已解决' },
    { key: 'reward', label: '高悬赏' },
    { key: 'mine', label: '我的提问' }
  ];

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    if (filter === 'open' || filter === 'resolved') return q.status === filter;
    if (filter === 'reward') return q.reward >= 100;
    if (filter === 'mine') return q.userId === 'u001';
    return true;
  });

  const handleCollect = (qId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, isCollected: !q.isCollected };
      }
      return q;
    }));
    Taro.showToast({ title: '操作成功', icon: 'success' });
  };

  const handlePublish = () => {
    Taro.showToast({ title: '发布功能开发中', icon: 'none' });
  };

  const openQuestion = (q: Question) => {
    console.log('[QA] Open question:', q.id);
    Taro.showToast({ title: '详情页开发中', icon: 'none' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.topBar}>
        <Text className={styles.pageTitle}>问答悬赏</Text>
        <View className={styles.publishBtn} onClick={handlePublish}>
          <Text>+ 我要提问</Text>
        </View>
      </View>

      <ScrollView scrollX className={styles.filterRow}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterChip, filter === f.key && styles.filterActive)}
            onClick={() => setFilter(f.key)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </ScrollView>

      {filteredQuestions.length === 0 ? (
        <EmptyState title="暂无相关问题" description="换个筛选条件试试，或者发布第一个问题吧~" />
      ) : (
        <View className={styles.questionList}>
          {filteredQuestions.map(q => (
            <View
              key={q.id}
              className={styles.questionCard}
              onClick={() => openQuestion(q)}
            >
              <View className={styles.questionHeader}>
                <View className={styles.rewardBadge}>
                  <Text>💰 悬赏 ¥{q.reward}</Text>
                </View>
                <View
                  className={classnames(
                    styles.statusBadge,
                    q.status === 'resolved' ? styles.statusResolved : styles.statusOpen
                  )}
                >
                  <Text>{q.status === 'resolved' ? '✓ 已解决' : '● 待回答'}</Text>
                </View>
              </View>

              <Text className={styles.questionTitle}>{q.title}</Text>
              <Text className={styles.questionContent}>{q.content}</Text>

              <View className={styles.tagList}>
                {q.tags.map((tag, idx) => (
                  <View key={idx} className={styles.tagItem}>
                    <Text>#{tag}</Text>
                  </View>
                ))}
              </View>

              <View className={styles.questionFooter}>
                <View className={styles.userInfo}>
                  <Image className={styles.avatar} src={q.userInfo.avatar} mode="aspectFill" />
                  <Text className={styles.userName}>
                    {q.userInfo.anonymity === 'full-anonymous' ? '匿名同行' : q.userInfo.nickname}
                  </Text>
                </View>

                <View className={styles.actionRow}>
                  <View className={styles.statsRow}>
                    <View className={styles.statItem}>
                      <Text>👁 {q.views}</Text>
                    </View>
                    <View className={styles.statItem}>
                      <Text>💬 {q.answers}</Text>
                    </View>
                  </View>
                  <View
                    className={styles.collectBtn}
                    onClick={(e) => {
                      e.stopPropagation?.();
                      handleCollect(q.id);
                    }}
                  >
                    <Text>{q.isCollected ? '★' : '☆'}</Text>
                    <Text>{q.isCollected ? '已收藏' : '收藏'}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default QaPage;
