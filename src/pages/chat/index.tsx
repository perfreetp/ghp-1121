import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow, useDidHide } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/appStore';
import { currentUser } from '@/data/users';

interface ChatMsg {
  id: string;
  isMine: boolean;
  content: string;
  time: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const fromUserId = router.params.fromUserId as string || 'u002';
  const userName = router.params.userName as string || '对方';
  const userAvatar = router.params.avatar as string || 'https://picsum.photos/id/1005/200/200';
  const userProfession = router.params.profession as string || '同行';
  const scrollRef = useRef<any>(null);

  const chatHistories = useAppStore(s => s.chatHistories);
  const appendToChat = useAppStore(s => s.appendToChat);
  const updateMessage = useAppStore(s => s.updateMessage);
  const setChatHistory = useAppStore(s => s.setChatHistory);

  const localMessages: ChatMsg[] = chatHistories[fromUserId] || [];
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    updateMessage(fromUserId, { unread: 0 });
  }, [fromUserId, updateMessage]);

  const formatTime = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formatFriendly = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const myMsg: ChatMsg = {
      id: String(Date.now()),
      isMine: true,
      content: inputText.trim(),
      time: formatTime()
    };
    appendToChat(fromUserId, myMsg);
    updateMessage(fromUserId, {
      lastContent: inputText.trim(),
      lastTime: '刚刚',
      unread: 0
    });
    const contentToSend = inputText.trim();
    setInputText('');

    setTimeout(() => {
      const replies = [
        '好的，收到~',
        '嗯嗯，我看看',
        '这个问题我之前也遇到过',
        '我觉得可以这样试试',
        '谢谢你的分享！',
        '方便的话加个微信？'
      ];
      const reply: ChatMsg = {
        id: String(Date.now() + 1),
        isMine: false,
        content: replies[Math.floor(Math.random() * replies.length)],
        time: formatTime()
      };
      appendToChat(fromUserId, reply);
      updateMessage(fromUserId, {
        lastContent: reply.content,
        lastTime: '刚刚',
        unread: 0
      });
    }, 1800);
  };

  const getTimeDivider = (idx: number) => {
    if (idx === 0 && localMessages.length > 0) {
      return '今天 ' + localMessages[0].time;
    }
    return null;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.chatHeader}>
        <Image className={styles.avatar} src={userAvatar} mode="aspectFill"/>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{userName}</Text>
          <Text className={styles.userMeta}>· {userProfession} · 在线</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.messagesArea} ref={scrollRef}>
        {localMessages.length === 0 ? (
          <View style={{padding: 100, alignItems: 'center'}}>
            <Text style={{color: '#8F8A82', fontSize: 26, textAlign: 'center'}}>
              暂无消息，发送第一句问候吧~
            </Text>
          </View>
        ) : (
          localMessages.map((msg, idx) => (
            <View key={msg.id}>
              {getTimeDivider(idx) && (
                <View style={{alignItems:'center', marginVertical: 24}}>
                  <Text className={styles.msgTime}>{getTimeDivider(idx)}</Text>
                </View>
              )}
              <View className={`${styles.msgRow} ${msg.isMine ? styles.msgMine : styles.msgOther}`}>
                {msg.isMine ? (
                  <Image className={styles.msgAvatar} src={currentUser.avatar} mode="aspectFill"/>
                ) : (
                  <Image className={styles.msgAvatar} src={userAvatar} mode="aspectFill"/>
                )}
                <View className={`${styles.msgBubble} ${msg.isMine ? styles.bubbleMine : styles.bubbleOther}`}>
                  <Text>{msg.content}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View className={styles.inputArea}>
        <View className={styles.inputWrapper}>
          <Input
            className={styles.msgInput}
            placeholder="输入消息..."
            value={inputText}
            onInput={e => setInputText(e.detail.value)}
            onConfirm={handleSend}
            confirmType="send"
          />
        </View>
        <View className={styles.sendBtn} onClick={handleSend}>
          <Text>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatPage;
