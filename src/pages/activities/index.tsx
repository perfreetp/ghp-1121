import React, { useState } from 'react';
import { View, Text, Image, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Activity, ActivityType } from '@/types';
import { useAppStore } from '@/store/appStore';
import EmptyState from '@/components/EmptyState';

const ActivitiesPage: React.FC = () => {
  const activities = useAppStore(s => s.activities);
  const updateActivity = useAppStore(s => s.updateActivity);
  const setActivities = useAppStore(s => s.setActivities);
  const [tab, setTab] = useState<'all' | ActivityType | 'mine'>('all');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'online' as ActivityType,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    maxParticipants: '50',
    fee: '0',
    tags: ''
  });

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

  const handleRegister = (a: Activity, e: any) => {
    e.stopPropagation?.();
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
            updateActivity(a.id, {
              isRegistered: false,
              currentParticipants: a.currentParticipants - 1
            });
            Taro.showToast({ title: '已取消报名', icon: 'success' });
          }
        }
      });
      return;
    }

    updateActivity(a.id, {
      isRegistered: true,
      currentParticipants: a.currentParticipants + 1
    });
    Taro.showToast({ title: '报名成功！', icon: 'success' });
  };

  const getProgress = (a: Activity) => Math.round((a.currentParticipants / a.maxParticipants) * 100);

  const closePublishModal = () => {
    setFormData({
      type: 'online' as ActivityType,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      maxParticipants: '50',
      fee: '0',
      tags: ''
    });
    setShowPublishModal(false);
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitActivity = () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入活动标题', icon: 'none' });
      return;
    }
    if (!formData.description.trim()) {
      Taro.showToast({ title: '请输入活动详情', icon: 'none' });
      return;
    }
    if (!formData.startTime.trim()) {
      Taro.showToast({ title: '请选择开始时间', icon: 'none' });
      return;
    }
    if (!formData.maxParticipants.trim()) {
      Taro.showToast({ title: '请输入名额上限', icon: 'none' });
      return;
    }
    if (formData.type === 'offline' && !formData.location.trim()) {
      Taro.showToast({ title: '请输入活动地点', icon: 'none' });
      return;
    }

    const newActivity: Activity = {
      id: 'act' + Date.now(),
      cover: 'https://picsum.photos/seed/' + Date.now() + '/750/400',
      hostName: '林师',
      hostProfession: '宠物殡葬师',
      currentParticipants: 0,
      isRegistered: false,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime || undefined,
      location: formData.type === 'offline' ? formData.location : undefined,
      maxParticipants: parseInt(formData.maxParticipants) || 50,
      fee: parseInt(formData.fee) || 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setActivities([newActivity, ...activities]);
    Taro.showToast({ title: '发布成功！', icon: 'success' });
    closePublishModal();
  };

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

      <View className={styles.publishFAB} onClick={() => setShowPublishModal(true)}>
        <Text className={styles.publishIcon}>＋</Text>
        <Text className={styles.publishText}>发布活动</Text>
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
              <View
                key={a.id}
                className={styles.activityCard}
                onClick={() => Taro.navigateTo({ url: `/pages/actdetail/index?actId=${a.id}` })}
              >
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
                      onClick={(e) => handleRegister(a, e)}
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

      {showPublishModal && (
        <View className={styles.modalMask} onClick={closePublishModal}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>发布新活动</Text>
              <Text className={styles.modalClose} onClick={closePublishModal}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              
              <View className={styles.formSection}>
                <Text className={styles.sectionTitle}>活动类型</Text>
                <View className={styles.typeSelector}>
                  <View className={`${styles.typeOption} ${formData.type === 'online' ? styles.typeOptionActive : ''}`} onClick={() => updateField('type', 'online')}>
                    <Text className={styles.typeIcon}>📹</Text>
                    <Text className={styles.typeName}>线上分享</Text>
                    <Text className={styles.typeDesc}>直播/视频会议</Text>
                  </View>
                  <View className={`${styles.typeOption} ${formData.type === 'offline' ? styles.typeOptionActive : ''}`} onClick={() => updateField('type', 'offline')}>
                    <Text className={styles.typeIcon}>📍</Text>
                    <Text className={styles.typeName}>线下探访</Text>
                    <Text className={styles.typeDesc}>实地参观/聚会</Text>
                  </View>
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>活动标题 *</Text>
                <Input className={styles.formInput} placeholder="给活动起个吸引人的标题" value={formData.title} onInput={e => updateField('title', e.detail.value)} maxlength={50} />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>活动详情 *</Text>
                <Textarea className={styles.formTextarea} placeholder="介绍活动内容、适合人群、预期收获等" value={formData.description} onInput={e => updateField('description', e.detail.value)} maxlength={500} />
              </View>

              <View className={styles.formRow}>
                <View className={styles.formItemHalf}>
                  <Text className={styles.formLabel}>开始时间 *</Text>
                  <Input className={styles.formInput} placeholder="2026-06-20 19:30" value={formData.startTime} onInput={e => updateField('startTime', e.detail.value)} />
                </View>
                <View className={styles.formItemHalf}>
                  <Text className={styles.formLabel}>结束时间</Text>
                  <Input className={styles.formInput} placeholder="2026-06-20 22:00" value={formData.endTime} onInput={e => updateField('endTime', e.detail.value)} />
                </View>
              </View>

              {formData.type === 'offline' && (
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>活动地点 *</Text>
                  <Input className={styles.formInput} placeholder="详细地址，如：北京市朝阳区xxx" value={formData.location} onInput={e => updateField('location', e.detail.value)} />
                </View>
              )}

              <View className={styles.formRow}>
                <View className={styles.formItemHalf}>
                  <Text className={styles.formLabel}>名额上限</Text>
                  <Input className={styles.formInput} type="number" placeholder="50" value={formData.maxParticipants} onInput={e => updateField('maxParticipants', e.detail.value)} />
                </View>
                <View className={styles.formItemHalf}>
                  <Text className={styles.formLabel}>费用(元)</Text>
                  <Input className={styles.formInput} type="number" placeholder="0=免费" value={formData.fee} onInput={e => updateField('fee', e.detail.value)} />
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>活动标签</Text>
                <Input className={styles.formInput} placeholder="逗号分隔，如：培训,北京,实操" value={formData.tags} onInput={e => updateField('tags', e.detail.value)} />
              </View>

            </ScrollView>
            <View className={styles.modalFooter}>
              <View className={styles.submitBtn} onClick={submitActivity}>
                <Text>发布活动</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ActivitiesPage;
