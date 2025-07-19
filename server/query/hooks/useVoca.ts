import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Voca } from '../../../types/voca';

interface VocaResponse {
  content: Voca[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface CreateVocaData {
  userId: string | number;
  vocaTitle: string;
  languages: string;
}

interface UpdateVocaData {
  vocaId: number;
  userId: string | number;
  data: {
    vocaTitle: string;
    languages: string;
  };
}

// 단일 단어장 조회
export function useVoca(vocaId: number) {
  return useQuery({
    queryKey: ['voca', vocaId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/vocas/voca/${vocaId}`);
      if (!response.ok) {
        throw new Error('단어장을 찾을 수 없습니다');
      }
      return response.json();
    },
    enabled: vocaId !== undefined && vocaId > 0,
  });
}

// 사용자 단어장 목록 조회 (페이지네이션)
export function useUserVocas(userId: string | number, search?: string, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: ['userVocas', userId, search, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'createdAt,desc'
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`${BASE_URL}/vocas/user/${userId}?${params}`);
      if (!response.ok) {
        throw new Error('단어장 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 단어장 생성
export function useCreateVoca() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, vocaTitle, languages }: CreateVocaData) => {
      const response = await fetch(`${BASE_URL}/vocas/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vocaTitle, languages }),
      });
      if (!response.ok) {
        throw new Error('단어장 생성에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userVocas', userId] });
    }
  });
}

// 단어장 수정
export function useUpdateVoca() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vocaId, userId, data }: UpdateVocaData) => {
      const response = await fetch(`${BASE_URL}/vocas/voca/${vocaId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('단어장 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { vocaId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['voca', vocaId] });
      queryClient.invalidateQueries({ queryKey: ['userVocas', userId] });
    }
  });
}

// 단어장 삭제
export function useDeleteVoca() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vocaId, userId }: { vocaId: number, userId: string | number }) => {
      const response = await fetch(`${BASE_URL}/vocas/voca/${vocaId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('단어장 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userVocas', userId] });
    }
  });
} 