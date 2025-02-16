import { useInfiniteQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Voca {
  id: number;
  vocaTitle: string;
  description: string;
}

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