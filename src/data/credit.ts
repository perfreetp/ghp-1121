import type { CreditRecord } from '@/types';

export const mockCreditRecords: CreditRecord[] = [
  {
    id: 'cr001',
    type: 'plus',
    amount: 10,
    reason: '发布案例获得100+点赞',
    time: '2026-06-08'
  },
  {
    id: 'cr002',
    type: 'plus',
    amount: 5,
    reason: '回答问题被选为最佳答案',
    time: '2026-06-05'
  },
  {
    id: 'cr003',
    type: 'plus',
    amount: 20,
    reason: '完成职业认证',
    time: '2026-06-01'
  },
  {
    id: 'cr004',
    type: 'plus',
    amount: 5,
    reason: '分享活动获得30+报名',
    time: '2026-05-28'
  },
  {
    id: 'cr005',
    type: 'plus',
    amount: 3,
    reason: '连续登录7天',
    time: '2026-05-25'
  },
  {
    id: 'cr006',
    type: 'minus',
    amount: 5,
    reason: '发布动态被删除（含敏感内容）',
    time: '2026-05-15'
  }
];

export const creditRules = [
  { type: 'plus', item: '完成职业认证', score: '+20', desc: '首次通过职业身份认证' },
  { type: 'plus', item: '发布案例/动态', score: '+2', desc: '每发布一条有效内容' },
  { type: 'plus', item: '内容获得100+点赞', score: '+10', desc: '优质内容激励' },
  { type: 'plus', item: '回答被选为最佳', score: '+5', desc: '悬赏问答最佳答案' },
  { type: 'plus', item: '活动分享转化', score: '+5', desc: '通过你的分享30人报名' },
  { type: 'plus', item: '连续登录7天', score: '+3', desc: '活跃用户奖励' },
  { type: 'minus', item: '内容违规删除', score: '-5', desc: '发布违规内容被删除' },
  { type: 'minus', item: '恶意举报', score: '-10', desc: '被证实为恶意举报' },
  { type: 'minus', item: '虚假认证', score: '-50', desc: '提供虚假认证材料' }
];
