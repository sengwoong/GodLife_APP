import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
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

// ==================== Post 관련 훅 ====================

// 카테고리별 공유된 포스트 조회
export const usePost = (category: string, search: string = '', page: number = 0) => {
  return useQuery<PostResponse>({
    queryKey: ['posts', category, search, page],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/posts/category/${category}?search=${search}&page=${page}`
      );
      if (!response.ok) {
        throw new Error('공유된 포스트 조회 실패');
      }
      return response.json();
    },
  });
};

// 무한 스크롤 공유된 포스트 조회
export const useInfinitePosts = (searchText: string, category: string = 'POST') => {
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

// 공유된 포스트 조회 (아무나 볼 수 있음)
export const useSharedPost = (postId: string) => {
  return useQuery<MusicPost | Post | VocaPost | undefined>({
    queryKey: ['sharedPost', postId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/shared/${postId}`);
      if (!response.ok) {
        throw new Error('공유된 포스트 조회 실패');
      }
      const data = await response.json();
      
      if (!['MUSIC', 'POST', 'VOCA'].includes(data.type)) {
        throw new Error('Invalid post type');
      }
      if(data.type === 'MUSIC'){
        return data as MusicPost;
      }else if(data.type === 'POST'){
        return data as Post;
      }else if(data.type === 'VOCA'){
        return data as VocaPost;
      }
      return undefined;
    },
  });
};

// 나의 포스트 조회 (나만 볼 수 있음)
export const useMyPost = (postId: string, userId: number) => {
  return useQuery<MusicPost | Post | VocaPost | undefined>({
    queryKey: ['myPost', postId, userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/my/${postId}/user/${userId}`);
      if (!response.ok) {
        throw new Error('내 포스트 조회 실패');
      }
      const data = await response.json();
      
      if (!['MUSIC', 'POST', 'VOCA'].includes(data.type)) {
        throw new Error('Invalid post type');
      }
      if(data.type === 'MUSIC'){
        return data as MusicPost;
      }else if(data.type === 'POST'){
        return data as Post;
      }else if(data.type === 'VOCA'){
        return data as VocaPost;
      }
      return undefined;
    },
    enabled: !!postId && !!userId,
  });
};

// 사용자별 포스트 조회
export const useUserPosts = ({ userId, page = 0, size = 10, category}: UserPostsParams) => {
  return useQuery<PostResponse>({
    queryKey: ['userPosts', userId, page, size, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      
      if (category) {
        params.append('category', category);
      }
      
      const response = await fetch(
        `${BASE_URL}/posts/user/${userId}?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error('사용자 포스트 조회 실패');
      }
      return response.json();
    },
  });
};

// 인기 공유된 포스트 조회
export const useBestPosts = () => {
  return useQuery<BestPostsResponse>({
    queryKey: ['bestPosts'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/best`);
      if (!response.ok) {
        throw new Error('인기 공유된 포스트 조회 실패');
      }
      return response.json();
    },
  });
};

// 나의 공유된 광고 포스트 조회
export const useUserPostAds = (userId: number) => {
  return useQuery<PostAdResponse>({
    queryKey: ['myPostAds', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/ads/user/${userId}`);
      if (!response.ok) {
        throw new Error('나의 공유된 광고 목록 조회 실패');
      }
      return response.json();
    },
  });
};

// 나의 공유된 포스트 조회
export const useSharedPosts = (userId: number) => {
  return useQuery<SharedPostResponse>({
    queryKey: ['sharedPosts', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/shared/user/${userId}`);
      if (!response.ok) {
        throw new Error('나의 공유된 포스트 목록 조회 실패');
      }
      return response.json();
    },
  });
};

// 포스트 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, postData }: { userId: number; postData: any }) => {
      const response = await fetch(`${BASE_URL}/posts/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('포스트 생성 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
      queryClient.invalidateQueries({ queryKey: ['sharedPost', data.id] });
      queryClient.invalidateQueries({ queryKey: ['myPost', data.id, userId] });
    },
  });
};

// 포스트 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId, postData }: { postId: number; userId: number; postData: any }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('포스트 수정 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
      queryClient.invalidateQueries({ queryKey: ['sharedPost', data.id] });
      queryClient.invalidateQueries({ queryKey: ['myPost', data.id, userId] });
    },
  });
};

// 포스트 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('포스트 삭제 실패');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
      queryClient.invalidateQueries({ queryKey: ['sharedPost'] });
      queryClient.invalidateQueries({ queryKey: ['myPost'] });
    },
  });
};

// 광고 상태 토글
export const useTogglePostAd = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ adId, userId }: { adId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/ads/${adId}/toggle?user_id=${userId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('광고 상태 변경 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['myPostAds', userId] });
    },
  });
};

// 포스트 좋아요
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like/user/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('좋아요 실패');
      }
      return response.json();
    },
    onSuccess: (data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['sharedPost', postId] });
      queryClient.invalidateQueries({ queryKey: ['myPost'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['likeStatus', postId] });
    },
  });
};

// 좋아요 상태 확인
export const useLikeStatus = (postId: number, userId: number) => {
  return useQuery<{ postId: number; userId: number; isLiked: boolean }>({
    queryKey: ['likeStatus', postId, userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like/user/${userId}`);
      if (!response.ok) {
        throw new Error('좋아요 상태 확인 실패');
      }
      return response.json();
    },
    enabled: !!postId && !!userId,
  });
};

// ==================== Comment 관련 훅 ====================

// 댓글 조회 (포스트별)
export const useCommentsByPost = (postId: number, page: number = 0, size: number = 10) => {
  return useQuery<PostCommentResponse>({
    queryKey: ['comments', postId, page, size],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/comments/post/${postId}?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('댓글 조회 실패');
      }
      return response.json();
    },
  });
};

// 댓글 조회 (사용자별)
export const useMyComments = (userId: number) => {
  return useQuery<PostCommentResponse>({
    queryKey: ['myComments', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/comments/user/${userId}`);
      if (!response.ok) {
        throw new Error('댓글 목록 조회 실패');
      }
      return response.json();
    },
  });
};

// 댓글 개수 조회
export const useCommentCount = (postId: number) => {
  return useQuery<number>({
    queryKey: ['commentCount', postId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/comments/post/${postId}/count`);
      if (!response.ok) {
        throw new Error('댓글 개수 조회 실패');
      }
      return response.json();
    },
  });
};

// 댓글 생성
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, commentData }: { userId: number; commentData: any }) => {
      const response = await fetch(`${BASE_URL}/comments/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error('댓글 생성 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
      queryClient.invalidateQueries({ queryKey: ['commentCount'] });
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, userId, commentData }: { commentId: number; userId: number; commentData: any }) => {
      const response = await fetch(`${BASE_URL}/comments/${commentId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error('댓글 수정 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, userId }: { commentId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/comments/${commentId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('댓글 삭제 실패');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
      queryClient.invalidateQueries({ queryKey: ['commentCount'] });
    },
  });
};

export interface UserPostsParams {
  userId: string | number;
  page?: number;
  size?: number;
  search?: string;
  category?: string;
}
