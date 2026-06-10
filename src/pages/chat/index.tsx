import React, { useState, useRef } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';

interface ChatMsg {
  id: string;
  isMine: boolean;
  content: string;
  time: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const userName = router.params.userName || '对方';
  const userAvatar = router.params.avatar || 'https://picsum.photos/id/1005/200/200';
  const userProfession = router.params.profession || '同行';
  const scrollRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', isMine: false, content: '你好！请问你是宠物殡葬师吗？我想请教一下关于骨灰盒定制的问题~', time: '09:30' },
    { id: '2', isMine: true, content: '你好！是的，从业3年了，有什么可以帮你的？', time: '09:32' },
    { id: '3', isMine: false, content: '太好了！我最近在考虑给客户做定制的陶瓷骨灰盒，但不知道找什么渠道烧制比较靠谱', time: '09:33' },
    { id: '4', isMine: true, content: '我一直在用景德镇那边的工作室，质量不错，你需要的话我可以推给你联系方式。他们可以定制形状、颜色、刻字，起订量也不高。', time: '09:35' },
    { id: '5', isMine: false, content: '太棒了！方便的话加个微信私聊？另外想请问一下，你们那边定制的收费标准大概是怎样的？', time: '09:36' },
  ]);
  const [inputText, setInputText] = useState('');

  const formatTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMsg = {
      id: String(Date.now()),
      isMine: true,
      content: inputText.trim(),
      time: formatTime()
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => {
      const reply: ChatMsg = {
        id: String(Date.now() + 1),
        isMine: false,
        content: '收到~ 我看看再回复你！',
        time: formatTime()
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const showTimeDivider = (idx: number) => {
    if (idx === 0) return true;
    return false;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.chatHeader}>
        <Image className={styles.avatar} src={userAvatar} mode="aspectFill" />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{userName}</Text>
          <Text className={styles.userMeta}>· {userProfession} · 在线</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.messagesArea} ref={scrollRef}>
        {messages.map((msg, idx) => (
          <View key={msg.id}>
            {showTimeDivider(idx) && <Text className={styles.msgTime}>今天 09:30</Text>}
            <View className={`${styles.msgRow} ${msg.isMine ? styles.msgMine : styles.msgOther}`}>
              {msg.isMine ? (
                <Image className={styles.msgAvatar} src="https://picsum.photos/id/1012/200/200" mode="aspectFill" />
              ) : (
                <Image className={styles.msgAvatar} src={userAvatar} mode="aspectFill" />
              )}
              <View className={`${styles.msgBubble} ${msg.isMine ? styles.bubbleMine : styles.bubbleOther}`}>
                <Text>{msg.content}</Text>
              </View>
            </View>
          </View>
        ))}
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
