export interface Comment {
  commentId: number;
  content: string;
  userName: string;
  createdAt: string;
}

export interface PostItem {
  postItemId: number;
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
  postAdId: number;
  postId: number;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
  userId: number;
}

export interface PostComment {
  postCommentId: number;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
  likes: number;
  userId: number;
}

export interface SharedPost {
  sharedPostId: number;
  postId: number;
  title: string;
  recipient: string;
  recipientId: number;
  thumbnail: string | null;
  createdAt: string;
  userId: number;
}
