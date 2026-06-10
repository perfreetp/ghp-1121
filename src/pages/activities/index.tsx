import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Activity, ActivityType } from '@/types';
import { mockActivities } from '@/data/activities';
import EmptyState from '@/components/EmptyState';

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [tab, setTab] = useState<'all' | ActivityType | 'mine'>('all');

  const tabs = [
    { key: 'all' as const, label: '全部活动' },
    { key: 'online' as const, label: '线上活动' },
    { key: 'offline' as const, label: '线下活动' },
    { key: 'mine' as const, label: '我的报名' }
  ];

  const filteredActivities = activities.filter(a => {
    if (tab === 'all') return true;
    if (tab === 'mine') return a.isRegistered;
    return a.type === tab;
  });

  const handleRegister = (a: Activity) => {
    if (a.currentParticipants >= a.maxParticipants) {
      Taro.showToast({ title: '活动名额已满', icon: 'none' });
      return;
    }
    if (a.isRegistered) {
      Taro.showModal({
        title: '确认取消报名',
        content: `确定要取消「${a.title}」的报名吗？`,
        success: (res) => {
          if (res.confirm) {
            setActivities(prev => prev.map(item => {
              if (item.id === a.id) {
                return { ...item, isRegistered: false, currentParticipants: item.currentParticipants - 1 };
              }
              return item;
            }));
            Taro.showToast({ title: '已取消报名', icon: 'success' });
          }
        }
      });
      return;
    }

    console.log('[Activities] Register for:', a.id);
    setActivities(prev => prev.map(item => {
      if (item.id === a.id) {
        return { ...item, isRegistered: true, currentParticipants: item.currentParticipants + 1 };
      }
      return item;
    }));
    Taro.showToast({ title: '报名成功！', icon: 'success' });
  };

  const getProgress = (a: Activity) => Math.round((a.currentParticipants / a.maxParticipants) * 100);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.tabBar}>
        {tabs.map(t => (
          <View
            key={t.key}
            className={classnames(styles.tabItem, tab === t.key && styles.tabActive)}
            onClick={() => setTab(t.key)}
          >
            <Text>{t.label}</Text>
          </View>
        ))}
      </View>

      {filteredActivities.length === 0 ? (
        <EmptyState
          title={tab === 'mine' ? '暂无报名记录' : '暂无相关活动'}
          description={tab === 'mine' ? '去看看有哪些感兴趣的活动吧~' : '敬请期待更多精彩活动'}
        />
      ) : (
        <View className={styles.activityList}>
          {filteredActivities.map(a => {
            const isFull = a.currentParticipants >= a.maxParticipants;
            const progress = getProgress(a);
            return (
              <View key={a.id} className={styles.activityCard}>
                <View className={styles.activityCover}>
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    src={a.cover}
                    mode="aspectFill"
                  />
                  <View className={classnames(styles.typeBadge, a.type === 'online' ? styles.typeOnline : styles.typeOffline)}>
                    <Text>{a.type === 'online' ? '📹 线上' : '📍 线下'}</Text>
                  </View>
                  <View className={styles.feeBadge}>
                    <Text>{a.fee === 0 ? '免费' : `¥${a.fee}`}</Text>
                  </View>
                  {a.isRegistered && (
                    <View className={styles.registeredBadge}>
                      <Text>✓ 已报名</Text>
                    </View>
                  )}
                </View>

                <View className={styles.activityContent}>
                  <Text className={styles.activityTitle}>{a.title}</Text>
                  <Text className={styles.activityDesc}>{a.description}</Text>

                  <View className={styles.infoRow}>
                    <Text>🕐</Text>
                    <Text>{a.startTime}{a.endTime ? ` - ${a.endTime.split(' ')[1] || a.endTime}` : ''}</Text>
                  </View>
                  {a.location && (
                    <View className={styles.infoRow}>
                      <Text>📍</Text>
                      <Text>{a.location}</Text>
                    </View>
                  )}

                  <View className={styles.tagList}>
                    {a.tags.map((tag, idx) => (
                      <View key={idx} className={styles.tagItem}>
                        <Text>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View className={styles.progressRow}>
                    <View className={styles.progressLabel}>
                      <Text>报名进度</Text>
                      <Text>{a.currentParticipants}/{a.maxParticipants}人</Text>
                    </View>
                    <View className={styles.progressBar}>
                      <View
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  </View>

                  <View className={styles.activityFooter}>
                    <View className={styles.hostInfo}>
                      <Text className={styles.hostName}>主办方：{a.hostName}</Text>
                      <Text className={styles.hostProf}>· {a.hostProfession}</Text>
                    </View>
                    <View
                      className={classnames(
                        styles.registerBtn,
                        a.isRegistered
                          ? styles.btnRegistered
                          : isFull
                            ? styles.btnDisabled
                            : styles.btnActive
                      )}
                      onClick={() => handleRegister(a)}
                    >
                      <Text>
                        {a.isRegistered ? '取消报名' : isFull ? '名额已满' : '立即报名'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ActivitiesPage;
