import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/types/constants';
import { Comment, Post } from '../../../types/post';
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

export const postHandlers = [
  http.get(`${BASE_URL}/posts/category/:category`, ({ request, params }) => {
    const url = new URL(request.url);
    const { category } = params;
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 10;

    console.log("Received category:", category);

    const allPosts = generateMockPosts(category as string, 100);
    
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
    const body = await request.json() as Comment;
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

  http.put(`${BASE_URL}/posts/:postId/comment/:commentId/user/:userId`, async ({ params, request }) => {
    const { postId, commentId, userId } = params;
    const body = await request.json() as Comment;
    return HttpResponse.json({
      ...body,
    });
  }),

  http.put(`${BASE_URL}/posts/:postId/user/:userId`, async ({ params, request }) => {
    const { postId, userId } = params;
    const body = await request.json() as Post;
    return HttpResponse.json({
      ...body,
    });
  }), 

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

  http.get(`${BASE_URL}/posts/:postId`, ({ params }) => {
    const { postId } = params;
    const isMusic = false;
    const isVoca = false;
    const type = isMusic ? 'music' : isVoca ? 'voca' : 'normal';
    
    let post;
    if (isMusic || isVoca) {
      post = {
        id: Number(postId),
        title: isMusic ? '인기 음악' : '인기 단어장',
        postImage: 'https://picsum.photos/200/300',
        price: 1000,
        likes: 10,
        userId: 1,
        userName: '판매자',
        postContent: isMusic ? '음악 설명입니다.' : '단어장 설명입니다.',
        type,
        // 음악/단어장 공통 필드
        items: isMusic 
          ? [
              { id: 1, title: 'Spring Day', content: 'qwfqwf.cpm' },
              { id: 2, title: 'Butter', content: 'qwfqwf.cpm' },
              { id: 3, title: 'Dynamite', content: 'qwfqwf.cpm' },
            ]
          : [
              { id: 1, title: '바나나', content: 'banana' },
              { id: 2, title: '사과', content: 'apple' },
              { id: 3, title: '체리', content: 'cherry' },
            ]
      };
    } else {
      post = generateSinglePost(postId as string, type, false);
    }

    return HttpResponse.json(post);
  }),
]; 

