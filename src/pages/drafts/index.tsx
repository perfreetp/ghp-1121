import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { DraftItem } from '@/types';
import { useAppStore } from '@/store/appStore';
import EmptyState from '@/components/EmptyState';

type TabType = 'all' | 'post' | 'qa' | 'case';

const DraftsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const drafts = useAppStore(s => s.drafts);
  const updateDraft = useAppStore(s => s.updateDraft);
  const removeDraft = useAppStore(s => s.removeDraft);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDraft, setEditingDraft] = useState<DraftItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

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

  const formatDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const openEditModal = (draft: DraftItem) => {
    setEditingDraft(draft);
    setEditTitle(draft.title);
    setEditContent(draft.content);
    setEditTags(draft.tags.join(','));
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDraft(null);
  };

  const filteredDrafts = drafts.filter(draft => {
    if (activeTab === 'all') return true;
    return draft.type === activeTab;
  });

  const handleEdit = (draft: DraftItem) => {
    openEditModal(draft);
  };

  const handlePublish = (draft: DraftItem) => {
    openEditModal(draft);
    Taro.showToast({ title: '请先确认内容后发布', icon: 'none' });
  };

  const handleDelete = (draftId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后草稿无法恢复，确定要删除吗？',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          removeDraft(draftId);
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      Taro.showToast({ title: '标题不能为空', icon: 'none' });
      return;
    }
    if (!editingDraft) return;

    updateDraft(editingDraft.id, {
      title: editTitle.trim(),
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(t => t),
      updatedAt: formatDateTime()
    });
    Taro.showToast({ title: '已保存', icon: 'success' });
    closeEditModal();
  };

  const handleConfirmPublish = () => {
    if (!editTitle.trim()) {
      Taro.showToast({ title: '标题不能为空', icon: 'none' });
      return;
    }
    if (!editContent.trim()) {
      Taro.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }
    if (!editingDraft) return;

    removeDraft(editingDraft.id);
    Taro.showToast({ title: '发布成功！', icon: 'success' });
    closeEditModal();
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
                    onClick={() => handleDelete(draft.id)}
                  >
                    <Text>删除</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {showEditModal && editingDraft && (
        <View className={styles.modalMask} onClick={closeEditModal}>
          <View className={styles.modalContent} onClick={e=>e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <View className={styles.modalLeft}>
                <Text className={styles.modalTitle}>编辑草稿</Text>
                <View className={`${styles.typeBadge} ${typeMap[editingDraft.type].className}`}>
                  <Text>{typeMap[editingDraft.type].label}</Text>
                </View>
              </View>
              <Text className={styles.modalClose} onClick={closeEditModal}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>标题 *</Text>
                <Input className={styles.formInput} placeholder="请输入标题" value={editTitle} onInput={e=>setEditTitle(e.detail.value)} maxLength={100}/>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>内容 *</Text>
                <Textarea className={styles.formTextarea} placeholder="请输入内容..." value={editContent} onInput={e=>setEditContent(e.detail.value)} maxLength={2000}/>
              </View>
              {editingDraft.images.length > 0 && (
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>已上传图片 ({editingDraft.images.length})</Text>
                  <View className={styles.imagePreviewRow}>
                    {editingDraft.images.map((img, i) => (
                      <Image key={i} className={styles.previewImage} src={img} mode="aspectFill"/>
                    ))}
                  </View>
                </View>
              )}
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>标签（逗号分隔）</Text>
                <Input className={styles.formInput} placeholder="如：经验分享,新人指南,火化技巧" value={editTags} onInput={e=>setEditTags(e.detail.value)}/>
              </View>
            </ScrollView>
            <View className={styles.modalFooter}>
              <View className={styles.saveBtn} onClick={handleSaveEdit}>
                <Text>保存草稿</Text>
              </View>
              <View className={styles.publishBtn} onClick={handleConfirmPublish}>
                <Text>确认发布</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DraftsPage;
