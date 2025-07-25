import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { ScheduleRequest } from '../../common/types/serverType';
import { Schedule } from '../../../types';




interface ScheduleResponse {
  content: Schedule[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 월 단위 스케줄 조회 (캘린더 표시용)
export function useSchedules(userId: number, year: number, month: number) {
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  
  return useQuery<ScheduleResponse>({
    queryKey: ['schedules', userId, yearMonth],
    queryFn: async () => {
      // 유저아이티 체크
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
      const response = await fetch(
        `${BASE_URL}/schedules/user/${userId}?year=${year}&month=${month}`
      );
      if (!response.ok) {
        throw new Error('일정 조회 실패');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 대기
  });
}

// 특정 날짜 스케줄 조회 (상세 보기용)
export function useSchedulesByDay(userId: number, year: number, month: number, day: number) {
  const yearMonthDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  return useQuery<ScheduleResponse>({
    queryKey: ['schedules', userId, yearMonthDay],
    queryFn: async () => {
      // 유저아이티 체크
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
      const response = await fetch(
        `${BASE_URL}/schedules/user/${userId}?year=${year}&month=${month}&day=${day}`
      );
      if (!response.ok) {
        throw new Error('일정 조회 실패');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 대기
  });
}

// 단일 일정 조회
export function useSchedule(scheduleId: number, userId: number) {
  return useQuery<Schedule>({
    queryKey: ['schedule', scheduleId, userId],
    queryFn: async () => {
      // 유저아이티 체크
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
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
  day: string;
  hasAlarm: boolean;
}

// Create 작업
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, scheduleData }: { 
      userId: number, 
      scheduleData: CreateScheduleData 
    }) => {
      // 유저아이티 체크
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
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
      // 모든 schedules 쿼리를 무효화 (월 단위, 일 단위 모두)
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
      scheduleData: ScheduleRequest;
    }) => {
      // 유저아이티 체크
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
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
      // 유저아이티 체크
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
      // 자신의 일정만 삭제 가능
      const schedule = await useSchedule(scheduleId, userId);
      if (!schedule) {
        throw new Error('일정 조회 실패');
      }
      if (schedule.data?.userId !== userId) {
        throw new Error('자신의 일정만 삭제 가능');
      }
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