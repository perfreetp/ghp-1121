import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Activity, ActivityType } from '@/types';
import { useAppStore, currentUser, mockUsers } from '@/store/appStore';

const participants = mockUsers.slice(0, 8);

const ActDetailPage: React.FC = () => {
  const router = useRouter();
  const actId = router.params.actId;
  const activities = useAppStore(s => s.activities);
  const updateActivity = useAppStore(s => s.updateActivity);

  const activity = useMemo(() => activities.find(a => a.id === actId), [activities, actId]);

  const [showEditModal, setShowEditModal] = useState(false);
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

  if (!activity) {
    return (
      <View className={styles.pageContainer}>
        <View style={{ padding: '100rpx 0', textAlign: 'center' }}>
          <Text>活动不存在或已删除</Text>
        </View>
      </View>
    );
  }

  const isOwner = activity.hostName === currentUser.nickname || activity.hostName === '林师';
  const isFull = activity.currentParticipants >= activity.maxParticipants;
  const progress = Math.round((activity.currentParticipants / activity.maxParticipants) * 100);

  const handleRegister = () => {
    if (isFull) {
      Taro.showToast({ title: '活动名额已满', icon: 'none' });
      return;
    }
    if (activity.isRegistered) {
      Taro.showModal({
        title: '确认取消报名',
        content: `确定要取消「${activity.title}」的报名吗？`,
        success: (res) => {
          if (res.confirm) {
            updateActivity(activity.id, {
              isRegistered: false,
              currentParticipants: activity.currentParticipants - 1
            });
            Taro.showToast({ title: '已取消报名', icon: 'success' });
          }
        }
      });
      return;
    }

    updateActivity(activity.id, {
      isRegistered: true,
      currentParticipants: activity.currentParticipants + 1
    });
    Taro.showToast({ title: '报名成功！', icon: 'success' });
  };

  const openMap = () => {
    if (!activity.location) return;
    Taro.showToast({ title: `正在导航至：${activity.location}`, icon: 'none' });
  };

  const copyLink = () => {
    Taro.setClipboardData({ data: 'https://meeting.xxx.com/join/' + activity.id });
  };

  const openEditModal = () => {
    setFormData({
      type: activity.type,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime,
      endTime: activity.endTime || '',
      location: activity.location || '',
      maxParticipants: String(activity.maxParticipants),
      fee: String(activity.fee),
      tags: activity.tags.join(',')
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = () => {
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

    updateActivity(activity.id, {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime || undefined,
      location: formData.type === 'offline' ? formData.location : undefined,
      maxParticipants: parseInt(formData.maxParticipants) || 50,
      fee: parseInt(formData.fee) || 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    Taro.showToast({ title: '保存成功！', icon: 'success' });
    closeEditModal();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.coverWrap}>
        <Image
          className={styles.coverImg}
          src={activity.cover}
          mode="aspectFill"
        />
        <View className={classnames(styles.typeBadge, activity.type === 'online' ? styles.typeOnline : styles.typeOffline)}>
          <Text>{activity.type === 'online' ? '📹 线上' : '📍 线下'}</Text>
        </View>
        <View className={styles.feeBadge}>
          <Text>{activity.fee === 0 ? '免费' : `¥${activity.fee}`}</Text>
        </View>
        {activity.isRegistered && (
          <View className={styles.registeredBadge}>
            <Text>✓ 已报名</Text>
          </View>
        )}
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.title}>{activity.title}</Text>
        <Text className={styles.desc}>{activity.description}</Text>

        <View className={styles.infoRow}>
          <Text>🕐</Text>
          <Text>{activity.startTime}{activity.endTime ? ` - ${activity.endTime.split(' ')[1] || activity.endTime}` : ''}</Text>
        </View>
        {activity.location && (
          <View className={styles.infoRow}>
            <Text>📍</Text>
            <Text>{activity.location}</Text>
          </View>
        )}
        <View className={styles.infoRow}>
          <Text>👥</Text>
          <Text>主办方：{activity.hostName} · {activity.hostProfession}</Text>
        </View>

        <View className={styles.tagList}>
          {activity.tags.map((tag, idx) => (
            <View key={idx} className={styles.tagItem}>
              <Text>{tag}</Text>
            </View>
          ))}
        </View>

        <View className={styles.progressRow}>
          <View className={styles.progressLabel}>
            <Text style={{ color: '#5C574F' }}>报名进度</Text>
            <Text style={{ color: '#8F8A82' }}>{activity.currentParticipants}/{activity.maxParticipants}人</Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text>👥</Text>
          <Text>活动参与者</Text>
        </View>
        <View className={styles.participantGrid}>
          {participants.map(p => (
            <View key={p.id} className={styles.participantItem}>
              <Image className={styles.partAvatar} src={p.avatar} mode="aspectFill" />
              <Text className={styles.partName}>{p.nickname}</Text>
            </View>
          ))}
        </View>
        <View style={{ marginTop: '24rpx', textAlign: 'center' }}>
          <Text style={{ fontSize: '24rpx', color: '#6B5B95' }}>查看全部 {activity.currentParticipants} 人</Text>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text>📋</Text>
          <Text>活动详情</Text>
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <View className={styles.infoIcon}>
              <Text style={{ color: '#fff', fontSize: '24rpx' }}>🕐</Text>
            </View>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>活动时间</Text>
              <Text className={styles.infoValue}>{activity.startTime}{activity.endTime ? ` ~ ${activity.endTime}` : ''}</Text>
            </View>
          </View>

          {activity.type === 'online' ? (
            <View className={styles.infoItem}>
              <View className={styles.infoIcon}>
                <Text style={{ color: '#fff', fontSize: '24rpx' }}>🔗</Text>
              </View>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>会议链接</Text>
                <Text className={styles.infoValue}>https://meeting.xxx.com/join/{activity.id}</Text>
                <View className={styles.mapBtnRow}>
                  <View className={classnames(styles.mapBtn, styles.linkBtn)} onClick={copyLink}>
                    <Text>📋 复制会议链接</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className={styles.infoItem}>
              <View className={styles.infoIcon}>
                <Text style={{ color: '#fff', fontSize: '24rpx' }}>📍</Text>
              </View>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>活动地点</Text>
                <Text className={styles.infoValue}>{activity.location}</Text>
                <View className={styles.mapBtnRow}>
                  <View className={styles.mapBtn} onClick={openMap}>
                    <Text>🧭 查看地图导航</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View className={styles.infoItem}>
            <View className={styles.infoIcon}>
              <Text style={{ color: '#fff', fontSize: '24rpx' }}>💰</Text>
            </View>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>活动费用</Text>
              <Text className={styles.infoValue}>{activity.fee === 0 ? '免费参与' : `¥${activity.fee} / 人`}</Text>
            </View>
          </View>

          <View className={styles.infoItem}>
            <View className={styles.infoIcon}>
              <Text style={{ color: '#fff', fontSize: '24rpx' }}>👤</Text>
            </View>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>主办方</Text>
              <Text className={styles.infoValue}>{activity.hostName}（{activity.hostProfession}）</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        {isOwner && (
          <View className={styles.editBtn} onClick={openEditModal}>
            <Text>✏️ 编辑活动</Text>
          </View>
        )}
        <View
          className={classnames(
            styles.registerBtn,
            activity.isRegistered
              ? styles.btnRegistered
              : isFull
                ? styles.btnDisabled
                : ''
          )}
          onClick={handleRegister}
        >
          <Text>
            {activity.isRegistered ? '取消报名' : isFull ? '名额已满' : '立即报名'}
          </Text>
        </View>
      </View>

      {showEditModal && (
        <View className={styles.editMask} onClick={closeEditModal}>
          <View className={styles.editContent} onClick={e => e.stopPropagation?.()}>
            <View className={styles.editHeader}>
              <Text className={styles.editTitle}>编辑活动</Text>
              <Text className={styles.editClose} onClick={closeEditModal}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.editBody}>

              <View className={styles.typeOptRow}>
                <View
                  className={classnames(styles.typeOpt, formData.type === 'online' && styles.typeOptActive)}
                  onClick={() => updateField('type', 'online')}
                >
                  <Text style={{ fontSize: '48rpx' }}>📹</Text>
                  <Text style={{ fontSize: '28rpx', fontWeight: 500, color: '#2D2A26' }}>线上分享</Text>
                  <Text style={{ fontSize: '22rpx', color: '#8F8A82' }}>直播/视频会议</Text>
                </View>
                <View
                  className={classnames(styles.typeOpt, formData.type === 'offline' && styles.typeOptActive)}
                  onClick={() => updateField('type', 'offline')}
                >
                  <Text style={{ fontSize: '48rpx' }}>📍</Text>
                  <Text style={{ fontSize: '28rpx', fontWeight: 500, color: '#2D2A26' }}>线下探访</Text>
                  <Text style={{ fontSize: '22rpx', color: '#8F8A82' }}>实地参观/聚会</Text>
                </View>
              </View>

              <View className={styles.editItem}>
                <Text className={styles.editLabel}>活动标题 *</Text>
                <Input
                  className={styles.editInput}
                  placeholder="给活动起个吸引人的标题"
                  value={formData.title}
                  onInput={e => updateField('title', e.detail.value)}
                  maxlength={50}
                />
              </View>

              <View className={styles.editItem}>
                <Text className={styles.editLabel}>活动详情 *</Text>
                <Textarea
                  className={styles.editTextarea}
                  placeholder="介绍活动内容、适合人群、预期收获等"
                  value={formData.description}
                  onInput={e => updateField('description', e.detail.value)}
                  maxlength={500}
                />
              </View>

              <View className={styles.editRow}>
                <View className={styles.editHalf}>
                  <View className={styles.editItem}>
                    <Text className={styles.editLabel}>开始时间 *</Text>
                    <Input
                      className={styles.editInput}
                      placeholder="2026-06-20 19:30"
                      value={formData.startTime}
                      onInput={e => updateField('startTime', e.detail.value)}
                    />
                  </View>
                </View>
                <View className={styles.editHalf}>
                  <View className={styles.editItem}>
                    <Text className={styles.editLabel}>结束时间</Text>
                    <Input
                      className={styles.editInput}
                      placeholder="2026-06-20 22:00"
                      value={formData.endTime}
                      onInput={e => updateField('endTime', e.detail.value)}
                    />
                  </View>
                </View>
              </View>

              {formData.type === 'offline' && (
                <View className={styles.editItem}>
                  <Text className={styles.editLabel}>活动地点 *</Text>
                  <Input
                    className={styles.editInput}
                    placeholder="详细地址，如：北京市朝阳区xxx"
                    value={formData.location}
                    onInput={e => updateField('location', e.detail.value)}
                  />
                </View>
              )}

              <View className={styles.editRow}>
                <View className={styles.editHalf}>
                  <View className={styles.editItem}>
                    <Text className={styles.editLabel}>名额上限</Text>
                    <Input
                      className={styles.editInput}
                      type="number"
                      placeholder="50"
                      value={formData.maxParticipants}
                      onInput={e => updateField('maxParticipants', e.detail.value)}
                    />
                  </View>
                </View>
                <View className={styles.editHalf}>
                  <View className={styles.editItem}>
                    <Text className={styles.editLabel}>费用(元)</Text>
                    <Input
                      className={styles.editInput}
                      type="number"
                      placeholder="0=免费"
                      value={formData.fee}
                      onInput={e => updateField('fee', e.detail.value)}
                    />
                  </View>
                </View>
              </View>

              <View className={styles.editItem}>
                <Text className={styles.editLabel}>活动标签</Text>
                <Input
                  className={styles.editInput}
                  placeholder="逗号分隔，如：培训,北京,实操"
                  value={formData.tags}
                  onInput={e => updateField('tags', e.detail.value)}
                />
              </View>

            </ScrollView>
            <View className={styles.editFooter}>
              <View className={styles.saveBtn} onClick={saveEdit}>
                <Text>保存修改</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ActDetailPage;
