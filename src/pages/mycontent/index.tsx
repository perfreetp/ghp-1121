import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { currentUser } from '@/data/users';
import type { Question, CaseItem, Activity, DraftItem, WorkItem } from '@/types';

type TabKey = 'published' | 'activities' | 'collected' | 'drafts' | 'works';
type SortKey = 'time' | 'hot';
type QaStatusFilter = 'all' | 'open' | 'resolved';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'works', label: '我的作品' },
  { key: 'drafts', label: '草稿箱' },
  { key: 'published', label: '我发布的' },
  { key: 'activities', label: '活动报名' },
  { key: 'collected', label: '我的收藏' },
];

const MyContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('works');
  const [sortKey, setSortKey] = useState<SortKey>('time');
  const [qaStatusFilter, setQaStatusFilter] = useState<QaStatusFilter>('all');

  const works = useAppStore(s => s.works);
  const drafts = useAppStore(s => s.drafts);
  const questions = useAppStore(s => s.questions);
  const activities = useAppStore(s => s.activities);
  const cases = useAppStore(s => s.cases);
  const collectedQuestions = useAppStore(s => s.collectedQuestions);
  const collectedCases = useAppStore(s => s.collectedCases);

  const myPublishedQ = questions.filter(q => q.userId === currentUser.id);
  const myRegisteredAct = activities.filter(a => a.isRegistered);
  const myCollectedQ = questions.filter(q => collectedQuestions.includes(q.id));
  const myCollectedC = cases.filter(c => collectedCases.includes(c.id));
  const draftQas = drafts.filter(d => d.type === 'qa').length;
  const draftPosts = drafts.filter(d => d.type === 'post').length;

  const stats = [
    { num: works.length, label: '作品' },
    { num: drafts.length, label: '草稿' },
    { num: myPublishedQ.length, label: '已发布' },
    { num: myRegisteredAct.length, label: '活动报名' },
    { num: myCollectedQ.length + myCollectedC.length, label: '收藏' },
  ];

  const sortByTimeDesc = <T extends { createdAt?: string; updatedAt?: string }>(arr: T[]) =>
    [...arr].sort((a, b) => (b.createdAt || b.updatedAt || '').localeCompare(a.createdAt || a.updatedAt || ''));

  let publishedItems = myPublishedQ;
  if (qaStatusFilter !== 'all') {
    publishedItems = publishedItems.filter(q => q.status === qaStatusFilter);
  }
  publishedItems = sortKey === 'time' ? sortByTimeDesc(publishedItems) : [...publishedItems].sort((a, b) => b.views + b.answers - (a.views + a.answers));

  const sortedCollectedQ = sortByTimeDesc(myCollectedQ);
  const sortedCollectedC = sortByTimeDesc(myCollectedC);

  const sortedWorks = sortKey === 'hot' ? [...works].sort((a, b) => b.likes + b.views - (a.likes + a.views)) : sortByTimeDesc(works);

  const sortedDrafts = sortByTimeDesc(drafts);

  const sortedActivities = sortByTimeDesc(myRegisteredAct);

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollX className={styles.tabBar}>
        {tabs.map(t => (
          <View
            key={t.key}
            className={classnames(styles.tabChip, activeTab === t.key && styles.tabActive)}
            onClick={() => setActiveTab(t.key)}
          >
            <Text>{t.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.filterRow}>
        <View className={styles.filterLeft}>
          <View className={classnames(styles.filterChip, sortKey === 'time' && styles.filterChipActive)} onClick={() => setSortKey('time')}>
            <Text>🕐 最新</Text>
          </View>
          <View className={classnames(styles.filterChip, sortKey === 'hot' && styles.filterChipActive)} onClick={() => setSortKey('hot')}>
            <Text>🔥 热度</Text>
          </View>
        </View>
        {activeTab === 'published' && (
          <View className={styles.filterRight}>
            <View className={classnames(styles.filterChip, qaStatusFilter === 'all' && styles.filterChipActive)} onClick={() => setQaStatusFilter('all')}>
              <Text>全部状态</Text>
            </View>
            <View className={classnames(styles.filterChip, qaStatusFilter === 'open' && styles.filterChipActive)} onClick={() => setQaStatusFilter('open')}>
              <Text>待回答</Text>
            </View>
            <View className={classnames(styles.filterChip, qaStatusFilter === 'resolved' && styles.filterChipActive)} onClick={() => setQaStatusFilter('resolved')}>
              <Text>已解决</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} className={styles.statCard}>
            <Text className={styles.statNum}>{s.num}</Text>
            <Text className={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {activeTab === 'works' && (
        sortedWorks.length === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>🎨</Text>
            <Text className={styles.emptyText}>暂无作品</Text>
          </View>
        ) : (
          <View className={styles.workGrid}>
            {sortedWorks.map(w => (
              <View key={w.id} className={styles.workCard}>
                <Image className={styles.workCover} src={w.cover} mode="aspectFill" />
                <View className={styles.workBody}>
                  <Text className={styles.workTitle}>{w.title}</Text>
                  <View className={styles.workStats}>
                    <Text>♥ {w.likes}</Text>
                    <Text>👁 {w.views}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )
      )}

      {activeTab === 'drafts' && (
        sortedDrafts.length === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>暂无草稿</Text>
          </View>
        ) : (
          <View className={styles.listContainer}>
            {sortedDrafts.map(d => (
              <View key={d.id} className={styles.draftCard} onClick={() => Taro.navigateTo({ url: '/pages/drafts/index' })}>
                <View className={styles.draftHeader}>
                  <Text className={styles.draftTitle}>{d.title}</Text>
                  <View className={classnames(styles.typeBadge,
                    d.type === 'post' ? styles.typePost :
                    d.type === 'qa' ? styles.typeQa : styles.typeCase)}>
                    <Text>{d.type === 'post' ? '动态' : d.type === 'qa' ? '问答' : '案例'}</Text>
                  </View>
                </View>
                {d.content && <Text className={styles.draftContent}>{d.content}</Text>}
                <View className={styles.draftFooter}>
                  <Text className={styles.draftTime}>🕐 {d.updatedAt}</Text>
                  <View className={styles.draftActions}>
                    <Text style={{ fontSize: 24, color: '#6B5B95' }}>继续编辑 ›</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )
      )}

      {activeTab === 'published' && (
        publishedItems.length === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyText}>暂无发布内容</Text>
          </View>
        ) : (
          <View className={styles.listContainer}>
            {publishedItems.map(q => (
              <View key={q.id} className={styles.qaCard}
                onClick={() => Taro.navigateTo({ url: `/pages/qadetail/index?qId=${q.id}` })}>
                <View className={styles.qTitleRow}>
                  <Text className={styles.qTitle}>{q.title}</Text>
                  <View className={classnames(styles.statusBadge,
                    q.status === 'resolved' ? styles.statusResolved : styles.statusOpen)}>
                    <Text>{q.status === 'resolved' ? '✓ 已解决' : '● 待回答'}</Text>
                  </View>
                </View>
                <Text className={styles.qContent}>{q.content}</Text>
                <View className={styles.qFooter}>
                  <Text style={{ fontSize: 22, color: '#8F8A82' }}>{q.createdAt}</Text>
                  <View className={styles.qStats}>
                    <Text>👁 {q.views}</Text>
                    <Text>💬 {q.answers}</Text>
                    <Text>💰 ¥{q.reward}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )
      )}

      {activeTab === 'activities' && (
        sortedActivities.length === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>🎪</Text>
            <Text className={styles.emptyText}>暂无报名活动</Text>
          </View>
        ) : (
          <View className={styles.listContainer}>
            {sortedActivities.map(a => (
              <View key={a.id} className={styles.actCard}
                onClick={() => Taro.navigateTo({ url: `/pages/actdetail/index?actId=${a.id}` })}>
                <View className={styles.actCover}>
                  <Image style={{ width: '100%', height: '100%' }} src={a.cover} mode="aspectFill" />
                  <View className={classnames(styles.typeBadge,
                    a.type === 'online' ? styles.typeOnline : styles.typeOffline)}>
                    <Text>{a.type === 'online' ? '📹 线上' : '📍 线下'}</Text>
                  </View>
                </View>
                <View className={styles.actBody}>
                  <Text className={styles.actTitle}>{a.title}</Text>
                  <Text className={styles.actMeta}>🕐 {a.startTime}</Text>
                </View>
              </View>
            ))}
          </View>
        )
      )}

      {activeTab === 'collected' && (
        (sortedCollectedQ.length + sortedCollectedC.length) === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>⭐</Text>
            <Text className={styles.emptyText}>暂无收藏内容</Text>
          </View>
        ) : (
          <View>
            {sortedCollectedQ.length > 0 && (
              <View style={{ marginBottom: 32 }}>
                <View className={styles.sectionTitle}>
                  <Text className={styles.sectionName}>收藏的问答（{sortedCollectedQ.length}）</Text>
                </View>
                <View className={styles.listContainer} style={{ marginTop: 0 }}>
                  {sortedCollectedQ.slice(0, 3).map(q => (
                    <View key={q.id} className={styles.qaCard}
                      onClick={() => Taro.navigateTo({ url: `/pages/qadetail/index?qId=${q.id}` })}>
                      <Text className={styles.qTitle} style={{ marginBottom: 12 }}>{q.title}</Text>
                      <Text className={styles.qContent}>{q.content}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {sortedCollectedC.length > 0 && (
              <View>
                <View className={styles.sectionTitle}>
                  <Text className={styles.sectionName}>收藏的案例（{sortedCollectedC.length}）</Text>
                </View>
                <View className={styles.workGrid}>
                  {sortedCollectedC.map(c => (
                    <View key={c.id} className={styles.caseCard}
                      onClick={() => Taro.showToast({ title: '案例详情页开发中', icon: 'none' })}>
                      <Image className={styles.caseCover} src={c.cover} mode="aspectFill" />
                      <View className={styles.caseBody}>
                        <Text className={styles.caseTitle}>{c.title}</Text>
                        <Text className={styles.caseMeta}>👁 {c.views} · ♥ {c.likes}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )
      )}
    </View>
  );
};

export default MyContentPage;
