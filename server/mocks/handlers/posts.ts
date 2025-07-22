import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/types/constants';
import { Comment, Post } from '../../../types/post';
import { MusicRequest } from '../../common/types/serverType';

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
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const generateSinglePost = (postId: string, type: 'music' | 'normal' | 'voca', sale: boolean) => {
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
    comments: [
      {
        id: 1,
        content: "아주 좋은 상품이에요!",
        userName: "구매자1",
        createdAt: "2024-03-20"
      },
      {
        id: 2,
        content: "매우 만족합니다",
        userName: "구매자2",
        createdAt: "2024-03-19"
      }
    ]
  };

  if (type === 'music' || type === 'voca') {
    return {
      ...basePost,
      items: type === 'music' 
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

const generateMockComments = (userId: number) => {
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
  // Read
  http.get(`${BASE_URL}/posts`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'all';
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allPosts = generateMockPosts(category, 100);
    
    const filteredPosts = allPosts.filter(post => 
      post.postContent.toLowerCase().includes(search) ||
      post.userName.toLowerCase().includes(search)
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
    });
  }),

  http.get(`${BASE_URL}/posts/user/:userId`, ({ params, request }) => {
    const url = new URL(request.url);
    const { userId } = params;

    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allPosts = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      userId: Number(userId),
      userName: `User ${userId}`,
      title: `Post Title ${i + 1}`,
      postContent: `This is a post content ${i + 1}`,
      postImage: `https://placekitten.com/600/${400 + i}`,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      category: 'post',
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
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

  http.get(`${BASE_URL}/posts/best`, () => {
    const bestPosts = generateMockPosts('post', 10);
    return HttpResponse.json({
      bestPosts
    });
  }),

  http.get(`${BASE_URL}/posts/ads/user/:userId`, ({ params }) => {
    const { userId } = params;
    const ads = generateMockPostAds(Number(userId));
    
    return HttpResponse.json({
      content: ads,
      totalPages: 1,
      totalElements: ads.length,
      size: ads.length,
      number: 0,
    });
  }),

  http.get(`${BASE_URL}/posts/comments/user/:userId`, ({ params }) => {
    const { userId } = params;
    const comments = generateMockComments(Number(userId));
    
    return HttpResponse.json({
      content: comments,
      totalPages: 1,
      totalElements: comments.length,
      size: comments.length,
      number: 0,
    });
  }),

  http.get(`${BASE_URL}/posts/shared/user/:userId`, ({ params }) => {
    const { userId } = params;
    const sharedPosts = generateMockSharedPosts(Number(userId));
    
    return HttpResponse.json({
      content: sharedPosts,
      totalPages: 1,
      totalElements: sharedPosts.length,
      size: sharedPosts.length,
      number: 0,
    });
  }),

  http.get(`${BASE_URL}/posts/:postId`, ({ params }) => {
    const { postId } = params;
    const post = generateSinglePost(postId as string, 'normal', true);
    return HttpResponse.json(post);
  }),

  // Update
  http.put(`${BASE_URL}/posts/ads/:adId/toggle`, async ({ params }) => {
    const { adId } = params;
    return HttpResponse.json({
      id: Number(adId),
      status: true, 
    });
  }),

  // Create
  http.post(`${BASE_URL}/posts/:postId/like/user/:userId`, async ({ params }) => {
    const { postId, userId } = params;
    return HttpResponse.json({
      postId: Number(postId),
      userId: Number(userId),
      liked: true,
    });
  }),
]; 

