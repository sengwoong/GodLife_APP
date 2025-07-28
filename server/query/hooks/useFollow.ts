import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FollowResponse, UserResponse } from '../../../types/user';
import { BASE_URL } from '../../common/types/constants';

// 팔로우 토글
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  
  return useMutation<FollowResponse, Error, { followerId: number, followingId: number }>({
    mutationFn: async ({ followerId, followingId }) => {
      const response = await fetch(`${BASE_URL}/users/${followerId}/follow/${followingId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('팔로우 실패');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user', data.followerId] });
      queryClient.invalidateQueries({ queryKey: ['user', data.followingId] });
      queryClient.invalidateQueries({ queryKey: ['followStatus', data.followerId, data.followingId] });
      queryClient.invalidateQueries({ queryKey: ['followers', data.followingId] });
      queryClient.invalidateQueries({ queryKey: ['following', data.followerId] });
    },
  });
};

// 팔로우 상태 확인
export const useFollowStatus = (followerId: number, followingId: number) => {
  return useQuery<{ followerId: number; followingId: number; isFollowing: boolean }>({
    queryKey: ['followStatus', followerId, followingId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/${followerId}/follow/${followingId}`);
      if (!response.ok) {
        throw new Error('팔로우 상태 확인 실패');
      }
      return response.json();
    },
    enabled: !!followerId && !!followingId,
  });
};

// 팔로워 목록 조회
export const useFollowers = (userId: number, page: number = 0, size: number = 10) => {
  return useQuery<{ content: UserResponse[]; totalPages: number; totalElements: number }>({
    queryKey: ['followers', userId, page, size],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/${userId}/followers?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('팔로워 목록 조회 실패');
      }
      return response.json();
    },
    enabled: !!userId,
  });
};

// 팔로잉 목록 조회
export const useFollowing = (userId: number, page: number = 0, size: number = 10) => {
  return useQuery<{ content: UserResponse[]; totalPages: number; totalElements: number }>({
    queryKey: ['following', userId, page, size],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/${userId}/following?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('팔로잉 목록 조회 실패');
      }
      return response.json();
    },
    enabled: !!userId,
  });
}; 