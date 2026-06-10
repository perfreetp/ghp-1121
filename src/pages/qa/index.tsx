import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Question, QaStatus, Answer } from '@/types';
import { mockQuestions, mockAnswers } from '@/data/qa';
import { mockUsers } from '@/data/users';
import EmptyState from '@/components/EmptyState';

type FilterType = 'all' | QaStatus | 'reward' | 'mine';

const QaPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReward, setNewReward] = useState('50');
  const [newTags, setNewTags] = useState('');

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

  const getBestAnswer = (q: Question): Answer | null => {
    return mockAnswers.find(a => a.id === q.bestAnswerId) || q.answersList?.find(a => a.isBest) || null;
  };

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
    setShowPublishModal(true);
  };

  const cancelPublish = () => {
    setShowPublishModal(false);
    setNewTitle('');
    setNewContent('');
    setNewReward('50');
    setNewTags('');
  };

  const submitQuestion = () => {
    if (!newTitle.trim()) {
      Taro.showToast({ title: '请填写问题标题', icon: 'none' });
      return;
    }
    if (!newContent.trim()) {
      Taro.showToast({ title: '请填写详细描述', icon: 'none' });
      return;
    }
    const rewardNum = parseInt(newReward);
    if (!rewardNum || rewardNum <= 0) {
      Taro.showToast({ title: '悬赏金额必须大于0', icon: 'none' });
      return;
    }
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newQuestion: Question = {
      id: 'q' + Date.now(),
      userId: 'u001',
      userInfo: mockUsers[0],
      title: newTitle.trim(),
      content: newContent.trim(),
      images: [],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      reward: rewardNum,
      status: 'open',
      createdAt: dateStr,
      views: 0,
      answers: 0,
      isCollected: false
    };
    setQuestions(prev => [newQuestion, ...prev]);
    Taro.showToast({ title: '发布成功', icon: 'success' });
    cancelPublish();
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

              {q.status === 'resolved' && getBestAnswer(q) && (
                <View className={styles.bestAnswerBox}>
                  <View className={styles.bestAnswerHeader}>
                    <Text className={styles.bestAnswerBadge}>🏆 最佳答案</Text>
                    <Text className={styles.bestAnswerUser}>
                      from {getBestAnswer(q)!.userInfo.nickname}
                    </Text>
                  </View>
                  <Text className={styles.bestAnswerContent}>{getBestAnswer(q)!.content}</Text>
                  <View className={styles.bestAnswerFooter}>
                    <Text className={styles.bestAnswerLikes}>♥ {getBestAnswer(q)!.likes}</Text>
                    <Text className={styles.bestAnswerTime}>{getBestAnswer(q)!.createdAt}</Text>
                  </View>
                </View>
              )}

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

      {showPublishModal && (
        <View className={styles.modalMask} onClick={cancelPublish}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>发布新问题</Text>
              <Text className={styles.modalClose} onClick={cancelPublish}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>问题标题 <Text style={{color:'#E74C3C'}}>*</Text></Text>
                <Input className={styles.formInput} placeholder="一句话描述你的问题..." value={newTitle} onInput={e => setNewTitle(e.detail.value)} maxLength={50}/>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>详细描述 <Text style={{color:'#E74C3C'}}>*</Text></Text>
                <Textarea className={styles.formTextarea} placeholder="描述背景、遇到的困难、希望得到怎样的帮助..." value={newContent} onInput={e => setNewContent(e.detail.value)} maxLength={1000}/>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>悬赏金额(元) <Text style={{color:'#E74C3C'}}>*</Text></Text>
                <View className={styles.rewardRow}>
                  {[20, 50, 100, 200, 500].map(amount => (
                    <View key={amount} className={`${styles.rewardChip} ${parseInt(newReward) === amount ? styles.rewardChipActive : ''}`} onClick={() => setNewReward(String(amount))}>
                      <Text>¥{amount}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>标签（逗号分隔）</Text>
                <Input className={styles.formInput} placeholder="如：火化技巧,骨灰收集,新人求助" value={newTags} onInput={e => setNewTags(e.detail.value)}/>
              </View>
            </ScrollView>
            <View className={styles.modalFooter}>
              <View className={styles.submitBtn} onClick={submitQuestion}>
                <Text>发布悬赏</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default QaPage;
