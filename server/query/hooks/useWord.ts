import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';


interface WordResponse {
  content: Word[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useInfiniteWords(vocaIndex: number, searchText: string) {
  return useInfiniteQuery<WordResponse, Error>({
    queryKey: ['words', vocaIndex, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/words/voca/${vocaIndex}?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
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

export function useWord(vocaIndex: number, wordIndex: number) {
  return useQuery<Word, Error>({
    queryKey: ['word', vocaIndex, wordIndex],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/words/voca/${vocaIndex}?index=${wordIndex}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      return data.content[0];
    },
    enabled: wordIndex !== undefined,
  });
}
