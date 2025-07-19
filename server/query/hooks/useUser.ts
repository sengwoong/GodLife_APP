import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface UserResponse {
  id: number;
  nickName: string;
  sales: number;
  phoneNumber: string;
  address: string;
  email: string;
  createdAt: string;
}

interface CreateUserData {
  email: string;
  password: string;
  nickName: string;
}

interface UpdateUserData {
  nickName: string;
  phoneNumber: string;
  address: string;
  email: string;
}

// 사용자 정보 조회
export const useUser = (userId: number) => {
  return useQuery<UserResponse>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`);
      if (!response.ok) {
        throw new Error('사용자를 찾을 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
};

// 사용자 생성
export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('사용자 생성에 실패했습니다');
      }
      return response.json();
    },
  });
};

// 사용자 정보 수정
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: number, userData: UpdateUserData }) => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('사용자 정보 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

// 사용자 삭제
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('사용자 삭제에 실패했습니다');
      }
    },
  });
};    