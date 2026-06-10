import type { WorkItem } from '@/types';

export const mockWorks: WorkItem[] = [
  {
    id: 'w001',
    title: '小型犬送别仪式·毛孩子最后的体面',
    cover: 'https://picsum.photos/id/1062/600/400',
    description: '为一只陪伴了主人12年的吉娃娃举办的温馨送别仪式。布置了小雏菊和主人手写的卡片，播放了狗狗生前最喜欢的音乐。',
    images: [
      'https://picsum.photos/id/1062/600/400',
      'https://picsum.photos/id/1025/600/400',
      'https://picsum.photos/id/1074/600/400'
    ],
    createdAt: '2026-06-08',
    likes: 68,
    views: 425
  },
  {
    id: 'w002',
    title: '遗体妆容修复·让逝者安详离去',
    cover: 'https://picsum.photos/id/1040/600/400',
    description: '一位因意外离世的长辈，面部有损伤。经过6小时精心修复，恢复了安详的面容，家属看到后痛哭流涕，说"这就是他睡着的样子"。',
    images: [
      'https://picsum.photos/id/1040/600/400'
    ],
    createdAt: '2026-06-03',
    likes: 156,
    views: 1208
  },
  {
    id: 'w003',
    title: '宠物骨灰盒定制·手工陶艺作品',
    cover: 'https://picsum.photos/id/1074/600/400',
    description: '手工拉坯制作的陶瓷骨灰盒，每一件都独一无二。表面雕刻了小爪印和宠物的名字，底部留有主人的寄语空间。',
    images: [
      'https://picsum.photos/id/1074/600/400',
      'https://picsum.photos/id/1025/600/400'
    ],
    createdAt: '2026-05-28',
    likes: 92,
    views: 687
  },
  {
    id: 'w004',
    title: '海葬服务·回归自然的告别',
    cover: 'https://picsum.photos/id/1050/600/400',
    description: '陪同家属乘船出海，在指定海域完成骨灰撒海仪式。准备了花瓣和可降解祭祀用品，全程庄重而温馨。',
    images: [
      'https://picsum.photos/id/1050/600/400',
      'https://picsum.photos/id/1018/600/400'
    ],
    createdAt: '2026-05-22',
    likes: 73,
    views: 541
  },
  {
    id: 'w005',
    title: '猫咪专属纪念空间布置',
    cover: 'https://picsum.photos/id/1015/600/400',
    description: '为一只15岁的橘猫布置的家庭纪念角。包含照片墙、猫咪生前最喜欢的玩具、蜡烛台和鲜花。',
    images: [
      'https://picsum.photos/id/1015/600/400',
      'https://picsum.photos/id/1062/600/400'
    ],
    createdAt: '2026-05-18',
    likes: 54,
    views: 389
  },
  {
    id: 'w006',
    title: '传统礼仪·长辈寿衣穿戴服务',
    cover: 'https://picsum.photos/id/1006/600/400',
    description: '严格按照传统习俗为百岁老人穿戴寿衣，程序规范、态度恭敬。家属特别感谢，说"老爷子走得体面"。',
    images: [
      'https://picsum.photos/id/1006/600/400'
    ],
    createdAt: '2026-05-12',
    likes: 128,
    views: 892
  }
];
