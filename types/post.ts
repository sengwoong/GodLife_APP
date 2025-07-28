export interface Comment {
  id: number;
  content: string;
  userName: string;
  createdAt: string;
}

export interface PostItem {
  id: number;
  title: string;
  content: string;
}

export interface BasePost {
  id: number;
  imageUrl: string;
  userId: number;
  userName: string;
  title: string;
  postImage: string;
  likes: number;
  price: number;
  createdAt: string;
  sale: boolean;
  type: 'music' | 'normal' | 'voca';
  postContent: string;
  comments?: Comment[];
}

export interface MusicPost extends BasePost {
  type: 'music';
  items: PostItem[];
}

export interface VocaPost extends BasePost {
  type: 'voca';
  items: PostItem[];
}

export interface Post extends BasePost {
  type: 'normal';
}

export interface PostAd {
  id: number;
  postId: number;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
  userId: number;
}

export interface PostComment {
  id: number;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
  likes: number;
  userId: number;
  userName: string;
}

export interface SharedPost {
  id: number;
  postId: number;
  title: string;
  recipient: string;
  recipientId: number;
  thumbnail: string | null;
  createdAt: string;
  userId: number;
}

export interface PostLikeResponse {
  postId: number;
  userId: number;
  isLiked: boolean;
  createdAt?: string;
  totalLikes: number;
}
