import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Point, PointSummary, Receipt } from '../../../types/point';

interface PointHistoryResponse {
  content: Point[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface ReceiptResponse {
  content: Receipt[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// ==================== Point 관련 훅 ====================

// 포인트 내역 무한 스크롤 조회
export function useInfinitePointHistory(userId: number, type?: 'EARN' | 'USE') {
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

// 포인트 개별 조회
export function usePointById(pointId: number) {
  return useQuery<Point>({
    queryKey: ['point', pointId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/points/${pointId}`);
      if (!response.ok) {
        throw new Error('포인트 조회 실패');
      }
      return response.json();
    },
  });
}

// 포인트 생성
export function useCreatePoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, pointData }: { userId: number; pointData: any }) => {
      const response = await fetch(`${BASE_URL}/points/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointData),
      });
      if (!response.ok) {
        throw new Error('포인트 생성 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['points', userId] });
      queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
    },
  });
}

// 포인트 수정
export function useUpdatePoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pointId, userId, pointData }: { pointId: number; userId: number; pointData: any }) => {
      const response = await fetch(`${BASE_URL}/points/${pointId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointData),
      });
      if (!response.ok) {
        throw new Error('포인트 수정 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['points', userId] });
      queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
    },
  });
}

// 포인트 삭제
export function useDeletePoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pointId, userId }: { pointId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/points/${pointId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('포인트 삭제 실패');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['points', userId] });
      queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
    },
  });
}

// ==================== Receipt 관련 훅 ====================

// 영수증 내역 무한 스크롤 조회
export function useInfiniteReceiptHistory(userId: number, status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED') {
  return useInfiniteQuery<ReceiptResponse>({
    queryKey: ['receipts', userId, status],
    queryFn: async ({ pageParam = 0 }) => {
      const statusQuery = status ? `&status=${status}` : '';
      const response = await fetch(
        `${BASE_URL}/points/receipts/user/${userId}?page=${pageParam}${statusQuery}`
      );
      if (!response.ok) {
        throw new Error('영수증 내역 조회 실패');
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

// 영수증 개별 조회
export function useReceiptById(receiptId: number) {
  return useQuery<Receipt>({
    queryKey: ['receipt', receiptId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/points/receipts/${receiptId}`);
      if (!response.ok) {
        throw new Error('영수증 조회 실패');
      }
      return response.json();
    },
  });
}

// 거래 ID로 영수증 조회
export function useReceiptByTransactionId(transactionId: string) {
  return useQuery<Receipt>({
    queryKey: ['receipt', 'transaction', transactionId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/points/receipts/transaction/${transactionId}`);
      if (!response.ok) {
        throw new Error('영수증 조회 실패');
      }
      return response.json();
    },
  });
}

// 영수증 생성
export function useCreateReceipt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, receiptData }: { userId: number; receiptData: any }) => {
      const response = await fetch(`${BASE_URL}/points/receipts/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      });
      if (!response.ok) {
        throw new Error('영수증 생성 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['receipts', userId] });
    },
  });
}

// 영수증 수정
export function useUpdateReceipt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ receiptId, userId, receiptData }: { receiptId: number; userId: number; receiptData: any }) => {
      const response = await fetch(`${BASE_URL}/points/receipts/${receiptId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      });
      if (!response.ok) {
        throw new Error('영수증 수정 실패');
      }
      return response.json();
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['receipts', userId] });
    },
  });
}

// 영수증 삭제
export function useDeleteReceipt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ receiptId, userId }: { receiptId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/points/receipts/${receiptId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('영수증 삭제 실패');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['receipts', userId] });
    },
  });
}

// 영수증 통계 조회
export function useReceiptStats(userId: number) {
  return useQuery({
    queryKey: ['receiptStats', userId],
    queryFn: async () => {
      const [totalAmountResponse, countResponse] = await Promise.all([
        fetch(`${BASE_URL}/points/receipts/total-amount/user/${userId}`),
        fetch(`${BASE_URL}/points/receipts/count/user/${userId}`)
      ]);
      
      if (!totalAmountResponse.ok || !countResponse.ok) {
        throw new Error('영수증 통계 조회 실패');
      }
      
      const [totalAmount, count] = await Promise.all([
        totalAmountResponse.json(),
        countResponse.json()
      ]);
      
      return { totalAmount, count };
    },
  });
}

