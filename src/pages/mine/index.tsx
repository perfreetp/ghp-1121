import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { currentUser } from '@/data/users';

interface MenuItemType {
  icon: string;
  label: string;
  desc?: string;
  badge?: string;
  page?: string;
  tab?: string;
}

const MinePage: React.FC = () => {
  const navigateTo = (url?: string, tabUrl?: string) => {
    if (tabUrl) {
      Taro.switchTab({ url: tabUrl });
    } else if (url) {
      Taro.navigateTo({ url });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const contentMenu: MenuItemType[] = [
    {
      icon: '🎨',
      label: '我的作品',
      desc: '展示你的服务案例',
      page: '/pages/works/index'
    },
    {
      icon: '✍️',
      label: '草稿箱',
      desc: '3篇未发布内容',
      badge: '3',
      page: '/pages/drafts/index'
    },
    {
      icon: '📋',
      label: '职业档案',
      desc: '完善你的专业信息',
      page: '/pages/profile/index'
    }
  ];

  const socialMenu: MenuItemType[] = [
    {
      icon: '💬',
      label: '私信中心',
      desc: '2条未读消息',
      badge: '2',
      page: '/pages/messages/index'
    },
    {
      icon: '📅',
      label: '活动中心',
      desc: '我的报名与收藏',
      page: '/pages/activities/index'
    }
  ];

  const systemMenu: MenuItemType[] = [
    {
      icon: '⭐',
      label: '信用说明',
      desc: `${currentUser.creditScore}分 · 信用极好`,
      page: '/pages/credit/index'
    },
    {
      icon: '🚫',
      label: '黑名单管理',
      page: '/pages/blacklist/index'
    },
    {
      icon: '📢',
      label: '举报中心',
      desc: '举报记录与新建举报',
      page: '/pages/reports/index'
    },
    {
      icon: '🛡',
      label: '认证与权限',
      desc: currentUser.verified ? '身份已认证' : '未认证',
      page: '/pages/register/index'
    }
  ];

  const renderMenuItem = (item: MenuItemType) => (
    <View
      key={item.label}
      className={styles.menuItem}
      onClick={() => navigateTo(item.page, item.tab)}
    >
      <View className={styles.menuIcon}>
        <Text>{item.icon}</Text>
      </View>
      <View className={styles.menuContent}>
        <Text className={styles.menuLabel}>{item.label}</Text>
        {item.desc && <Text className={styles.menuDesc}>{item.desc}</Text>}
      </View>
      {item.badge && <View className={styles.menuBadge}><Text>{item.badge}</Text></View>}
      <Text className={styles.menuArrow}>›</Text>
    </View>
  );

  return (
    <View className={styles.pageContainer}>
      <View className={styles.profileHeader}>
        <View className={styles.profileRow}>
          <View className={styles.avatarWrapper}>
            <Image className={styles.avatar} src={currentUser.avatar} mode="aspectFill" />
            {currentUser.verified && (
              <View className={styles.verifiedBadge}>
                <Text>✓</Text>
              </View>
            )}
          </View>
          <View className={styles.profileInfo}>
            <View className={styles.userNameRow}>
              <Text className={styles.userName}>
                {currentUser.anonymity === 'full-anonymous' ? '匿名同行' : currentUser.nickname}
              </Text>
              <View className={styles.professionBadge}>
                <Text>{currentUser.profession}</Text>
              </View>
            </View>
            <Text className={styles.userDesc}>{currentUser.bio}</Text>
            <View className={styles.userLocation}>
              <Text>📍 {currentUser.city}</Text>
              <Text>·</Text>
              <Text>🕐 从业{currentUser.yearsExperience}年</Text>
              {currentUser.acceptOrder && (
                <>
                  <Text>·</Text>
                  <Text style={{ color: '#86B049' }}>● 可接单</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>12</Text>
          <Text className={styles.statLabel}>发布动态</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>6</Text>
          <Text className={styles.statLabel}>案例分享</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>89</Text>
          <Text className={styles.statLabel}>获得点赞</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>34</Text>
          <Text className={styles.statLabel}>收藏内容</Text>
        </View>
      </View>

      <View
        className={styles.creditRow}
        onClick={() => navigateTo('/pages/credit/index')}
      >
        <View className={styles.creditInfo}>
          <View className={styles.creditIcon}>
            <Text>⭐</Text>
          </View>
          <View className={styles.creditText}>
            <Text className={styles.creditScore}>信用分 {currentUser.creditScore}</Text>
            <Text className={styles.creditLabel}>信用等级：极好 · 查看信用记录</Text>
          </View>
        </View>
        <Text className={styles.viewMore}>查看 ›</Text>
      </View>

      <Text className={styles.sectionTitle}>内容管理</Text>
      <View className={styles.menuGroup}>
        {contentMenu.map(renderMenuItem)}
      </View>

      <Text className={styles.sectionTitle}>社交互动</Text>
      <View className={styles.menuGroup}>
        {socialMenu.map(renderMenuItem)}
      </View>

      <Text className={styles.sectionTitle}>系统与安全</Text>
      <View className={styles.menuGroup}>
        {systemMenu.map(renderMenuItem)}
      </View>
    </View>
  );
};

export default MinePage;
