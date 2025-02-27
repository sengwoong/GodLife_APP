import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { Point, PointRequest } from '../../../types/point'

const generatePointHistory = (userId: string | number) => {
  const earnPoints = [
    { title: '매일 매뉴 이용', content: '매일 매뉴를 이용하여 포인트 획득', points: 150 },
    { title: '서브 매뉴 이용', content: '서브 매뉴를 이용하여 포인트 획득', points: 100 },
    { title: '출석체크', content: '매일 출석체크 보상', points: 50 },
    { title: '게시글 작성', content: '커뮤니티 게시글 작성', points: 100 },
    { title: '댓글 작성', content: '게시글에 댓글 작성', points: 30 },
  ];

  const usePoints = [
    { title: '단어장 구매', content: '프리미엄 단어장 구매', points: -200 },
    { title: '플레이리스트 구매', content: '인기 플레이리스트 구매', points: -150 },
    { title: '음악 구매', content: '개별 음악 구매', points: -100 },
    { title: '프로필 테마 구매', content: '특별 프로필 테마 구매', points: -300 },
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const isEarn = Math.random() > 0.3;
    const template = isEarn 
      ? earnPoints[Math.floor(Math.random() * earnPoints.length)]
      : usePoints[Math.floor(Math.random() * usePoints.length)];

    return {
      id: i + 1,
      userId: Number(userId),
      type: isEarn ? 'earn' as const : 'use' as const,
      ...template,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const pointHandlers = [
  // Create
  // 포인트 적립
  http.post(`${BASE_URL}/points/earn/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PointRequest;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      type: 'earn',
      userId: Number(params.userId),
      createdAt: new Date().toISOString()
    });
  }),

  // 포인트 사용
  http.post(`${BASE_URL}/points/use/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PointRequest;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      type: 'use',
      userId: Number(params.userId),
      createdAt: new Date().toISOString()
    });
  }),

  // Read
  // 포인트 내역 조회
  http.get(`${BASE_URL}/points/user/:userId`, ({ params, request }) => {
    const { userId } = params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type') as 'earn' | 'use' | null;
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    let pointHistory = generatePointHistory(userId as string);
    
    if (type) {
      pointHistory = pointHistory.filter(point => point.type === type);
    }

    const start = page * size;
    const end = start + size;
    const paginatedHistory = pointHistory.slice(start, end);

    return HttpResponse.json({
      content: paginatedHistory,
      totalPages: Math.ceil(pointHistory.length / size),
      totalElements: pointHistory.length,
      size,
      number: page
    });
  }),

  // 포인트 요약 정보 조회
  http.get(`${BASE_URL}/points/summary/user/:userId`, ({ params }) => {
    const pointHistory = generatePointHistory(params.userId as string);
    
    const summary = pointHistory.reduce((acc, curr) => {
      if (curr.type === 'earn') {
        acc.earnedPoints += curr.points;
      } else {
        acc.usedPoints += Math.abs(curr.points);
      }
      return acc;
    }, {
      totalPoints: 0,
      earnedPoints: 0,
      usedPoints: 0,
      userId: Number(params.userId)
    });

    summary.totalPoints = summary.earnedPoints - summary.usedPoints;

    return HttpResponse.json(summary);
  }),
]; 