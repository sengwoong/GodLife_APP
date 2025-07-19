import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Post {
  postId: number;
  title: string;
  postContent: string;
  postImage: string;
  imageUrl: string;
  likeCount: number;
  price: number;
  sale: boolean;
  type: 'MUSIC' | 'NORMAL' | 'VOCA';
  rating: number;
  advertisement: boolean;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface BestPostsResponse {
  posts: Post[];
}

interface BestUserResponse {
  users: {
    id: number;
    nickName: string;
    sales: number;
    phoneNumber: string;
    address: string;
    email: string;
    createdAt: string;
  }[];
}

interface CreatePostData {
  title: string;
  postContent?: string;
  postImage?: string;
  imageUrl?: string;
  price?: number;
  sale?: boolean;
  type: 'MUSIC' | 'NORMAL' | 'VOCA';
  musicIds?: number[];
  vocaIds?: number[];
  advertisement?: boolean;
  shared?: boolean;
}

interface UpdatePostData {
  title: string;
  postContent?: string;
  postImage?: string;
  imageUrl?: string;
  price?: number;
  sale?: boolean;
  type: 'MUSIC' | 'NORMAL' | 'VOCA';
  musicIds?: number[];
  vocaIds?: number[];
  advertisement?: boolean;
  shared?: boolean;
}

// 단일 게시글 조회
export const usePost = (postId: number) => {
  return useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/${postId}`);
      if (!response.ok) {
        throw new Error('게시글을 찾을 수 없습니다');
      }
      return response.json();
    },
    enabled: postId !== undefined,
  });
};

// 사용자 게시글 목록 조회
export const useUserPosts = (userId: number, page: number = 0, size: number = 10) => {
  return useQuery<PostResponse>({
    queryKey: ['userPosts', userId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/posts/user/${userId}?${params}`);
      if (!response.ok) {
        throw new Error('사용자 게시글 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
};

// 타입별 게시글 목록 조회
export const usePostsByType = (type: 'MUSIC' | 'NORMAL' | 'VOCA', page: number = 0, size: number = 10) => {
  return useQuery<PostResponse>({
    queryKey: ['postsByType', type, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/posts/type/${type}?${params}`);
      if (!response.ok) {
        throw new Error('게시글 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
  });
};

// 공유된 게시글 목록 조회
export const useSharedPosts = (page: number = 0, size: number = 10) => {
  return useQuery<PostResponse>({
    queryKey: ['sharedPosts', page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/posts/shared?${params}`);
      if (!response.ok) {
        throw new Error('공유 게시글 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
  });
};

// 광고 게시글 목록 조회
export const useAdvertisementPosts = (page: number = 0, size: number = 10) => {
  return useQuery<PostResponse>({
    queryKey: ['advertisementPosts', page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/posts/advertisements?${params}`);
      if (!response.ok) {
        throw new Error('광고 게시글 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
  });
};

// 베스트 게시글 목록 조회
export const useBestPosts = () => {
  return useQuery<BestPostsResponse>({
    queryKey: ['bestPosts'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/best`);
      if (!response.ok) {
        throw new Error('베스트 게시글 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
  });
};

// 베스트 사용자 목록 조회
export const useBestUsers = () => {
  return useQuery<BestUserResponse>({
    queryKey: ['bestUsers'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/best`);
      if (!response.ok) {
        throw new Error('베스트 사용자 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
  });
};

// 게시글 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, postData }: { userId: number, postData: CreatePostData }) => {
      const response = await fetch(`${BASE_URL}/posts/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('게시글 생성에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
    },
  });
};

// 게시글 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId, postData }: { postId: number, userId: number, postData: UpdatePostData }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('게시글 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { postId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
    },
  });
};

// 게시글 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('게시글 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
    },
  });
};

// 게시글 공유 토글
export const useTogglePostShare = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/share?user_id=${userId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('게시글 공유 상태 변경에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { postId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
      queryClient.invalidateQueries({ queryKey: ['sharedPosts'] });
    },
  });
};

// 게시글 좋아요 추가
export const useAddPostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/likes?user_id=${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('좋아요 추가에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};

// 게시글 좋아요 삭제
export const useRemovePostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/likes?user_id=${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('좋아요 삭제에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};

// 게시글 좋아요 상태 확인
export const usePostLikeStatus = (postId: number, userId: number) => {
  return useQuery<boolean>({
    queryKey: ['postLikeStatus', postId, userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/likes/check?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('좋아요 상태를 확인할 수 없습니다');
      }
      return response.json();
    },
    enabled: postId !== undefined && userId !== undefined,
  });
};
