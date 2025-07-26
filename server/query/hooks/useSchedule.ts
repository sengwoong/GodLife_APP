import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { ScheduleRequest } from '../../common/types/serverType';
import { Schedule, CreateScheduleData } from '../../../types';

interface ScheduleResponse {
  content: Schedule[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, scheduleData }: { 
      userId: number, 
      scheduleData: CreateScheduleData 
    }) => {
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
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
    },
  });
}

export function useSchedules(userId: number, year: number, month: number) {
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  
  return useQuery<ScheduleResponse>({
    queryKey: ['schedules', userId, yearMonth],
    queryFn: async () => {
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSchedulesByDay(userId: number, year: number, month: number, day: number) {
  const yearMonthDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  return useQuery<ScheduleResponse>({
    queryKey: ['schedules', userId, yearMonthDay],
    queryFn: async () => {
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
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useSchedule(scheduleId: number, userId: number) {
  return useQuery<Schedule>({
    queryKey: ['schedule', scheduleId, userId],
    queryFn: async () => {
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

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, userId }: { scheduleId: number; userId: number }) => {
      if (!userId) {
        throw new Error('유저아이티 체크 실패');
      }
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