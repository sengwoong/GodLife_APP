import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { ScheduleRequest } from '../../common/types/serverType'

export const scheduleHandlers = [
  // Read 작업
  http.get(`${BASE_URL}/schedules/user/:userId`, async ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month'); 
    const day = url.searchParams.get('day'); 
    
    // 더미 데이터 생성
    const dummySchedules = [
      {
        content: '프로젝트 마감',
        id: 1,
        time: '5:00 PM',
        title: '업무 일정',
        day: '2025-03-03',
      },
      {
        content: '친구 생일',
        id: 2,
        time: 'All Day',
        title: '생일 파티',
        day: '2025-03-20',
      },
      {
        content: '팀 미팅',
        id: 3,
        time: '10:00 AM',
        title: '업무 미팅',
        day: '2025-03-30',
      },
      {
        content: '팀 미팅',
        id: 4,
        time: '10:00 AM',
        title: '업무 미팅',
        day: '2025-03-30',
      },
      {
        content: '팀 미팅',
        id: 5,
        time: '10:00 AM',
        title: '업무 미팅',
        day: '2025-03-30',
      },
      {
        content: '팀 미팅',
        id: 6,
        time: '10:00 AM',
        title: '업무 미팅',
        day: '2025-02-22',
      }
    ];

    return HttpResponse.json({
      content: dummySchedules,
      totalPages: 1,
      totalElements: dummySchedules.length,
      size: 10,
      number: 0
    })
  }),

  // 단일 일정 조회
  http.get(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, ({ params }) => {
    const { scheduleId } = params;
    
    // 더미 단일 일정 데이터
    const schedule = {
      content: '프로젝트 마감',
      id: Number(scheduleId),
      time: '5:00 PM',
      title: '업무 일정',
      day: '2025-03-03',
    };

    return HttpResponse.json(schedule);
  }),

  // Create 작업
  http.post(`${BASE_URL}/schedules/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ScheduleRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: params.userId
    })
  }),

  // Update 작업
  http.put(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ScheduleRequest
    return HttpResponse.json({
      id: params.scheduleId,
      ...body,
      userId: params.userId
    })
  }),

  // Delete 작업
  http.delete(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  })
] 