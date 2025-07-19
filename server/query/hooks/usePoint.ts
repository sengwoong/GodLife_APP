import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Point {
  pointId: number;
  title: string;
  content: string;
  points: number;
  type: 'EARN' | 'USE';
  createdAt: string;
  updatedAt: string;
}

interface PointSummary {
  userId: number;
  totalPoints: number;
  earnedPoints: number;
  usedPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface PointResponse {
  content: Point[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface CreatePointData {
  title: string;
  content: string;
  points: number;
  createdAt: string;
}

// 포인트 요약 정보 조회
export function usePointSummary(userId: number) {
  return useQuery<PointSummary>({
    queryKey: ['pointSummary', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/point-summaries/user/${userId}`);
      if (!response.ok) {
        throw new Error('포인트 요약 정보를 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 포인트 요약 정보 생성
export function useCreatePointSummary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`${BASE_URL}/point-summaries/user/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('포인트 요약 정보 생성에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
    },
  });
}

// 사용자 총 포인트 조회
export function useTotalPoints(userId: number) {
  return useQuery<number>({
    queryKey: ['totalPoints', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/points/user/${userId}/total`);
      if (!response.ok) {
        throw new Error('총 포인트를 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 사용자 획득 포인트 목록 조회
export function useEarnedPoints(userId: number, page: number = 0, size: number = 10) {
  return useQuery<PointResponse>({
    queryKey: ['earnedPoints', userId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/points/user/${userId}/earned?${params}`);
      if (!response.ok) {
        throw new Error('획득 포인트 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 사용자 사용 포인트 목록 조회
export function useUsedPoints(userId: number, page: number = 0, size: number = 10) {
  return useQuery<PointResponse>({
    queryKey: ['usedPoints', userId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/points/user/${userId}/used?${params}`);
      if (!response.ok) {
        throw new Error('사용 포인트 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 단일 포인트 조회
export function usePoint(pointId: number) {
  return useQuery<Point>({
    queryKey: ['point', pointId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/points/${pointId}`);
      if (!response.ok) {
        throw new Error('포인트 정보를 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: pointId !== undefined,
  });
}

// 포인트 삭제
export function useDeletePoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pointId: number) => {
      const response = await fetch(`${BASE_URL}/points/${pointId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('포인트 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, pointId) => {
      queryClient.invalidateQueries({ queryKey: ['point', pointId] });
    },
  });
}

// 포인트 획득
export function useEarnPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, pointData }: { userId: number, pointData: CreatePointData }) => {
      const response = await fetch(`${BASE_URL}/points/earn/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointData),
      });
      if (!response.ok) {
        throw new Error('포인트 획득에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
      queryClient.invalidateQueries({ queryKey: ['totalPoints', userId] });
      queryClient.invalidateQueries({ queryKey: ['earnedPoints', userId] });
    },
  });
}

// 포인트 추가
export function useAddPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, pointData }: { userId: number, pointData: CreatePointData }) => {
      const response = await fetch(`${BASE_URL}/points/add/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointData),
      });
      if (!response.ok) {
        throw new Error('포인트 추가에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
      queryClient.invalidateQueries({ queryKey: ['totalPoints', userId] });
      queryClient.invalidateQueries({ queryKey: ['earnedPoints', userId] });
    },
  });
}

