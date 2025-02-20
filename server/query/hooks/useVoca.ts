import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Voca } from '../../../types/voca';

interface VocaResponse {
  content: Voca[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useInfiniteVoca(userId: string | number, searchText: string) {
  return useInfiniteQuery<VocaResponse, Error>({
    queryKey: ['vocas', userId, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/vocas/user/${userId}?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary list');
      }
      return response.json() as Promise<VocaResponse>;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });
}

export function useCreateVoca() {
  return useMutation({
    mutationFn: async ({ userId, vocaTitle, languages }: { userId: string | number, vocaTitle: string, languages: string }) => {
      const response = await fetch(`${BASE_URL}/vocas/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vocaTitle, languages }),
      });
      if (!response.ok) {
        throw new Error('Failed to create new voca');
      }
      return response.json();
    },
  });
}

export function useVoca(vocaId: number) {
  return useQuery({
    queryKey: ['voca', vocaId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/vocas/voca/${vocaId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary');
      }
      return response.json();
    },
  });
}

export function useUpdateVoca() {
  return useMutation({
    mutationFn: async ({ 
      vocaId, 
      userId, 
      data 
    }: { 
      vocaId: number;
      userId: string | number;
      data: { vocaTitle: string; languages: string; }
    }) => {
      const response = await fetch(`${BASE_URL}/vocas/voca/${vocaId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('response', response)
      if (!response.ok) {
        throw new Error('Failed to update voca');
      }
      return response.json();
    },
  });
}

export interface UserVocaParams {
  userId: string | number;
  page?: number;
  size?: number;
  search?: string;
}

export const useUserVocas = ({ userId, page = 0, size = 10 }: UserVocaParams) => {
  return useQuery<VocaResponse>({
    queryKey: ['userVocas', userId, page, size],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/vocas/user/${userId}?page=${page}&size=${size}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}; 