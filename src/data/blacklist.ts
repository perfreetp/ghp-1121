import type { BlacklistItem } from '@/types';

export const mockBlacklist: BlacklistItem[] = [
  {
    id: 'b001',
    userId: 'u999',
    nickname: '某某殡葬服务',
    avatar: 'https://picsum.photos/id/1000/200/200',
    profession: '未认证',
    reason: '虚假宣传，冒充资深从业者',
    addedAt: '2026-06-05'
  },
  {
    id: 'b002',
    userId: 'u888',
    nickname: '低价接单人',
    avatar: 'https://picsum.photos/id/1011/200/200',
    profession: '未认证',
    reason: '恶意低价竞争，扰乱市场',
    addedAt: '2026-06-09'
  },
  {
    id: 'b003',
    userId: 'u777',
    nickname: '键盘侠007',
    avatar: 'https://picsum.photos/id/1013/200/200',
    profession: '未认证',
    reason: '发表歧视性言论，人身攻击从业者',
    addedAt: '2026-05-28'
  }
];
