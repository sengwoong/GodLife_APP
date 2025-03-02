import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';



// UI 표시용 타입
export interface Schedule {
  id: number;
  title: string;
  content: string;
  time: string;
  day: string;
}

interface ScheduleResponse {
  content: Schedule[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Read 작업
export function useSchedules(userId: number, year: number, month: number, day: number) {
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  
  return useQuery<ScheduleResponse>({
    queryKey: ['schedules', userId, yearMonth],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/schedules/user/${userId}?year=${year}&month=${month}&day=${day}`
      );
      if (!response.ok) {
        throw new Error('일정 조회 실패');
      }
      const data = await response.json();
      return data;
    },
  });
}

// 단일 일정 조회
export function useSchedule(scheduleId: number, userId: number) {
  return useQuery<Schedule>({
    queryKey: ['schedule', scheduleId, userId],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/schedules/schedule/${scheduleId}/user/${userId}`
      );
      if (!response.ok) {
        throw new Error('일정 조회 실패');
      }
      return response.json();
    },
  });
}

// 스케줄 생성 시 필요한 데이터 타입
export interface CreateScheduleData {
  scheduleTitle: string;
  content: string;
  startTime: string;
  endTime: string;
}

// Create 작업
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
        throw new Error('일정 생성 실패');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
    },
  });
}

// Update 작업
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
      scheduleData: Partial<Omit<Schedule, 'id' | 'userId'>>;
    }) => {
      const response = await fetch(`${BASE_URL}/schedules/schedule/${scheduleId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) {
        throw new Error('일정 수정 실패');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Delete 작업
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, userId }: { scheduleId: number; userId: number }) => {
      const response = await fetch(`${BASE_URL}/schedules/schedule/${scheduleId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('일정 삭제 실패');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
    },
  });
} 