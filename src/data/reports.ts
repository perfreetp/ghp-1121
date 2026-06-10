import type { ReportItem } from '@/types';

export const mockReports: ReportItem[] = [
  {
    id: 'r001',
    targetType: 'user',
    targetId: 'u999',
    targetTitle: '用户："某某殡葬服务"',
    reason: '虚假宣传',
    detail: '该用户声称自己是"资深遗体整理师，从业10年"，但从其发布的内容来看，明显缺乏专业知识，很多基本操作都描述错误，怀疑是虚假宣传骗取客户。',
    status: 'resolved',
    createdAt: '2026-06-05'
  },
  {
    id: 'r002',
    targetType: 'post',
    targetId: 'p999',
    targetTitle: '动态："行业暴利揭秘..."',
    reason: '不实信息',
    detail: '这篇帖子夸大行业利润，编造"一单赚几万"的虚假信息，容易让公众对我们这个行业产生误解，也会吸引很多不怀好意的人入行扰乱市场。',
    status: 'processing',
    createdAt: '2026-06-08'
  },
  {
    id: 'r003',
    targetType: 'comment',
    targetId: 'c999',
    targetTitle: '评论："做这行的都是..."',
    reason: '人身攻击/歧视性言论',
    detail: '该评论对从事这个行业的人进行人身攻击，用了很多侮辱性的词汇。我们的工作是为逝者和家属服务，应该得到基本的尊重。',
    status: 'resolved',
    createdAt: '2026-06-02'
  },
  {
    id: 'r004',
    targetType: 'user',
    targetId: 'u888',
    targetTitle: '用户："低价接单人"',
    reason: '恶意低价竞争',
    detail: '该用户在多个群里发布"遗体整理500元全包"的广告，远低于市场价，而且服务质量无法保证，严重扰乱了市场秩序。',
    status: 'pending',
    createdAt: '2026-06-09'
  }
];
