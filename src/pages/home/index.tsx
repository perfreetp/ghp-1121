import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Post, PostType } from '@/types';
import { mockPosts } from '@/data/posts';
import { currentUser } from '@/data/users';

type TabType = 'all' | PostType;

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'dynamic', label: '动态' },
    { key: 'help', label: '求助' },
    { key: 'experience', label: '经验' }
  ];

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter(p => p.type === activeTab);

  const getTypeTagInfo = (type: PostType) => {
    switch (type) {
      case 'help': return { label: '求助', className: styles.typeHelp };
      case 'experience': return { label: '经验', className: styles.typeExperience };
      default: return { label: '动态', className: styles.typeDynamic };
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleCollect = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isCollected: !p.isCollected };
      }
      return p;
    }));
  };

  const goToPublish = () => {
    Taro.showToast({ title: '发布功能开发中', icon: 'none' });
  };

  const goToActivities = () => {
    Taro.navigateTo({ url: '/pages/activities/index' });
  };

  const goToProfile = () => {
    Taro.navigateTo({ url: '/pages/profile/index' });
  };

  const goToRegister = () => {
    Taro.navigateTo({ url: '/pages/register/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <View className={styles.greetingRow}>
          <View>
            <Text className={styles.greetingText}>你好，{currentUser.nickname}</Text>
            <View className={styles.subGreeting}>愿每一次服务都充满温度</View>
          </View>
          <View
            className={styles.verifiedBadge}
            onClick={currentUser.verified ? undefined : goToRegister}
          >
            <Text>{currentUser.verified ? '✓ 已认证' : '去认证'}</Text>
          </View>
        </View>

        <View className={styles.quickActions}>
          <View className={styles.quickItem} onClick={goToProfile}>
            <View className={styles.quickIcon}><Text>📋</Text></View>
            <Text className={styles.quickLabel}>职业档案</Text>
          </View>
          <View className={styles.quickItem} onClick={goToActivities}>
            <View className={styles.quickIcon}><Text>📚</Text></View>
            <Text className={styles.quickLabel}>学习活动</Text>
          </View>
          <View className={styles.quickItem} onClick={() => Taro.switchTab({ url: '/pages/qa/index' })}>
            <View className={styles.quickIcon}><Text>❓</Text></View>
            <Text className={styles.quickLabel}>问答悬赏</Text>
          </View>
          <View className={styles.quickItem} onClick={() => Taro.switchTab({ url: '/pages/network/index' })}>
            <View className={styles.quickIcon}><Text>👥</Text></View>
            <Text className={styles.quickLabel}>找同行</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabContainer}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.postList}>
        {filteredPosts.map(post => {
          const typeTag = getTypeTagInfo(post.type);
          return (
            <View key={post.id} className={styles.postCard}>
              <View className={styles.postHeader}>
                <Image className={styles.avatar} src={post.userInfo.avatar} mode="aspectFill" />
                <View className={styles.userInfo}>
                  <View className={styles.userNameRow}>
                    <Text className={styles.userName}>
                      {post.userInfo.anonymity === 'full-anonymous' ? '匿名同行' : post.userInfo.nickname}
                    </Text>
                    {post.userInfo.verified && <Text className={styles.verifiedIcon}>✓</Text>}
                  </View>
                  <View className={styles.postMeta}>
                    <View className={classnames(styles.postTypeTag, typeTag.className)}>
                      <Text>{typeTag.label}</Text>
                    </View>
                    <Text>{post.userInfo.profession}</Text>
                    <Text>·</Text>
                    <Text>{post.createdAt}</Text>
                  </View>
                </View>
              </View>

              <Text className={styles.postContent}>{post.content}</Text>

              {post.images.length > 0 && (
                <View className={styles.postImages}>
                  {post.images.map((img, idx) => (
                    <Image key={idx} className={styles.postImage} src={img} mode="aspectFill" />
                  ))}
                </View>
              )}

              {post.tags.length > 0 && (
                <View className={styles.postTags}>
                  {post.tags.map((tag, idx) => (
                    <View key={idx} className={styles.tagItem}>
                      <Text>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View className={styles.postActions}>
                <View
                  className={classnames(styles.actionItem, post.isLiked && styles.actionLiked)}
                  onClick={() => handleLike(post.id)}
                >
                  <Text>{post.isLiked ? '♥' : '♡'}</Text>
                  <Text>{post.likes}</Text>
                </View>
                <View className={styles.actionItem}>
                  <Text>💬</Text>
                  <Text>{post.comments}</Text>
                </View>
                <View
                  className={classnames(styles.actionItem, post.isCollected && styles.actionCollected)}
                  onClick={() => handleCollect(post.id)}
                >
                  <Text>{post.isCollected ? '★' : '☆'}</Text>
                  <Text>收藏</Text>
                </View>
                <View className={styles.actionItem}>
                  <Text>↗</Text>
                  <Text>{post.shares}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className={styles.fabButton} onClick={goToPublish}>
        <Text className={styles.fabText}>+</Text>
      </View>
    </View>
  );
};

export default HomePage;
