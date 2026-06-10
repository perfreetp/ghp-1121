import type { Question, Answer } from '@/types';
import { mockUsers } from './users';

export const mockAnswers: Answer[] = [
  {
    id: 'a001',
    questionId: 'q001',
    userId: mockUsers[0].id,
    userInfo: mockUsers[0],
    content: '小型犬骨灰收集我一般这样操作：1. 先用专用的细毛软刷轻轻扫，注意方向要一致，避免骨灰飞散；2. 准备一张光滑的牛皮纸放在下方，扫落的骨灰会自然聚集；3. 对于炉壁上残留的骨灰，可以用吹风机（冷风档！！！千万不能用热风）轻轻吹；4. 最后用医用棉签蘸一点纯净水，擦拭那些特别细小的残留。关键是耐心，不要急。',
    images: [],
    createdAt: '2026-06-09 11:30',
    likes: 56,
    isBest: true,
    isLiked: false
  },
  {
    id: 'a002',
    questionId: 'q001',
    userId: mockUsers[2].id,
    userInfo: mockUsers[2],
    content: '补充一点：骨灰收集完建议过一下200目的细筛，可以滤掉杂质，骨灰也更细腻。淘宝上就有卖，很便宜。另外操作时可以戴一个医用口罩，虽然不脏，但心理上会更舒服一些。',
    images: [],
    createdAt: '2026-06-09 12:15',
    likes: 23,
    isBest: false,
    isLiked: true
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q001',
    userId: mockUsers[4].id,
    userInfo: mockUsers[4],
    title: '小型犬骨灰收集有什么实用技巧？',
    content: '各位前辈好！我是刚入行的新手，想问一下宠物火化过程中，对于骨灰的收集和整理有什么技巧吗？特别是小型犬的骨灰很细碎，总是收集不干净，炉膛和烟道里总会有残留，有什么好方法吗？',
    images: [],
    tags: ['火化技巧', '骨灰收集'],
    reward: 50,
    status: 'resolved',
    createdAt: '2026-06-09 10:15',
    views: 328,
    answers: 8,
    bestAnswerId: 'a001',
    answersList: mockAnswers.slice(0, 2),
    isCollected: true
  },
  {
    id: 'q002',
    userId: mockUsers[6].id,
    userInfo: mockUsers[6],
    title: '如何安抚情绪特别激动的家属？求实战经验',
    content: '昨天服务了一位失独的老母亲，全程情绪崩溃，几次哭晕过去。我除了递纸巾什么都做不了，感觉自己很没用。想请教有经验的同行：1. 这种情况应该说些什么？2. 肢体接触合适吗？比如拍拍肩膀、握握手？3. 有什么特殊的沟通技巧吗？',
    images: [],
    tags: ['家属沟通', '心理安抚'],
    reward: 100,
    status: 'open',
    createdAt: '2026-06-08 09:05',
    views: 892,
    answers: 23,
    isCollected: false
  },
  {
    id: 'q003',
    userId: mockUsers[9].id,
    userInfo: mockUsers[9],
    title: '遗体整理师正规培训和考证渠道有哪些？',
    content: '目前市面上培训机构太多了，各种证书满天飞，不知道哪些是国家认可的。有没有前辈推荐一下：1. 正规的培训渠道（线上/线下都可以）；2. 哪些证书是行业内认可的？3. 大概需要多长时间和多少费用？坐标西安，谢谢大家！',
    images: [],
    tags: ['考证', '培训', '职业入门'],
    reward: 80,
    status: 'open',
    createdAt: '2026-06-06 20:10',
    views: 1205,
    answers: 34,
    isCollected: true
  },
  {
    id: 'q004',
    userId: mockUsers[5].id,
    userInfo: mockUsers[5],
    title: '严重创伤遗体的面部修复用什么材料比较好？',
    content: '最近遇到一例车祸逝者，面部损伤比较严重。尝试了几种填充材料效果都不太理想。想问一下：1. 塑形材料用硅胶还是石蜡好？各自的优缺点是什么？2. 皮肤颜色如何调配更自然？3. 有没有推荐的品牌和购买渠道？希望有经验的前辈不吝赐教。',
    images: [],
    tags: ['遗体修复', '材料推荐'],
    reward: 150,
    status: 'resolved',
    createdAt: '2026-06-05 15:30',
    views: 678,
    answers: 15,
    bestAnswerId: 'a003',
    isCollected: true
  },
  {
    id: 'q005',
    userId: mockUsers[3].id,
    userInfo: mockUsers[3],
    title: '夏天高温天气如何做好遗体防腐？',
    content: '马上进入夏季了，气温升高对我们这个行业是个大考验。想请教各位同行：1. 没有冷藏条件的情况下，临时防腐有什么办法？2. 常用的防腐药剂有哪些？对人体有害吗？3. 防腐操作的注意事项和安全规范是什么？谢谢！',
    images: [],
    tags: ['防腐技术', '安全操作', '夏季'],
    reward: 120,
    status: 'open',
    createdAt: '2026-06-04 10:20',
    views: 956,
    answers: 19,
    isCollected: false
  },
  {
    id: 'q006',
    userId: mockUsers[8].id,
    userInfo: mockUsers[8],
    title: '第一次独立接单需要注意什么？',
    content: '下周要第一次独立接单了，虽然跟师傅学习了半年，但是心里还是没底。想问问各位前辈：1. 第一次接单最容易犯的错误是什么？2. 有哪些细节是新人容易忽略的？3. 如果出了突发状况应该怎么应对？求过来人指点！',
    images: [],
    tags: ['新人指南', '接单技巧'],
    reward: 60,
    status: 'open',
    createdAt: '2026-06-03 14:45',
    views: 542,
    answers: 28,
    isCollected: false
  }
];
