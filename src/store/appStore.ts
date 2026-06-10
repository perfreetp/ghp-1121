import { create } from 'zustand';
import type { Question, Activity, Message, DraftItem, WorkItem, CaseItem, Answer } from '@/types';
import { mockQuestions } from '@/data/qa';
import { mockActivities } from '@/data/activities';
import { mockMessages } from '@/data/messages';
import { mockDrafts } from '@/data/drafts';
import { mockWorks } from '@/data/works';
import { mockCases } from '@/data/cases';
import { mockUsers, currentUser } from '@/data/users';

interface ChatMessage {
  id: string;
  isMine: boolean;
  content: string;
  time: string;
}

interface AppState {
  questions: Question[];
  activities: Activity[];
  messages: Message[];
  drafts: DraftItem[];
  works: WorkItem[];
  cases: CaseItem[];
  collectedQuestions: string[];
  collectedCases: string[];
  collectedPosts: string[];
  chatHistories: Record<string, ChatMessage[]>;
  setQuestions: (q: Question[]) => void;
  updateQuestion: (id: string, patch: Partial<Question>) => void;
  addAnswerToQuestion: (qId: string, answer: Answer) => void;
  setActivities: (a: Activity[]) => void;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  setMessages: (m: Message[]) => void;
  updateMessage: (fromUserId: string, patch: Partial<Message>) => void;
  appendToChat: (fromUserId: string, msg: ChatMessage) => void;
  setChatHistory: (fromUserId: string, msgs: ChatMessage[]) => void;
  setDrafts: (d: DraftItem[]) => void;
  removeDraft: (id: string) => void;
  setWorks: (w: WorkItem[]) => void;
  setCases: (c: CaseItem[]) => void;
  toggleCollected: (type: 'question' | 'case' | 'post', id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  questions: mockQuestions,
  activities: mockActivities,
  messages: mockMessages,
  drafts: mockDrafts,
  works: mockWorks,
  cases: mockCases,
  collectedQuestions: mockQuestions.filter(q => q.isCollected).map(q => q.id),
  collectedCases: mockCases.filter(c => c.isCollected).map(c => c.id),
  collectedPosts: [],
  chatHistories: {
    'u002': [
      { id: 'c1', isMine: false, content: '你好！请问你那边遗体修复的培训是线上还是线下？', time: '昨天 14:20' },
      { id: 'c2', isMine: true, content: '线上线下都有哦，线下在北京，你坐标哪里？', time: '昨天 14:30' },
      { id: 'c3', isMine: false, content: '我在天津，过去北京挺方便的。线下培训一般几天？', time: '昨天 14:35' },
      { id: 'c4', isMine: true, content: '两天，第一天理论+第二天实操，可以先看线上课再参加线下复训', time: '昨天 14:40' },
      { id: 'c5', isMine: false, content: '好的，那我们周六下午在培训中心见，到时候提前发定位给你', time: '2分钟前' },
    ],
    'u003': [
      { id: 'c1', isMine: false, content: '请问你那套宠物火化设备是从哪里采购的？方便介绍一下吗？', time: '1小时前' },
    ],
    'u004': [
      { id: 'c1', isMine: false, content: '你上次分享的那个面部修复案例太赞了！', time: '前天 10:15' },
      { id: 'c2', isMine: true, content: '谢谢~ 很多细节也是慢慢摸索出来的', time: '前天 10:20' },
      { id: 'c3', isMine: false, content: '那个修复案例的后续更新了，你可以看看～', time: '昨天' },
    ],
    'u005': [
      { id: 'c1', isMine: false, content: '非常感谢你之前的建议！', time: '前天' },
      { id: 'c2', isMine: true, content: '不客气，有问题随时沟通~', time: '前天' },
      { id: 'c3', isMine: false, content: '收到，谢谢你的建议，我会试试看的！', time: '昨天' },
    ],
    'u006': [
      { id: 'c1', isMine: false, content: '【系统通知】您报名的"线下探访活动"明天就要开始啦，请准时参加~', time: '2天前' },
    ],
    'u007': [
      { id: 'c1', isMine: false, content: '关于哀伤辅导的资料我已经整理好了，稍后发到你邮箱', time: '3天前' },
      { id: 'c2', isMine: true, content: '太好了！非常感谢李老师', time: '3天前' },
    ],
  },

  setQuestions: (q) => set({ questions: q }),
  updateQuestion: (id, patch) => set(state => ({
    questions: state.questions.map(q => q.id === id ? { ...q, ...patch } : q)
  })),
  addAnswerToQuestion: (qId, answer) => set(state => ({
    questions: state.questions.map(q => {
      if (q.id !== qId) return q;
      const existing = q.answersList || [];
      return { ...q, answers: q.answers + 1, answersList: [...existing, answer] };
    })
  })),

  setActivities: (a) => set({ activities: a }),
  updateActivity: (id, patch) => set(state => ({
    activities: state.activities.map(a => a.id === id ? { ...a, ...patch } : a)
  })),

  setMessages: (m) => set({ messages: m }),
  updateMessage: (fromUserId, patch) => set(state => ({
    messages: state.messages.map(m => m.fromUserId === fromUserId ? { ...m, ...patch } : m)
  })),
  appendToChat: (fromUserId, msg) => set(state => {
    const history = state.chatHistories[fromUserId] || [];
    return {
      chatHistories: { ...state.chatHistories, [fromUserId]: [...history, msg] }
    };
  }),
  setChatHistory: (fromUserId, msgs) => set(state => ({
    chatHistories: { ...state.chatHistories, [fromUserId]: msgs }
  })),

  setDrafts: (d) => set({ drafts: d }),
  removeDraft: (id) => set(state => ({ drafts: state.drafts.filter(d => d.id !== id) })),

  setWorks: (w) => set({ works: w }),
  setCases: (c) => set({ cases: c }),

  toggleCollected: (type, id) => set(state => {
    if (type === 'question') {
      const exists = state.collectedQuestions.includes(id);
      const next = exists
        ? state.collectedQuestions.filter(x => x !== id)
        : [...state.collectedQuestions, id];
      const updated = state.questions.map(q =>
        q.id === id ? { ...q, isCollected: !exists } : q
      );
      return { collectedQuestions: next, questions: updated };
    }
    if (type === 'case') {
      const exists = state.collectedCases.includes(id);
      const next = exists
        ? state.collectedCases.filter(x => x !== id)
        : [...state.collectedCases, id];
      const updated = state.cases.map(c =>
        c.id === id ? { ...c, isCollected: !exists } : c
      );
      return { collectedCases: next, cases: updated };
    }
    return state;
  }),
}));

export { currentUser, mockUsers };
