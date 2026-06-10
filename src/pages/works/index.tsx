import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { WorkItem } from '@/types';
import { mockWorks } from '@/data/works';
import EmptyState from '@/components/EmptyState';

const WorksPage: React.FC = () => {
  const [works, setWorks] = useState<WorkItem[]>(mockWorks);

  const totalWorks = works.length;
  const totalLikes = works.reduce((sum, w) => sum + w.likes, 0);
  const totalViews = works.reduce((sum, w) => sum + w.views, 0);

  const handleEdit = (work: WorkItem, e: any) => {
    e.stopPropagation?.();
    console.log('[Works] Edit work:', work.id);
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  };

  const handleDelete = (work: WorkItem, e: any) => {
    e.stopPropagation?.();
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除「${work.title}」吗？此操作不可撤销。`,
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          setWorks(prev => prev.filter(w => w.id !== work.id));
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

  const handleAdd = () => {
    console.log('[Works] Add new work');
    Taro.showToast({ title: '发布作品开发中', icon: 'none' });
  };

  const handleCardClick = (work: WorkItem) => {
    console.log('[Works] Open work detail:', work.id);
    Taro.showToast({ title: '详情页开发中', icon: 'none' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.headerTitle}>我的作品集</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalWorks}</Text>
            <Text className={styles.statLabel}>作品总数</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalLikes}</Text>
            <Text className={styles.statLabel}>累计点赞</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalViews}</Text>
            <Text className={styles.statLabel}>累计浏览</Text>
          </View>
        </View>
      </View>

      {works.length === 0 ? (
        <EmptyState title="暂无作品" description="点击右下角按钮，发布你的第一个作品吧~" />
      ) : (
        <View className={styles.worksGrid}>
          {works.map(work => (
            <View
              key={work.id}
              className={styles.workCard}
              onClick={() => handleCardClick(work)}
            >
              <Image
                className={styles.workCover}
                src={work.cover}
                mode="aspectFill"
              />
              <View className={styles.workContent}>
                <Text className={styles.workTitle}>{work.title}</Text>
                <Text className={styles.workDesc}>{work.description}</Text>
                <View className={styles.workMeta}>
                  <Text className={styles.workDate}>{work.createdAt}</Text>
                  <View className={styles.workStats}>
                    <View className={classnames(styles.statIcon, styles.statIconLiked)}>
                      <Text>♥</Text>
                      <Text>{work.likes}</Text>
                    </View>
                    <View className={classnames(styles.statIcon, styles.statIconViewed)}>
                      <Text>👁</Text>
                      <Text>{work.views}</Text>
                    </View>
                  </View>
                </View>
                <View className={styles.cardActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.actionEdit)}
                    onClick={(e) => handleEdit(work, e)}
                  >
                    <Text>✎ 编辑</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionDelete)}
                    onClick={(e) => handleDelete(work, e)}
                  >
                    <Text>🗑 删除</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View className={styles.fabButton} onClick={handleAdd}>
        <Text className={styles.fabIcon}>＋</Text>
      </View>
    </View>
  );
};

export default WorksPage;
