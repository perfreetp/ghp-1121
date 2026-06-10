import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { CaseItem, CaseType } from '@/types';
import { useAppStore } from '@/store/appStore';
import EmptyState from '@/components/EmptyState';

type CategoryFilter = 'all' | CaseType;
type SortType = 'latest' | 'popular' | 'liked';

const CasesPage: React.FC = () => {
  const cases = useAppStore(s => s.cases);
  const toggleCaseLike = useAppStore(s => s.toggleCaseLike);
  const toggleCollected = useAppStore(s => s.toggleCollected);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortType>('latest');

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const categories: { key: CategoryFilter; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📁' },
    { key: 'pet-funeral', label: '宠物殡葬', icon: '🐾' },
    { key: 'body-grooming', label: '遗体整理', icon: '🕊' },
    { key: 'memorial', label: '纪念策划', icon: '💐' },
    { key: 'other', label: '其他', icon: '📋' }
  ];

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'latest', label: '最新发布' },
    { key: 'popular', label: '最多浏览' },
    { key: 'liked', label: '最多点赞' }
  ];

  const getFilteredCases = () => {
    let result = [...cases];
    if (category !== 'all') {
      result = result.filter(c => c.type === category);
    }
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'liked':
        result.sort((a, b) => b.likes - a.likes);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  };

  const filteredCases = getFilteredCases();

  const handleLike = (id: string) => {
    toggleCaseLike(id);
  };

  const handleCollect = (id: string) => {
    toggleCollected('case', id);
  };

  const openCase = (c: CaseItem) => {
    console.log('[Cases] Open case:', c.id);
    Taro.showToast({ title: '详情页开发中', icon: 'none' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.topBar}>
        <Text className={styles.pageTitle}>案例库</Text>
        <View className={styles.statsBadge}>
          <Text>共 {cases.length} 篇案例</Text>
        </View>
      </View>

      <View className={styles.categoryRow}>
        {categories.map(cat => (
          <View
            key={cat.key}
            className={classnames(styles.categoryItem, category === cat.key && styles.categoryActive)}
            onClick={() => setCategory(cat.key)}
          >
            <View className={styles.categoryIcon}>
              <Text>{cat.icon}</Text>
            </View>
            <Text className={styles.categoryLabel}>{cat.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.sortRow}>
        {sortOptions.map(opt => (
          <View
            key={opt.key}
            className={classnames(styles.sortItem, sortBy === opt.key && styles.sortActive)}
            onClick={() => setSortBy(opt.key)}
          >
            <Text>{sortBy === opt.key ? '●' : '○'}</Text>
            <Text>{opt.label}</Text>
          </View>
        ))}
      </View>

      {filteredCases.length === 0 ? (
        <EmptyState title="暂无相关案例" description="快来分享你的第一个案例吧~" />
      ) : (
        <View className={styles.caseList}>
          {filteredCases.map(c => (
            <View
              key={c.id}
              className={styles.caseCard}
              onClick={() => openCase(c)}
            >
              <Image className={styles.caseCover} src={c.cover} mode="aspectFill" />
              <View className={styles.caseContent}>
                <View className={styles.typeTag}>
                  <Text>{c.typeName}</Text>
                </View>
                <Text className={styles.caseTitle}>{c.title}</Text>
                <Text className={styles.caseDesc}>{c.description}</Text>

                <View className={styles.metaRow}>
                  <View className={styles.metaItems}>
                    <Text>📅 {c.createdAt}</Text>
                    <Text>⏱ {c.duration}</Text>
                  </View>
                  {c.fee && (
                    <View className={styles.feeBadge}>
                      <Text>参考 ¥{c.fee.toLocaleString()}</Text>
                    </View>
                  )}
                </View>

                <View className={styles.caseFooter}>
                  <View className={styles.userInfo}>
                    <Image className={styles.avatar} src={c.userInfo.avatar} mode="aspectFill" />
                    <Text className={styles.userName}>
                      {c.userInfo.anonymity === 'full-anonymous' ? '匿名同行' : c.userInfo.nickname}
                    </Text>
                  </View>

                  <View className={styles.actions}>
                    <View
                      className={classnames(styles.actionBtn, c.isLiked && styles.actionLiked)}
                      onClick={(e) => { e.stopPropagation?.(); handleLike(c.id); }}
                    >
                      <Text>{c.isLiked ? '♥' : '♡'}</Text>
                      <Text>{c.likes}</Text>
                    </View>
                    <View className={styles.actionBtn}>
                      <Text>👁</Text>
                      <Text>{c.views}</Text>
                    </View>
                    <View
                      className={classnames(styles.actionBtn, c.isCollected && styles.actionCollected)}
                      onClick={(e) => { e.stopPropagation?.(); handleCollect(c.id); }}
                    >
                      <Text>{c.isCollected ? '★' : '☆'}</Text>
                    </View>
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

export default CasesPage;
