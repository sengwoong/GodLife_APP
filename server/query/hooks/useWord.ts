import { useInfiniteQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Word {
  id: number;
  word: string;
  meaning: string;
  vocaId: number;
}

interface WordResponse {
  content: Word[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useInfiniteWords(vocaId: number, searchText: string) {
  return useInfiniteQuery<WordResponse, Error>({
    queryKey: ['words', vocaId, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/words/voca/${vocaId}?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      return response.json() as Promise<WordResponse>;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });
}
