import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { DraftItem } from '@/types';
import { mockDrafts } from '@/data/drafts';
import EmptyState from '@/components/EmptyState';

type TabType = 'all' | 'post' | 'qa' | 'case';

const DraftsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'post', label: '动态' },
    { key: 'qa', label: '问答' },
    { key: 'case', label: '案例' }
  ];

  const typeMap: Record<'post' | 'qa' | 'case', { label: string; className: string }> = {
    post: { label: '动态', className: styles.typePost },
    qa: { label: '问答', className: styles.typeQa },
    case: { label: '案例', className: styles.typeCase }
  };

  const filteredDrafts = mockDrafts.filter(draft => {
    if (activeTab === 'all') return true;
    return draft.type === activeTab;
  });

  const handleEdit = (draft: DraftItem) => {
    console.log('[Drafts] Edit draft:', draft.id);
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  };

  const handlePublish = (draft: DraftItem) => {
    console.log('[Drafts] Publish draft:', draft.id);
    Taro.showToast({ title: '发布功能开发中', icon: 'none' });
  };

  const handleDelete = (draft: DraftItem) => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后草稿无法恢复，确定要删除吗？',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          console.log('[Drafts] Delete draft:', draft.id);
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <Text className={styles.pageTitle}>草稿箱</Text>

      <ScrollView scrollX className={styles.tabsRow}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabChip, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </ScrollView>

      {filteredDrafts.length === 0 ? (
        <EmptyState title="暂无草稿" description="去发布内容吧，这里会保存你的草稿~" />
      ) : (
        <View className={styles.draftList}>
          {filteredDrafts.map(draft => (
            <View key={draft.id} className={styles.draftCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.draftTitle}>{draft.title}</Text>
                <View className={classnames(styles.typeBadge, typeMap[draft.type].className)}>
                  <Text>{typeMap[draft.type].label}</Text>
                </View>
              </View>

              {draft.content && (
                <Text className={styles.draftContent}>{draft.content}</Text>
              )}

              {draft.images.length > 0 && (
                <View className={styles.imageRow}>
                  {draft.images.slice(0, 4).map((img, idx) => (
                    <Image
                      key={idx}
                      className={styles.thumbnail}
                      src={img}
                      mode="aspectFill"
                    />
                  ))}
                </View>
              )}

              {draft.tags.length > 0 && (
                <View className={styles.tagList}>
                  {draft.tags.map((tag, idx) => (
                    <View key={idx} className={styles.tagChip}>
                      <Text>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View className={styles.cardFooter}>
                <Text className={styles.updatedTime}>🕐 {draft.updatedAt}</Text>
                <View className={styles.actionButtons}>
                  <View
                    className={classnames(styles.actionBtn, styles.btnEdit)}
                    onClick={() => handleEdit(draft)}
                  >
                    <Text>继续编辑</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.btnPublish)}
                    onClick={() => handlePublish(draft)}
                  >
                    <Text>立即发布</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.btnDelete)}
                    onClick={() => handleDelete(draft)}
                  >
                    <Text>删除</Text>
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

export default DraftsPage;
