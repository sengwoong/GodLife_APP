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

interface UserStats {
  totalVocas: number;
  totalWords: number;
  totalPoints: number;
  studyStreak: number;
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
      const data = await response.json();
      console.log('👤 사용자 정보 조회 완료');
      return data;
    },
    enabled: userId !== undefined,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 사용자 생성
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
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
      const data = await response.json();
      console.log('✅ 사용자 생성 완료');
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.id], data);
    },
    onError: (error, variables) => {
      console.error('❌ 사용자 생성 실패:', error);
    }
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
      const data = await response.json();
      console.log('✅ 사용자 정보 수정 완료');
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.setQueryData(['user', userId], data);
    },
    onError: (error, variables) => {
      console.error('❌ 사용자 정보 수정 실패:', error);
    }
  });
};

// 사용자 삭제
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('사용자 삭제에 실패했습니다');
      }
      console.log('✅ 사용자 삭제 완료');
    },
    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: ['user', userId] });
    },
    onError: (error, variables) => {
      console.error('❌ 사용자 삭제 실패:', error);
    }
  });
};

// 사용자 통계 정보 조회
export const useUserStats = (userId: number) => {
  return useQuery<UserStats>({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}/stats`);
      if (!response.ok) {
        throw new Error('사용자 통계를 불러올 수 없습니다');
      }
      const data = await response.json();
      console.log('📊 사용자 통계 조회 완료');
      return data;
    },
    enabled: userId !== undefined,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 사용자 프로필 이미지 업로드
export const useUploadUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, imageFile }: { userId: number, imageFile: FormData }) => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}/profile-image`, {
        method: 'POST',
        body: imageFile,
      });
      if (!response.ok) {
        throw new Error('프로필 이미지 업로드에 실패했습니다');
      }
      const data = await response.json();
      console.log('✅ 프로필 이미지 업로드 완료');
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
    onError: (error, variables) => {
      console.error('❌ 프로필 이미지 업로드 실패:', error);
    }
  });
};

// 사용자 비밀번호 변경
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ userId, currentPassword, newPassword }: { 
      userId: number, 
      currentPassword: string, 
      newPassword: string 
    }) => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) {
        throw new Error('비밀번호 변경에 실패했습니다');
      }
      console.log('✅ 비밀번호 변경 완료');
    },
    onError: (error, variables) => {
      console.error('❌ 비밀번호 변경 실패:', error);
    }
  });
};    