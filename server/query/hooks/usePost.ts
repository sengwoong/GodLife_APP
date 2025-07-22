import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { MusicPost, Post, PostAd, PostComment, SharedPost, VocaPost } from '../../../types/post';
import { BASE_URL } from '../../common/types/constants';

interface PostResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
}

interface BestPostsResponse {
  posts: Post[];
}

interface PostAdResponse {
  content: PostAd[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface PostCommentResponse {
  content: PostComment[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface SharedPostResponse {
  content: SharedPost[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Read
export const usePost = (category: string, search: string = '', page: number = 0) => {
  return useQuery<PostResponse>({
    queryKey: ['posts', category, search, page],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/posts/category/${category}?search=${search}&page=${page}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useInfinitePosts = (searchText: string, category: string = 'post') => {
  return useInfiniteQuery<PostResponse>({
    queryKey: ['posts', searchText, category],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => 
      fetch(`${BASE_URL}/posts/category/${category}?search=${encodeURIComponent(searchText)}&page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage: PostResponse) => {
      if (!lastPage.last) return lastPage.number + 1;
      return undefined;
    },
  });
};

export const useSinglePost = (postId: string) => {
  return useQuery<MusicPost | Post | VocaPost | undefined>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (!['music', 'normal', 'voca'].includes(data.type)) {
        throw new Error('Invalid post type');
      }
      if(data.type === 'music'){
        return data as MusicPost;
      }else if(data.type === 'normal'){
        return data as Post;
      }else if(data.type === 'voca'){
        return data as VocaPost;
      }
      return undefined;
    },
  });
};

export const useUserPosts = ({ userId, page = 0, size = 10}: UserPostsParams) => {
  return useQuery<PostResponse>({
    queryKey: ['userPosts', userId, page, size],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/posts/user/${userId}?page=${page}&size=${size}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useBestPosts = () => {
  return useQuery<BestPostsResponse>({
    queryKey: ['bestPosts'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/best`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useMyPostAds = (userId: number) => {
  return useQuery<PostAdResponse>({
    queryKey: ['myPostAds', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/ads/user/${userId}`);
      if (!response.ok) {
        throw new Error('광고 목록 조회 실패');
      }
      return response.json();
    },
  });
};

export const useMyComments = (userId: number) => {
  return useQuery<PostCommentResponse>({
    queryKey: ['myComments', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/comments/user/${userId}`);
      if (!response.ok) {
        throw new Error('댓글 목록 조회 실패');
      }
      return response.json();
    },
  });
};

export const useSharedPosts = (userId: number) => {
  return useQuery<SharedPostResponse>({
    queryKey: ['sharedPosts', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/shared/user/${userId}`);
      if (!response.ok) {
        throw new Error('공유 포스트 목록 조회 실패');
      }
      return response.json();
    },
  });
};

// Update
export const useTogglePostAd = () => {
  return useMutation({
    mutationFn: async (adId: number) => {
      const response = await fetch(`${BASE_URL}/posts/ads/${adId}/toggle`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('광고 상태 변경 실패');
      }
      return response.json();
    },
  });
};

// Create
export const useLikePost = () => {
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export interface UserPostsParams {
  userId: string | number;
  page?: number;
  size?: number;
  search?: string;
}
