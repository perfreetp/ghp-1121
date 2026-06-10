import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockBlacklist } from '@/data/blacklist';
import type { BlacklistItem } from '@/types';

const BlacklistPage: React.FC = () => {
  const [list, setList] = useState<BlacklistItem[]>(mockBlacklist);
  const [showModal, setShowModal] = useState(false);
  const [pendingItem, setPendingItem] = useState<BlacklistItem | null>(null);

  const handleUnblock = (item: BlacklistItem) => {
    setPendingItem(item);
    setShowModal(true);
  };

  const confirmUnblock = () => {
    if (pendingItem) {
      setList(prev => prev.filter(i => i.id !== pendingItem.id));
      Taro.showToast({ title: '已解除拉黑', icon: 'success' });
    }
    setShowModal(false);
    setPendingItem(null);
  };

  const cancelUnblock = () => {
    setShowModal(false);
    setPendingItem(null);
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.header}>
        <Text className={styles.headerDesc}>
          被拉黑的用户将无法与你互动、查看你的动态。解除拉黑后，对方恢复正常权限。
        </Text>
      </View>

      {list.length === 0 ? (
        <View className={styles.emptyState}>
          <Text>暂无拉黑用户</Text>
        </View>
      ) : (
        <ScrollView scrollY className={styles.list}>
          {list.map(item => (
            <View key={item.id} className={styles.item}>
              <View className={styles.itemTop}>
                <View className={styles.itemLeft}>
                  <View className={styles.avatarWrapper}>
                    <Image className={styles.avatar} src={item.avatar} mode="aspectFill" />
                    <View className={styles.badge}>
                      <Text>!</Text>
                    </View>
                  </View>
                  <View className={styles.userInfo}>
                    <View className={styles.nameRow}>
                      <Text className={styles.nickname}>{item.nickname}</Text>
                      <View className={styles.professionTag}>
                        <Text>{item.profession}</Text>
                      </View>
                    </View>
                    <Text className={styles.reasonLabel}>拉黑原因</Text>
                    <Text className={styles.reasonText}>{item.reason}</Text>
                  </View>
                </View>
                <View className={styles.unblockBtn} onClick={() => handleUnblock(item)}>
                  <Text>解除拉黑</Text>
                </View>
              </View>
              <View className={styles.itemBottom}>
                <Text className={styles.addedAt}>加入时间：{item.addedAt}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {showModal && pendingItem && (
        <View className={styles.modalMask} onClick={cancelUnblock}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>解除拉黑确认</Text>
            <Text className={styles.modalDesc}>
              确定要将「{pendingItem.nickname}」从黑名单中移除吗？
              {'\n'}解除后对方可以正常与你互动。
            </Text>
            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.modalBtnCancel}`} onClick={cancelUnblock}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.modalBtnConfirm}`} onClick={confirmUnblock}>
                <Text>确认解除</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BlacklistPage;
