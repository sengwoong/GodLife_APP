import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/types/constants';
import { comment, Post } from '../../../types/post';
import { MusicRequest } from '../../common/types/serverType';

const generateMockPosts = (category: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId: Math.floor(Math.random() * 10) + 1,
    userName: `User ${i + 1}`,
    profileImage: `https://placekitten.com/100/${100 + i}`,
    postContent: `This is a ${category} post content ${i + 1}`,
    postImage: `https://placekitten.com/600/${400 + i}`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    category,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

export const postHandlers = [
// type 은 shop like music allpost 중 하나
  http.get(`${BASE_URL}/posts/category/:category`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'post';
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 10;

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



  http.post(`${BASE_URL}/posts/:postId/like/user/:userId`, async ({ params, request }) => {
    const { postId, userId } = params;
    return HttpResponse.json({
      id: Number(postId),
      userId: Number(userId),
      liked: true,
    });
  }),

  http.post(`${BASE_URL}/posts/:postId/shop`, async ({ params, request }) => {
    const { postId } = params;
    return HttpResponse.json({
      id: Number(postId),
      shop: true,
    });
  }),


  http.post(`${BASE_URL}/posts/:postId/music`, async ({ params, request }) => {
    const { postId } = params;
    const body = await request.json() as MusicRequest;
    return HttpResponse.json({
      id: Number(postId),
      music: true,
      ...body,
    });
  }),

  http.post(`${BASE_URL}/posts`, async ({  request }) => {
    const body = await request.json() as Post;
    return HttpResponse.json({
      ...body,
    });
  }),

  http.post(`${BASE_URL}/posts/:postId/comment`, async ({ params, request }) => {
    const { postId } = params;
    const body = await request.json() as comment;
    return HttpResponse.json({
      ...body,
      postId: Number(postId),
    });
  }),

  http.delete(`${BASE_URL}/posts/:postId/comment/:commentId/user/:userId`, ({ params }) => {
    const { postId, commentId, userId } = params;
    return HttpResponse.json({
      id: Number(postId),
      commentId: Number(commentId),
      userId: Number(userId),
    });
  }),

  http.delete(`${BASE_URL}/posts/:postId/user/:userId`, ({ params }) => {
    const { postId, userId } = params;
    return HttpResponse.json({
      id: Number(postId),
      userId: Number(userId),
    });
  }),

  //댓글수정
  http.put(`${BASE_URL}/posts/:postId/comment/:commentId/user/:userId`, async ({ params, request }) => {
    const { postId, commentId, userId } = params;
    const body = await request.json() as comment;
    return HttpResponse.json({
      ...body,
    });
  }),

  // 게시글수정
  http.put(`${BASE_URL}/posts/:postId/user/:userId`, async ({ params, request }) => {
    const { postId, userId } = params;
    const body = await request.json() as Post;
    return HttpResponse.json({
      ...body,
    });
  }), 

  // todo 라이크 쇼핑 뮤직 ㅠbollen flse로 수정정 
  http.put(`${BASE_URL}/posts/:postId/unlike/user/:userId`, async ({ params, request }) => {
    const { postId, userId } = params;
    const body = await request.json() as Post;
    return HttpResponse.json({
      ...body,
      likes: false,
    });
  }),
  
  http.put(`${BASE_URL}/posts/:postId/shop/user/:userId`, async ({ params, request }) => {
    const { postId, userId } = params;
    const body = await request.json() as Post;
    return HttpResponse.json({
      ...body,
      shop: false,
    });
  }),
  
  http.put(`${BASE_URL}/posts/:postId/music/user/:userId`, async ({ params, request }) => {
    const { postId, userId } = params;
    const body = await request.json() as Post;
    return HttpResponse.json({
      ...body,
      music: false,
    });
  }),
]; 

