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
export async function fetchVoca(vocaId: number) {
  const response = await fetch(`${BASE_URL}/vocas/voca/${vocaId}`);
  if (!response.ok) {
    throw new Error('단어장을 찾을 수 없습니다');
  }
  return response.json();
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
      const data = await response.json();
      console.log('📚 단어장 목록 조회:', data.content?.length, '개');
      return data;
    },
    enabled: userId !== undefined,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
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
    onSuccess: async (_, { userId }) => {
      console.log('✅ 단어장 생성 완료');
      try {
        await queryClient.invalidateQueries({
          queryKey: ['userVocas', userId],
          exact: false,
        });
      } catch (error) {
        console.error('❌ 단어장 생성 후 쿼리 무효화 실패:', error);
      }
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
    onSuccess: async (data, { vocaId, userId }) => {
      console.log('✅ 단어장 수정 완료:', vocaId);
      try {
        await queryClient.invalidateQueries({
          queryKey: ['userVocas'],
          exact: false,
        });
      } catch (error) {
        console.error('❌ 단어장 수정 후 쿼리 무효화 실패:', error);
      }
    },
    onError: (error, variables) => {
      console.error('❌ 단어장 수정 실패:', error);
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
    onSuccess: async (_, { userId }) => {
      console.log('✅ 단어장 삭제 완료');
      try {
        await queryClient.invalidateQueries({
          queryKey: ['userVocas'],
          exact: false,
        });
      } catch (error) {
        console.error('❌ 단어장 삭제 후 쿼리 무효화 실패:', error);
      }
    },
    onError: (error, variables) => {
      console.error('❌ 단어장 삭제 실패:', error);
    }
  });
}

// 단어장 검색 (기존 useUserVocas와 유사하지만 검색 전용)
export function useSearchVocas(userId: string | number, search: string, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: ['searchVocas', userId, search, page, size],
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
        throw new Error('단어장 검색에 실패했습니다');
      }
      const data = await response.json();
      console.log('🔍 단어장 검색 결과:', data.content?.length, '개');
      return data;
    },
    enabled: userId !== undefined && search !== undefined,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

// 단어장 통계 정보 조회
export function useVocaStats(userId: string | number) {
  return useQuery({
    queryKey: ['vocaStats', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/vocas/user/${userId}/stats`);
      if (!response.ok) {
        throw new Error('단어장 통계를 불러올 수 없습니다');
      }
      const data = await response.json();
      console.log('📊 단어장 통계 조회 완료');
      return data;
    },
    enabled: userId !== undefined,
    staleTime: 5 * 60 * 1000, // 5분
  });
}