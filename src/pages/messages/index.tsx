import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Message } from '@/types';
import { mockMessages } from '@/data/messages';
import EmptyState from '@/components/EmptyState';

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchText, setSearchText] = useState('');

  const filteredMessages = useMemo(() => {
    if (!searchText.trim()) return messages;
    const keyword = searchText.toLowerCase();
    return messages.filter(m =>
      m.fromUserName.toLowerCase().includes(keyword) ||
      m.lastContent.toLowerCase().includes(keyword)
    );
  }, [messages, searchText]);

  const handleSearchChange = (e: any) => {
    setSearchText(e.detail.value);
  };

  const handleMessageClick = (msg: Message) => {
    console.log('[Messages] Open chat with:', msg.fromUserId);
    if (msg.unread > 0) {
      setMessages(prev => prev.map(m =>
        m.id === msg.id ? { ...m, unread: 0 } : m
      ));
    }
    Taro.showToast({ title: '聊天页开发中', icon: 'none' });
  };

  const handleMarkRead = (msg: Message, e: any) => {
    e.stopPropagation?.();
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, unread: 0 } : m
    ));
    Taro.showToast({ title: '已标为已读', icon: 'success' });
  };

  const handleDelete = (msg: Message, e: any) => {
    e.stopPropagation?.();
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除与「${msg.fromUserName}」的对话吗？`,
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          setMessages(prev => prev.filter(m => m.id !== msg.id));
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder="搜索联系人或消息内容"
          value={searchText}
          onInput={handleSearchChange}
          confirmType="search"
        />
      </View>

      {filteredMessages.length === 0 ? (
        <EmptyState
          title={searchText ? '未找到相关消息' : '暂无消息'}
          description={searchText ? '换个关键词试试吧~' : '快去和同行们打个招呼吧~'}
        />
      ) : (
        <View className={styles.messageList}>
          {filteredMessages.map(msg => (
            <View
              key={msg.id}
              className={styles.messageItem}
              onClick={() => handleMessageClick(msg)}
            >
              <View className={styles.avatarWrapper}>
                <Image
                  className={styles.avatar}
                  src={msg.fromUserAvatar}
                  mode="aspectFill"
                />
                {msg.unread > 0 && (
                  <View className={styles.unreadBadge}>
                    <Text>{msg.unread > 99 ? '99+' : msg.unread}</Text>
                  </View>
                )}
              </View>

              <View className={styles.messageContent}>
                <View className={styles.messageTopRow}>
                  <Text
                    className={classnames(
                      styles.userName,
                      msg.unread > 0 && styles.userNameUnread
                    )}
                  >
                    {msg.fromUserName}
                  </Text>
                  <Text
                    className={classnames(
                      styles.lastTime,
                      msg.unread > 0 && styles.lastTimeUnread
                    )}
                  >
                    {msg.lastTime}
                  </Text>
                </View>
                <Text
                  className={classnames(
                    styles.lastContent,
                    msg.unread > 0 && styles.lastContentUnread
                  )}
                >
                  {msg.lastContent}
                </Text>
              </View>

              <Text className={styles.swipeHint}>›</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default MessagesPage;
