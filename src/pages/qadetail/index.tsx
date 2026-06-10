import React, { useState } from 'react';
import { View, Text, Image, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { currentUser } from '@/data/users';
import type { Answer, Question } from '@/types';

const QaDetailPage: React.FC = () => {
  const router = useRouter();
  const qId = router.params.qId as string;
  
  const question = useAppStore(s => s.questions.find(q => q.id === qId));
  const updateQuestion = useAppStore(s => s.updateQuestion);
  const addAnswerToQuestion = useAppStore(s => s.addAnswerToQuestion);
  const toggleCollected = useAppStore(s => s.toggleCollected);
  
  const [newAnswer, setNewAnswer] = useState('');

  const getAnswers = (q: Question) => {
    if (q.answersList && q.answersList.length > 0) return q.answersList;
    return [];
  };

  const formatNow = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleLikeAnswer = (a: Answer, q: Question) => {
    const answers = getAnswers(q).map(x => 
      x.id === a.id ? { ...x, isLiked: !x.isLiked, likes: x.isLiked ? x.likes - 1 : x.likes + 1 } : x
    );
    updateQuestion(q.id, { answersList: answers });
  };

  const handleAdopt = (a: Answer, q: Question) => {
    if (q.userId !== currentUser.id && q.userId !== 'u001') {
      Taro.showToast({ title: '仅提问者可采纳最佳答案', icon: 'none' });
      return;
    }
    if (q.status === 'resolved' && q.bestAnswerId === a.id) return;
    const answers = getAnswers(q).map(x => ({ ...x, isBest: x.id === a.id }));
    updateQuestion(q.id, { status: 'resolved', bestAnswerId: a.id, answersList: answers });
    Taro.showToast({ title: '已采纳最佳答案', icon: 'success' });
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) {
      Taro.showToast({ title: '请输入回答内容', icon: 'none' });
      return;
    }
    if (!question) return;
    const answer: Answer = {
      id: 'a' + Date.now(),
      questionId: question.id,
      userId: currentUser.id,
      userInfo: currentUser,
      content: newAnswer.trim(),
      images: [],
      createdAt: formatNow(),
      likes: 0,
      isBest: false,
      isLiked: false
    };
    addAnswerToQuestion(question.id, answer);
    setNewAnswer('');
    Taro.showToast({ title: '回答已发布', icon: 'success' });
  };

  if (!question) {
    return (
      <View className={styles.pageContainer}>
        <Text>问题不存在</Text>
      </View>
    );
  }

  const answers = getAnswers(question);
  const bestAnswer = answers.find(a => a.isBest);

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollY>
        <View className={styles.questionCard}>
          <View className={styles.qHeader}>
            <View className={styles.rewardBadge}>
              <Text>💰 悬赏 ¥{question.reward}</Text>
            </View>
            <View style={{flexDirection:'row', gap: 16, alignItems:'center'}}>
              <View 
                className={classnames(styles.collectBtn, question.isCollected && styles.collectBtnActive)}
                onClick={() => toggleCollected('question', question.id)}
              >
                <Text>{question.isCollected ? '★ 已收藏' : '☆ 收藏'}</Text>
              </View>
              <View className={classnames(styles.statusBadge, question.status === 'resolved' ? styles.statusResolved : styles.statusOpen)}>
                <Text>{question.status === 'resolved' ? '✓ 已解决' : '● 待回答'}</Text>
              </View>
            </View>
          </View>
          <Text className={styles.qTitle}>{question.title}</Text>
          <Text className={styles.qContent}>{question.content}</Text>
          <View className={styles.qTagList}>
            {question.tags.map((t,i) => (
              <View key={i} className={styles.qTag}><Text>#{t}</Text></View>
            ))}
          </View>
          <View className={styles.qMetaRow}>
            <View className={styles.userInfo}>
              <Image className={styles.avatar} src={question.userInfo.avatar} mode="aspectFill" />
              <View>
                <Text className={styles.userName}>
                  {question.userInfo.anonymity === 'full-anonymous' ? '匿名同行' : question.userInfo.nickname}
                </Text>
                <Text className={styles.userMeta}> · {question.createdAt}</Text>
              </View>
            </View>
            <View className={styles.statsRow}>
              <Text>👁 {question.views}</Text>
              <Text>💬 {question.answers}</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text>全部回答</Text>
          <Text style={{fontSize:24, color:'#8F8A82', fontWeight:'normal'}}>({answers.length})</Text>
        </View>

        {answers.length === 0 ? (
          <View style={{padding:80, textAlign:'center'}}>
            <Text style={{color:'#8F8A82', fontSize:28}}>暂无回答，快来抢沙发吧～</Text>
          </View>
        ) : (
          <View className={styles.answerList}>
            {bestAnswer && (
              <View className={classnames(styles.answerCard, styles.answerCardBest)}>
                <View className={styles.aHeader}>
                  <View className={styles.aUser}>
                    <Image className={styles.avatar} src={bestAnswer.userInfo.avatar} mode="aspectFill" />
                    <View>
                      <Text className={styles.userName}>
                        {bestAnswer.userInfo.anonymity === 'full-anonymous' ? '匿名同行' : bestAnswer.userInfo.nickname}
                      </Text>
                    </View>
                  </View>
                  <View className={styles.bestBadge}><Text>🏆 最佳答案</Text></View>
                </View>
                <Text className={styles.aContent}>{bestAnswer.content}</Text>
                <View className={styles.aFooter}>
                  <Text style={{fontSize:22, color:'#8F8A82'}}>{bestAnswer.createdAt}</Text>
                  <View className={styles.aActions}>
                    <View 
                      className={classnames(styles.likeBtn, bestAnswer.isLiked && styles.liked)}
                      onClick={() => handleLikeAnswer(bestAnswer, question)}
                    ><Text>♥ {bestAnswer.likes}</Text></View>
                  </View>
                </View>
              </View>
            )}
            {answers.filter(a => !a.isBest).map(a => (
              <View key={a.id} className={styles.answerCard}>
                <View className={styles.aHeader}>
                  <View className={styles.aUser}>
                    <Image className={styles.avatar} src={a.userInfo.avatar} mode="aspectFill" />
                    <View>
                      <Text className={styles.userName}>
                        {a.userInfo.anonymity === 'full-anonymous' ? '匿名同行' : a.userInfo.nickname}
                      </Text>
                      <Text className={styles.userMeta}> · 从业{a.userInfo.yearsExperience}年</Text>
                    </View>
                  </View>
                  {question.userId === currentUser.id || question.userId === 'u001' ? (
                    question.bestAnswerId ? (
                      question.bestAnswerId === a.id ? (
                        <View className={classnames(styles.adoptBtn, styles.adoptBtnBest)}><Text>已采纳</Text></View>
                      ) : null
                    ) : (
                      <View className={styles.adoptBtn} onClick={() => handleAdopt(a, question)}><Text>采纳为最佳</Text></View>
                    )
                  ) : null}
                </View>
                <Text className={styles.aContent}>{a.content}</Text>
                <View className={styles.aFooter}>
                  <Text style={{fontSize:22, color:'#8F8A82'}}>{a.createdAt}</Text>
                  <View className={styles.aActions}>
                    <View 
                      className={classnames(styles.likeBtn, a.isLiked && styles.liked)}
                      onClick={() => handleLikeAnswer(a, question)}
                    ><Text>♥ {a.likes}</Text></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View className={styles.writeArea}>
        <Textarea
          className={styles.writeInput}
          placeholder="写下你的回答..."
          value={newAnswer}
          onInput={e => setNewAnswer(e.detail.value)}
          maxlength={2000}
        />
        <View className={styles.submitBtn} onClick={handleSubmitAnswer}>
          <Text>发布回答</Text>
        </View>
      </View>
    </View>
  );
};

export default QaDetailPage;
