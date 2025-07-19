import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

// 타입 정의
export interface Word {
  wordId: number;
  word: string;
  meaning: string;
  voca: {
    vocaId: number;
    vocaTitle: string;
  };
  createdAt: string;
  updatedAt: string;
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

// 단일 단어 조회
export function useWord(wordId: number) {
  return useQuery<Word, Error>({
    queryKey: ['word', wordId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/words/word/${wordId}`);
      if (!response.ok) {
        throw new Error('단어를 찾을 수 없습니다');
      }
      return response.json();
    },
    enabled: wordId !== undefined && wordId > 0,
  });
}

// 단어장별 단어 목록 조회 (페이지네이션)
export function useWordsByVoca(vocaId: number, search?: string, page: number = 0, size: number = 10) {
  return useQuery<WordResponse, Error>({
    queryKey: ['words', vocaId, search, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'createdAt,desc'
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`${BASE_URL}/words/voca/${vocaId}?${params}`);
      if (!response.ok) {
        throw new Error('단어 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: vocaId !== undefined,
  });
}

// 단어장별 단어 목록 조회 (무한 스크롤)
export function useInfiniteWords(vocaId: number, search?: string, size: number = 10) {
  return useInfiniteQuery<WordResponse, Error, WordResponse, (string | number | undefined)[], number>({
    queryKey: ['infiniteWords', vocaId, search],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        size: size.toString(),
        sort: 'createdAt,desc'
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`${BASE_URL}/words/voca/${vocaId}?${params}`);
      if (!response.ok) {
        throw new Error('단어 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
    },
    enabled: vocaId !== undefined,
  });
}

// 단어 생성
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
        throw new Error('단어 생성에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['words', data.vocaId] });
    },
  });
}

// 단어 수정
export function useUpdateWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wordId, userId, data }: UpdateWordData) => {
      const response = await fetch(`${BASE_URL}/words/word/${wordId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('단어 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['word', data.wordId] });
      queryClient.invalidateQueries({ queryKey: ['words', data.voca.vocaId] });
    },
  });
}

// 단어 삭제
export function useDeleteWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wordId, userId }: { wordId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/words/word/${wordId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('단어 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { wordId }) => {
      queryClient.invalidateQueries({ queryKey: ['word', wordId] });
    },
  });
}


