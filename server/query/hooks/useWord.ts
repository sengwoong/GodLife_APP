import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

export interface Word {
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

interface CreateWordData {
  word: string;
  meaning: string;
  vocaId: number;
}

interface UpdateWordData {
  wordId: number;
  userId: number;
  data: {
    word: string;
    meaning: string;
  };
}

export function useCreateWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateWordData) => {
      const response = await fetch(`${BASE_URL}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create word');
      }
      return response.json();
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['words', data.vocaId] });
    },
  });
}

export function useInfiniteWords(vocaId: number, userId: number, searchText: string) {
  return useInfiniteQuery<WordResponse, Error>({
    queryKey: ['words', vocaId, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/words/voca/${vocaId}/user/${userId}?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
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

export function useWord(vocaId: number, wordIndex: number) {
  return useQuery<Word, Error>({
    queryKey: ['word', vocaId, wordIndex],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/words/word/${wordIndex}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      return data.content[0];
    },
    enabled: wordIndex !== undefined,
  });
}

export function useWords(vocaId: number, userId: number, page = 0, size = 10, search = '') {
  return useQuery<WordResponse, Error>({
    queryKey: ['words', vocaId, page, size, search],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/words/voca/${vocaId}/user/${userId}?page=${page}&size=${size}&search=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      return response.json();
    },
  });
}

export function useUpdateWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wordId, data, userId }: UpdateWordData) => {
      const response = await fetch(`${BASE_URL}/words/word/${wordId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update word');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['words', data.vocaId] });
      queryClient.invalidateQueries({ queryKey: ['word', data.vocaId] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wordId, userId, vocaId }: { wordId: number; userId: number; vocaId: number }) => {
      const response = await fetch(`${BASE_URL}/words/word/${wordId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete word');
      }
    },
    onSuccess: (_, { vocaId }) => {
      queryClient.invalidateQueries({ queryKey: ['words', vocaId] });
    },
  });
}


