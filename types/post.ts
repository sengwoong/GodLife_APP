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
