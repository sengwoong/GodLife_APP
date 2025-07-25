import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { ScheduleRequest } from '../../common/types/serverType'

// 메모리 기반 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let scheduleDatabase: Array<{
  id: number;
  title: string;
  content: string;
  time: string;
  day: string;
  userId: number;
  hasAlarm: boolean;
}> = [
  // 현재 월 기본 데이터
  {
    id: 1,
    title: '오늘의 할일',
    content: '오늘 해야 할 중요한 일들 정리',
    time: '09:00',
    day: new Date().toISOString().split('T')[0], // 오늘 날짜
    userId: 1,
    hasAlarm: false
  },
  {
    id: 2,
    title: '팀 미팅',
    content: '프로젝트 진행상황 공유 및 다음 주 계획 논의',
    time: '10:00',
    day: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 내일
    userId: 1,
    hasAlarm: true
  },
  {
    id: 3,
    title: '고객사 미팅',
    content: '신규 프로젝트 요구사항 논의',
    time: '14:00',
    day: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 모레
    userId: 1,
    hasAlarm: true
  },
  {
    id: 4,
    title: '운동',
    content: '헬스장에서 PT 수업',
    time: '19:00',
    day: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 5,
    title: '영어 공부',
    content: '토익 시험 준비 - 리스닝 연습',
    time: '20:00',
    day: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 6,
    title: '병원 예약',
    content: '정기 건강검진',
    time: '11:00',
    day: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5일 후
    userId: 1,
    hasAlarm: true
  },
  {
    id: 7,
    title: '친구 생일',
    content: '생일 파티 참석',
    time: '18:00',
    day: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 8,
    title: '코드 리뷰',
    content: '신규 기능 코드 리뷰 및 피드백',
    time: '15:00',
    day: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7일 후
    userId: 1,
    hasAlarm: false
  },
  
  // 다음 주 데이터
  {
    id: 9,
    title: '휴가',
    content: '가족과 함께 여행',
    time: '09:00',
    day: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 10,
    title: '회의',
    content: '분기별 실적 보고회',
    time: '13:00',
    day: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 9일 후
    userId: 1,
    hasAlarm: true
  },
  {
    id: 11,
    title: '운동',
    content: '조깅 - 공원에서 30분',
    time: '07:00',
    day: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 12,
    title: '독서',
    content: '새로 구매한 책 읽기',
    time: '21:00',
    day: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 11일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 13,
    title: '쇼핑',
    content: '생활용품 구매',
    time: '16:00',
    day: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 14,
    title: '영화 감상',
    content: '새로 개봉한 영화 보기',
    time: '20:00',
    day: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 13일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 15,
    title: '청소',
    content: '주말 대청소',
    time: '10:00',
    day: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14일 후
    userId: 1,
    hasAlarm: false
  },
  {
    id: 16,
    title: '요리',
    content: '새로운 레시피 시도',
    time: '18:00',
    day: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15일 후
    userId: 1,
    hasAlarm: false
  }
];

export const scheduleHandlers = [
  // 스케줄 조회 (월 단위 또는 일 단위)
  http.get(`${BASE_URL}/schedules/user/:userId`, async ({ request, params }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month'); 
    const day = url.searchParams.get('day'); 
    const userId = Number(params.userId);
    
    console.log('Fetching schedules with params:', { year, month, day, userId });
    console.log('Total schedules in database:', scheduleDatabase.length);
    
    // 해당 사용자의 스케줄만 필터링
    const userSchedules = scheduleDatabase.filter(schedule => schedule.userId === userId);
    console.log('User schedules:', userSchedules.length);
    
    let filteredSchedules = userSchedules;
    
    if (year && month && day) {
      // 일 단위 조회 (특정 날짜의 스케줄만)
      const targetDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      filteredSchedules = userSchedules.filter(schedule => schedule.day === targetDate);
      console.log('Day filter - targetDate:', targetDate, 'found:', filteredSchedules.length);
    } else if (year && month) {
      // 월 단위 조회 (해당 월의 모든 스케줄)
      const targetYearMonth = `${year}-${String(month).padStart(2, '0')}`;
      filteredSchedules = userSchedules.filter(schedule => schedule.day.startsWith(targetYearMonth));
      console.log('Month filter - targetYearMonth:', targetYearMonth, 'found:', filteredSchedules.length);
    }

    console.log('Returning schedules:', filteredSchedules);
    
    return HttpResponse.json({
      content: filteredSchedules,
      totalPages: 1,
      totalElements: filteredSchedules.length,
      size: 10,
      number: 0
    })
  }),

  // 단일 일정 조회
  http.get(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, ({ params }) => {
    const { scheduleId, userId } = params;
    const scheduleIdNum = Number(scheduleId);
    const userIdNum = Number(userId);
    
    // 데이터베이스에서 해당 스케줄 찾기
    const schedule = scheduleDatabase.find(s => s.id === scheduleIdNum && s.userId === userIdNum);

    if (!schedule) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(schedule);
  }),

  // Create 작업
  http.post(`${BASE_URL}/schedules/user/:userId`, async ({ params, request }) => {
    try {
      const body = await request.json() as ScheduleRequest
      const userId = Number(params.userId);
      // 유저아이티 체크
      if (!userId) {
        return new HttpResponse(null, { status: 400 });
      }
      console.log('Creating schedule with body:', body);
      
      // 필수 필드 검증
      if (!body.scheduleTitle || !body.scheduleTitle.trim()) {
        console.error('Schedule title is required');
        return new HttpResponse(null, { status: 400 });
      }
      
      // 스프링 LocalDate 형식으로 저장 (YYYY-MM-DD)
      const day = body.day || new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      const newSchedule = {
        id: Date.now(),
        title: body.scheduleTitle,
        content: body.content || '',
        time: body.startTime || '00:00',
        day: day || new Date().toISOString().split('T')[0],
        userId: userId,
        hasAlarm: body.hasAlarm || false
      };
      
      console.log('New schedule to be added:', newSchedule);
      
      // 데이터베이스에 추가
      scheduleDatabase.push(newSchedule);
      
      console.log('Schedule added to database. Total schedules:', scheduleDatabase.length);
      
      return HttpResponse.json(newSchedule)
    } catch (error) {
      console.error('Error in schedule creation:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  // Update 작업
  http.put(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ScheduleRequest
    const scheduleId = Number(params.scheduleId);
    const userId = Number(params.userId);
    
    // 데이터베이스에서 해당 스케줄 찾기
    const scheduleIndex = scheduleDatabase.findIndex(s => s.id === scheduleId && s.userId === userId);
    
    if (scheduleIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // 스케줄 업데이트
    scheduleDatabase[scheduleIndex] = {
      ...scheduleDatabase[scheduleIndex],
      title: body.scheduleTitle,
      content: body.content,
      time: body.startTime,
      day: body.day,
      hasAlarm: body.hasAlarm,
    };
    
    return HttpResponse.json(scheduleDatabase[scheduleIndex])
  }),

  // Delete 작업
  http.delete(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, ({ params }) => {
    const scheduleId = Number(params.scheduleId);
    const userId = Number(params.userId);
    
    // 데이터베이스에서 해당 스케줄 찾기
    const scheduleIndex = scheduleDatabase.findIndex(s => s.id === scheduleId && s.userId === userId);
    
    if (scheduleIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // 스케줄 삭제
    scheduleDatabase.splice(scheduleIndex, 1);
    
    return new HttpResponse(null, { status: 200 })
  })
] 