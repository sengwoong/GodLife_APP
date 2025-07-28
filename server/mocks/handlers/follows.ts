import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/types/constants';

// Mock 사용자 데이터 생성 함수
const generateMockUsers = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    email: `user${index + 1}@example.com`,
    nickName: `사용자${index + 1}`,
    phoneNumber: `010-1234-${String(index + 1).padStart(4, '0')}`,
    address: `서울시 강남구 ${index + 1}번길`,
    profileImage: `https://via.placeholder.com/150/92c952?text=User${index + 1}`,
    bio: `안녕하세요! 사용자${index + 1}입니다.`,
    level: Math.floor(Math.random() * 10) + 1,
    followers: Math.floor(Math.random() * 100),
    following: Math.floor(Math.random() * 50),
    sales: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

// 팔로우 토글
export const followHandlers = [
  http.post(`${BASE_URL}/users/:followerId/follow/:followingId`, async ({ params }) => {
    const { followerId, followingId } = params;
    
    // 임시로 랜덤하게 팔로우 상태 반환
    const isFollowing = Math.random() > 0.5;
    
    return HttpResponse.json({
      followerId: Number(followerId),
      followingId: Number(followingId),
      isFollowing: isFollowing,
      createdAt: new Date().toISOString(),
      followerCount: Math.floor(Math.random() * 100) + 1,
      followingCount: Math.floor(Math.random() * 50) + 1,
    });
  }),

  // 팔로우 상태 확인
  http.get(`${BASE_URL}/users/:followerId/follow/:followingId`, async ({ params }) => {
    const { followerId, followingId } = params;
    
    // 임시로 랜덤하게 팔로우 상태 반환
    const isFollowing = Math.random() > 0.5;
    
    return HttpResponse.json({
      followerId: Number(followerId),
      followingId: Number(followingId),
      isFollowing: isFollowing,
    });
  }),

  // 팔로워 목록 조회
  http.get(`${BASE_URL}/users/:userId/followers`, async ({ params, request }) => {
    const { userId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    
    const mockUsers = generateMockUsers(size);
    
    return HttpResponse.json({
      content: mockUsers,
      totalPages: Math.ceil(50 / size),
      totalElements: 50,
      size: size,
      number: page,
    });
  }),

  // 팔로잉 목록 조회
  http.get(`${BASE_URL}/users/:userId/following`, async ({ params, request }) => {
    const { userId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    
    const mockUsers = generateMockUsers(size);
    
    return HttpResponse.json({
      content: mockUsers,
      totalPages: Math.ceil(30 / size),
      totalElements: 30,
      size: size,
      number: page,
    });
  }),
]; 