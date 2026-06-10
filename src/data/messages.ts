import type { Message } from '@/types';

export const mockMessages: Message[] = [
  {
    id: 'm001',
    fromUserId: 'u002',
    fromUserName: '陈师傅',
    fromUserAvatar: 'https://picsum.photos/id/1012/200/200',
    lastContent: '好的，那我们周六下午在培训中心见，到时候提前发定位给你',
    lastTime: '2分钟前',
    unread: 2
  },
  {
    id: 'm002',
    fromUserId: 'u003',
    fromUserName: '小王-宠物殡葬师',
    fromUserAvatar: 'https://picsum.photos/id/1025/200/200',
    lastContent: '请问你那套宠物火化设备是从哪里采购的？方便介绍一下吗？',
    lastTime: '1小时前',
    unread: 1
  },
  {
    id: 'm003',
    fromUserId: 'u004',
    fromUserName: '李姐-遗体整理',
    fromUserAvatar: 'https://picsum.photos/id/1062/200/200',
    lastContent: '那个修复案例的后续更新了，你可以看看～',
    lastTime: '昨天',
    unread: 0
  },
  {
    id: 'm004',
    fromUserId: 'u005',
    fromUserName: '匿名同行',
    fromUserAvatar: 'https://picsum.photos/id/1074/200/200',
    lastContent: '收到，谢谢你的建议，我会试试看的！',
    lastTime: '昨天',
    unread: 0
  },
  {
    id: 'm005',
    fromUserId: 'u006',
    fromUserName: '活动助手',
    fromUserAvatar: 'https://picsum.photos/id/1035/200/200',
    lastContent: '【系统通知】您报名的"线下探访活动"明天就要开始啦，请准时参加~',
    lastTime: '2天前',
    unread: 1
  },
  {
    id: 'm006',
    fromUserId: 'u007',
    fromUserName: '张老师-心理咨询',
    fromUserAvatar: 'https://picsum.photos/id/1005/200/200',
    lastContent: '关于哀伤辅导的资料我已经整理好了，稍后发到你邮箱',
    lastTime: '3天前',
    unread: 0
  }
];
