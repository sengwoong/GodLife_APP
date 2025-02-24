import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Point, PointSummary } from '../../../types/point';

interface PointHistoryResponse {
  content: Point[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 포인트 내역 무한 스크롤 조회
export function useInfinitePointHistory(userId: number, type?: 'earn' | 'use') {
  return useInfiniteQuery<PointHistoryResponse>({
    queryKey: ['points', userId, type],
    queryFn: async ({ pageParam = 0 }) => {
      const typeQuery = type ? `&type=${type}` : '';
      const response = await fetch(
        `${BASE_URL}/points/user/${userId}?page=${pageParam}${typeQuery}`
      );
      if (!response.ok) {
        throw new Error('포인트 내역 조회 실패');
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });
}

// 포인트 요약 정보 조회
export function usePointSummary(userId: number) {
  return useQuery<PointSummary>({
    queryKey: ['pointSummary', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/points/summary/user/${userId}`);
      if (!response.ok) {
        throw new Error('포인트 요약 정보 조회 실패');
      }
      return response.json();
    },
  });
}

