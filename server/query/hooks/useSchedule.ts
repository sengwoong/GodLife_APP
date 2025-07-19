import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Schedule {
  scheduleId: number;
  scheduleTitle: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleResponse {
  content: Schedule[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface CreateScheduleData {
  scheduleTitle: string;
  startTime: string;
  endTime: string;
}

interface UpdateScheduleData {
  scheduleTitle: string;
  startTime: string;
  endTime: string;
}

// 사용자 일정 목록 조회 (페이지네이션)
export function useUserSchedules(userId: number, page: number = 0, size: number = 10) {
  return useQuery<ScheduleResponse>({
    queryKey: ['userSchedules', userId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await fetch(`${BASE_URL}/schedules/user/${userId}?${params}`);
      if (!response.ok) {
        throw new Error('일정 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 일정 생성
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, scheduleData }: { 
      userId: number, 
      scheduleData: CreateScheduleData 
    }) => {
      const response = await fetch(`${BASE_URL}/schedules/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) {
        throw new Error('일정 생성에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userSchedules', userId] });
    },
  });
}

// 일정 수정
export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      scheduleId, 
      userId, 
      scheduleData 
    }: {
      scheduleId: number;
      userId: number;
      scheduleData: UpdateScheduleData;
    }) => {
      const response = await fetch(`${BASE_URL}/schedules/schedule/${scheduleId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) {
        throw new Error('일정 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userSchedules', userId] });
    },
  });
}

// 일정 삭제
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, userId }: { scheduleId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/schedules/schedule/${scheduleId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('일정 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userSchedules', userId] });
    },
  });
} 