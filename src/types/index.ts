export type UserRole = 'pet-funerary' | 'body-groomer' | 'other' | 'pending' | 'unverified';

export type PostType = 'dynamic' | 'help' | 'experience';
export type QaStatus = 'open' | 'resolved';
export type ActivityType = 'online' | 'offline';
export type CaseType = 'pet-funeral' | 'body-grooming' | 'memorial' | 'other';
export type AnonymityLevel = 'full-anonymous' | 'semi-anonymous' | 'public';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  profession: string;
  professionId: UserRole;
  verified: boolean;
  city: string;
  anonymity: AnonymityLevel;
  bio?: string;
  creditScore: number;
  acceptOrder: boolean;
  skills: string[];
  yearsExperience: number;
  feeRange?: {
    min: number;
    max: number;
    unit: string;
  };
}

export interface Post {
  id: string;
  type: PostType;
  userId: string;
  userInfo: User;
  content: string;
  images: string[];
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isCollected: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userInfo: User;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  isBest: boolean;
  isLiked: boolean;
}

export interface Question {
  id: string;
  userId: string;
  userInfo: User;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  reward: number;
  status: QaStatus;
  createdAt: string;
  views: number;
  answers: number;
  bestAnswerId?: string;
  answersList?: Answer[];
  isCollected: boolean;
}

export interface CaseItem {
  id: string;
  type: CaseType;
  typeName: string;
  userId: string;
  userInfo: User;
  title: string;
  cover: string;
  description: string;
  process: string[];
  notes: string[];
  review: string;
  createdAt: string;
  views: number;
  likes: number;
  isLiked: boolean;
  isCollected: boolean;
  fee?: number;
  duration?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  cover: string;
  description: string;
  hostName: string;
  hostProfession: string;
  startTime: string;
  endTime?: string;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  fee: number;
  tags: string[];
  isRegistered: boolean;
}

export interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  lastContent: string;
  lastTime: string;
  unread: number;
}

export interface WorkItem {
  id: string;
  title: string;
  cover: string;
  description: string;
  images: string[];
  createdAt: string;
  likes: number;
  views: number;
  isLiked: boolean;
}

export interface DraftItem {
  id: string;
  type: 'post' | 'qa' | 'case';
  title: string;
  content: string;
  images: string[];
  tags: string[];
  updatedAt: string;
}

export interface ReportItem {
  id: string;
  targetType: 'user' | 'post' | 'comment';
  targetId: string;
  targetTitle: string;
  reason: string;
  detail: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
}

export interface BlacklistItem {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  profession: string;
  reason: string;
  addedAt: string;
}

export interface CreditRecord {
  id: string;
  type: 'plus' | 'minus';
  amount: number;
  reason: string;
  time: string;
}
