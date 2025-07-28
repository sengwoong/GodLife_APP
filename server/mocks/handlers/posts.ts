import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/types/constants';
import { Comment, Post } from '../../../types/post';

const generateMockPosts = (category: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId: Math.floor(Math.random() * 10) + 1,
    userName: `User ${i + 1}`,
    profileImage: `https://i.pravatar.cc/150?img=${i + 1}`,
    title: `Post Title ${i + 1}`,
    postContent: `This is a ${category} post content ${i + 1}`,
    postImage: `https://picsum.photos/seed/${i + 1}/600/400`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    category,
    type: category.toUpperCase(),
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const generateSinglePost = (postId: string, type: 'MUSIC' | 'POST' | 'VOCA', sale: boolean) => {
  const basePost = {
    id: parseInt(postId),
    userId: Math.floor(Math.random() * 10) + 1,
    userName: `User ${postId}`,
    title: `Post ${postId}`,
    type: type,
    postImage: `https://picsum.photos/600/${400 + parseInt(postId)}`,
    likes: Math.floor(Math.random() * 100),
    price: 32000,
    createdAt: new Date().toISOString(),
    sale: sale,
    postContent: `${type} 상품에 대한 설명입니다.`,
  };

  if (type === 'MUSIC' || type === 'VOCA') {
    return {
      ...basePost,
      items: type === 'MUSIC' 
        ? [
            { id: 1, title: 'Spring Day', content: 'qwfqwf.com' },
            { id: 2, title: 'Butter', content: 'qwfqwf.com' },
            { id: 3, title: 'Dynamite', content: 'qwfqwf.com' },
          ]
        : [
            { id: 1, title: '바나나', content: 'banana' },
            { id: 2, title: '사과', content: 'apple' },
            { id: 3, title: '체리', content: 'cherry' },
          ]
    };
  }

  return basePost;
};

const generateMockComments = (postId: number, count: number = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    postId: postId,
    content: `댓글 내용 ${i + 1}`,
    userName: `User ${Math.floor(Math.random() * 10) + 1}`,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    userId: Math.floor(Math.random() * 10) + 1,
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const generateMockPostAds = (userId: number) => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    postId: 100 + i,
    title: `광고 ${i + 1}`,
    status: Math.random() > 0.5,
    startDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    endDate: new Date(Date.now() + ((i + 30) * 24 * 60 * 60 * 1000)).toISOString(),
    userId
  }));
};

const generateMockUserComments = (userId: number) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    postId: 200 + i,
    postTitle: `포스트 제목 ${i + 1}`,
    content: `댓글 내용 ${i + 1}`,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    likes: Math.floor(Math.random() * 10),
    userId
  }));
};

const generateMockSharedPosts = (userId: number) => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    postId: 300 + i,
    title: `공유 포스트 ${i + 1}`,
    sharedDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    userId
  }));
};

