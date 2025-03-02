import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

// 타입 정의
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

// Read 작업
// 단어 목록 조회 (무한 스크롤)
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

// 단일 단어 조회
export function useWord(vocaId: number, wordIndex: number) {
  return useQuery<Word, Error>({
    queryKey: ['word', vocaId, wordIndex],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/words/voca/${vocaId}?index=${wordIndex}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      return data.content[0];
    },
    enabled: wordIndex !== undefined,
  });
}

// 단어장의 모든 단어 조회
export function useWords(vocaId: number, page = 0, size = 10, search = '') {
  return useQuery<WordResponse, Error>({
    queryKey: ['words', vocaId, page, size, search],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/words/voca/${vocaId}?page=${page}&size=${size}&search=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      return response.json();
    },
  });
}

// Create 작업
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

// Update 작업
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

// Delete 작업
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


