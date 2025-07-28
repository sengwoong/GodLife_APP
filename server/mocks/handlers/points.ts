import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { Point, PointRequest, Receipt, ReceiptRequest } from '../../../types/point'

const generatePointHistory = (userId: string | number) => {
  const earnPoints = [
    { title: '매일 매뉴 이용', content: '매일 매뉴를 이용하여 포인트 획득', points: 150 },
    { title: '서브 매뉴 이용', content: '서브 매뉴를 이용하여 포인트 획득', points: 100 },
    { title: '출석체크', content: '매일 출석체크 보상', points: 50 },
    { title: '게시글 작성', content: '커뮤니티 게시글 작성', points: 100 },
    { title: '댓글 작성', content: '게시글에 댓글 작성', points: 30 },
  ];

  const usePoints = [
    { title: '단어장 구매', content: '프리미엄 단어장 구매', points: 200 },
    { title: '플레이리스트 구매', content: '인기 플레이리스트 구매', points: 150 },
    { title: '음악 구매', content: '개별 음악 구매', points: 100 },
    { title: '프로필 테마 구매', content: '특별 프로필 테마 구매', points: 300 },
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const isEarn = Math.random() > 0.3;
    const template = isEarn 
      ? earnPoints[Math.floor(Math.random() * earnPoints.length)]
      : usePoints[Math.floor(Math.random() * usePoints.length)];

    return {
      id: i + 1,
      userId: Number(userId),
      type: isEarn ? 'EARN' as const : 'USE' as const,
      ...template,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const generateReceiptHistory = (userId: string | number) => {
  const itemTypes = ['MUSIC', 'PLAYLIST', 'VOCABULARY', 'THEME'];
  const itemNames = [
    '프리미엄 음악', '인기 플레이리스트', '고급 단어장', '골드 테마',
    '클래식 음악', '재즈 플레이리스트', '토익 단어장', '실버 테마'
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
    const price = [100, 150, 200, 300][Math.floor(Math.random() * 4)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const statuses: Receipt['status'][] = ['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: i + 1,
      userId: Number(userId),
      itemName,
      itemType,
      price,
      quantity,
      totalAmount: price * quantity,
      transactionId: `TXN_${Date.now()}_${i}`,
      purchaseDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      status,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const pointHandlers = [
  // ==================== Point 관련 핸들러 ====================
  
  // 포인트 생성
  http.post(`${BASE_URL}/points/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PointRequest;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: Number(params.userId),
      createdAt: new Date().toISOString()
    });
  }),

  // 포인트 개별 조회
  http.get(`${BASE_URL}/points/:pointId`, ({ params }) => {
    const pointHistory = generatePointHistory(1);
    const point = pointHistory.find(p => p.id === Number(params.pointId));
    
    if (!point) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(point);
  }),

  // 포인트 내역 조회
  http.get(`${BASE_URL}/points/user/:userId`, ({ params, request }) => {
    const { userId } = params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type') as 'EARN' | 'USE' | null;
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
      if (curr.type === 'EARN') {
        acc.earnedPoints += curr.points;
      } else {
        acc.usedPoints += curr.points;
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

  // 포인트 개수 조회
  http.get(`${BASE_URL}/points/count/user/:userId`, ({ params }) => {
    const pointHistory = generatePointHistory(params.userId as string);
    return HttpResponse.json(pointHistory.length);
  }),

  // 포인트 수정
  http.put(`${BASE_URL}/points/:pointId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PointRequest;
    return HttpResponse.json({
      id: Number(params.pointId),
      ...body,
      userId: Number(params.userId),
      createdAt: new Date().toISOString()
    });
  }),

  // 포인트 삭제
  http.delete(`${BASE_URL}/points/:pointId/user/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ==================== Receipt 관련 핸들러 ====================
  
  // 영수증 생성
  http.post(`${BASE_URL}/points/receipts/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ReceiptRequest;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      totalAmount: body.price * body.quantity,
      userId: Number(params.userId),
      purchaseDate: body.purchaseDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }),

  // 영수증 개별 조회
  http.get(`${BASE_URL}/points/receipts/:receiptId`, ({ params }) => {
    const receiptHistory = generateReceiptHistory(1);
    const receipt = receiptHistory.find(r => r.id === Number(params.receiptId));
    
    if (!receipt) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(receipt);
  }),

  // 거래 ID로 영수증 조회
  http.get(`${BASE_URL}/points/receipts/transaction/:transactionId`, ({ params }) => {
    const receiptHistory = generateReceiptHistory(1);
    const receipt = receiptHistory.find(r => r.transactionId === params.transactionId);
    
    if (!receipt) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(receipt);
  }),

  // 영수증 내역 조회
  http.get(`${BASE_URL}/points/receipts/user/:userId`, ({ params, request }) => {
    const { userId } = params;
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as Receipt['status'] | null;
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    let receiptHistory = generateReceiptHistory(userId as string);
    
    if (status) {
      receiptHistory = receiptHistory.filter(receipt => receipt.status === status);
    }

    const start = page * size;
    const end = start + size;
    const paginatedHistory = receiptHistory.slice(start, end);

    return HttpResponse.json({
      content: paginatedHistory,
      totalPages: Math.ceil(receiptHistory.length / size),
      totalElements: receiptHistory.length,
      size,
      number: page
    });
  }),

  // 날짜 범위로 영수증 조회
  http.get(`${BASE_URL}/points/receipts/user/:userId/date-range`, ({ params, request }) => {
    const receiptHistory = generateReceiptHistory(params.userId as string);
    return HttpResponse.json(receiptHistory.slice(0, 10)); // 최근 10개 반환
  }),

  // 영수증 총 금액 조회
  http.get(`${BASE_URL}/points/receipts/total-amount/user/:userId`, ({ params }) => {
    const receiptHistory = generateReceiptHistory(params.userId as string);
    const totalAmount = receiptHistory
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    return HttpResponse.json(totalAmount);
  }),

  // 완료된 영수증 개수 조회
  http.get(`${BASE_URL}/points/receipts/count/user/:userId`, ({ params }) => {
    const receiptHistory = generateReceiptHistory(params.userId as string);
    const count = receiptHistory.filter(r => r.status === 'COMPLETED').length;
    return HttpResponse.json(count);
  }),

  // 영수증 수정
  http.put(`${BASE_URL}/points/receipts/:receiptId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ReceiptRequest;
    return HttpResponse.json({
      id: Number(params.receiptId),
      ...body,
      totalAmount: body.price * body.quantity,
      userId: Number(params.userId),
      purchaseDate: body.purchaseDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }),

  // 영수증 삭제
  http.delete(`${BASE_URL}/points/receipts/:receiptId/user/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
]; 