export const postHandlers = [
  // ==================== Post 관련 핸들러 ====================
  
  // 카테고리별 공유된 포스트 조회
  http.get(`${BASE_URL}/posts/category/:category`, ({ params, request }) => {
    const url = new URL(request.url);
    const { category } = params;
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allPosts = generateMockPosts(category as string, 100);
    
    // 공유된 포스트만 필터링 (백엔드에서 자동으로 처리)
    const sharedPosts = allPosts.filter(post => Math.random() > 0.3);
    
    const filteredPosts = sharedPosts.filter(post => 
      post.postContent.toLowerCase().includes(search) ||
      post.userName.toLowerCase().includes(search) ||
      post.title.toLowerCase().includes(search)
    );

    const start = page * size;
    const end = start + size;
    const paginatedPosts = filteredPosts.slice(start, end);

    return HttpResponse.json({
      content: paginatedPosts,
      totalPages: Math.ceil(filteredPosts.length / size),
      totalElements: filteredPosts.length,
      size,
      number: page,
      last: end >= filteredPosts.length,
    });
  }),

  // 사용자별 포스트 조회
  http.get(`${BASE_URL}/posts/user/:userId`, ({ params, request }) => {
    const url = new URL(request.url);
    const { userId } = params;
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    const category = url.searchParams.get('category');

    let allPosts = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      userId: Number(userId),
      userName: `User ${userId}`,
      title: `Post Title ${i + 1}`,
      postContent: `This is a post content ${i + 1}`,
      postImage: `https://placekitten.com/600/${400 + i}`,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      category: category || 'POST',
      type: category || 'POST',
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 카테고리가 지정된 경우 해당 카테고리만 필터링
    if (category) {
      allPosts = allPosts.filter(post => post.type === category.toUpperCase());
    }
    
    const start = page * size;
    const end = start + size;
    const paginatedPosts = allPosts.slice(start, end);

    return HttpResponse.json({
      content: paginatedPosts,
      totalPages: Math.ceil(allPosts.length / size),
      totalElements: allPosts.length,
      size,
      number: page,
    });
  }),

  // 인기 공유된 포스트 조회
  http.get(`${BASE_URL}/posts/best`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const bestPosts = generateMockPosts('POST', 50);
    // 공유된 포스트만 필터링 (백엔드에서 자동으로 처리)
    const sharedBestPosts = bestPosts.filter(post => Math.random() > 0.3);
    
    const start = page * size;
    const end = start + size;
    const paginatedPosts = sharedBestPosts.slice(start, end);

    return HttpResponse.json({
      content: paginatedPosts,
      totalPages: Math.ceil(sharedBestPosts.length / size),
      totalElements: sharedBestPosts.length,
      size,
      number: page,
    });
  }),

  // 공유된 포스트 조회 (아무나 볼 수 있음)
  http.get(`${BASE_URL}/posts/shared/:postId`, ({ params }) => {
    const { postId } = params;
    const post = generateSinglePost(postId as string, 'POST', true);
    return HttpResponse.json(post);
  }),

  // 나의 포스트 조회 (나만 볼 수 있음)
  http.get(`${BASE_URL}/posts/my/:postId/user/:userId`, ({ params }) => {
    const { postId, userId } = params;
    const post = generateSinglePost(postId as string, 'POST', true);
    return HttpResponse.json(post);
  }),

  // 포스트 생성
  http.post(`${BASE_URL}/posts/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: Number(params.userId),
      createdAt: new Date().toISOString(),
    });
  }),

  // 포스트 수정
  http.put(`${BASE_URL}/posts/:postId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: Number(params.postId),
      ...body,
      userId: Number(params.userId),
      createdAt: new Date().toISOString(),
    });
  }),

  // 포스트 삭제
  http.delete(`${BASE_URL}/posts/:postId/user/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // 나의 공유된 광고 포스트 조회
  http.get(`${BASE_URL}/posts/ads/user/:userId`, ({ params }) => {
    const { userId } = params;
    
    const ads = generateMockPostAds(Number(userId));
    // 공유된 광고만 필터링 (백엔드에서 자동으로 처리)
    const sharedAds = ads.filter(ad => Math.random() > 0.3);
    
    return HttpResponse.json({
      content: sharedAds,
      totalPages: 1,
      totalElements: sharedAds.length,
      size: sharedAds.length,
      number: 0,
    });
  }),

  // 광고 상태 토글
  http.put(`${BASE_URL}/posts/ads/:adId/toggle`, async ({ params, request }) => {
    const { adId } = params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    
    return HttpResponse.json({
      id: Number(adId),
      userId: Number(userId),
      status: true, 
    });
  }),

  // 나의 공유된 포스트 조회
  http.get(`${BASE_URL}/posts/shared/user/:userId`, ({ params }) => {
    const { userId } = params;
    
    const sharedPosts = generateMockSharedPosts(Number(userId));
    // 공유된 포스트만 필터링 (백엔드에서 자동으로 처리)
    const filteredSharedPosts = sharedPosts.filter(post => Math.random() > 0.3);
    
    return HttpResponse.json({
      content: filteredSharedPosts,
      totalPages: 1,
      totalElements: filteredSharedPosts.length,
      size: filteredSharedPosts.length,
      number: 0,
    });
  }),

  // 포스트 좋아요
  http.post(`${BASE_URL}/posts/:postId/like/user/:userId`, async ({ params }) => {
    const { postId, userId } = params;
    return HttpResponse.json({
      postId: Number(postId),
      userId: Number(userId),
      isLiked: true,
      createdAt: new Date().toISOString(),
      totalLikes: Math.floor(Math.random() * 100) + 1,
    });
  }),

  // 좋아요 상태 확인
  http.get(`${BASE_URL}/posts/:postId/like/user/:userId`, async ({ params }) => {
    const { postId, userId } = params;
    // 임시로 랜덤하게 좋아요 상태 반환
    const isLiked = Math.random() > 0.5;
    return HttpResponse.json({
      postId: Number(postId),
      userId: Number(userId),
      isLiked: isLiked,
    });
  }),

  // ==================== Comment 관련 핸들러 ====================
  
  // 댓글 조회 (포스트별)
  http.get(`${BASE_URL}/comments/post/:postId`, ({ params, request }) => {
    const url = new URL(request.url);
    const { postId } = params;
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allComments = generateMockComments(Number(postId), 50);
    const start = page * size;
    const end = start + size;
    const paginatedComments = allComments.slice(start, end);

    return HttpResponse.json({
      content: paginatedComments,
      totalPages: Math.ceil(allComments.length / size),
      totalElements: allComments.length,
      size,
      number: page,
    });
  }),

  // 댓글 조회 (사용자별)
  http.get(`${BASE_URL}/comments/user/:userId`, ({ params }) => {
    const { userId } = params;
    const comments = generateMockUserComments(Number(userId));
    
    return HttpResponse.json({
      content: comments,
      totalPages: 1,
      totalElements: comments.length,
      size: comments.length,
      number: 0,
    });
  }),

  // 댓글 개수 조회
  http.get(`${BASE_URL}/comments/post/:postId/count`, ({ params }) => {
    const { postId } = params;
    const count = Math.floor(Math.random() * 50) + 1;
    return HttpResponse.json(count);
  }),

  // 댓글 생성
  http.post(`${BASE_URL}/comments/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: Number(params.userId),
      createdAt: new Date().toISOString(),
    });
  }),

  // 댓글 수정
  http.put(`${BASE_URL}/comments/:commentId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: Number(params.commentId),
      ...body,
      userId: Number(params.userId),
      createdAt: new Date().toISOString(),
    });
  }),

  // 댓글 삭제
  http.delete(`${BASE_URL}/comments/:commentId/user/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
]; 

