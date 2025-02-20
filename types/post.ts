export interface Post {
  id: number;
  userId: number;
  userName: string;
  profileImage: string;
  postContent: string;
  postImage: string;
  likes: number;
  comments: comment[];
  shop: boolean;
  music: boolean;
  category: 'post' | 'shop' | 'music' | 'like';
  createdAt: string;
}

export interface comment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  comment: string;
}


export interface PostResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
} 