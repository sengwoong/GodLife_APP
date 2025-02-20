import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { UserRequest, UpdateUserRequest } from '../../common/types/serverType'

const generateUserPosts = (userId: string | number) => {
  return Array.from({ length: 10 }, (_, i) => ({
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
  }));
};

const generateUserVocas = (userId: string | number) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    vocaTitle: `단어장 ${i + 1}`,
    languages: ['English', '日本語', 'Tiếng Việt'][i % 3],
    userId: Number(userId),
    description: `설명 ${i + 1}`,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
  }));
};

const generateUserPlaylists = (userId: string | number) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    playlistTitle: `Playlist ${i + 1}`,
    userId: Number(userId),
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
  }));
};

interface AllItem {
  id: number;
  type: 'post' | 'voca' | 'playlist';
  createdAt: string;
  title?: string;
  vocaTitle?: string;
  playlistTitle?: string;
  languages?: string;
  description?: string;
  userId?: number;
}

export const userHandlers = [
  http.get(`${BASE_URL}/users/user/:userId`, ({ params }) => {
    return HttpResponse.json({
      id: params.userId,
      email: "test@example.com",
      nickName: "테스트유저",
      phoneNumber: "010-1234-5678",
      address: "서울시 강남구",
      profileImage: "https://via.placeholder.com/150",
      bio: "안녕하세요",
      level: 1,
      followers: 100,
      following: 50
    })
  }),

  http.put(`${BASE_URL}/users/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as UpdateUserRequest
    return HttpResponse.json({
      id: params.userId,
      ...body
    })
  }),

  http.delete(`${BASE_URL}/users/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${BASE_URL}/users`, async ({ request }) => {
    const body = await request.json() as UserRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  }),

  http.get(`${BASE_URL}/users/user/:userId/posts`, ({ params, request }) => {
    const userId = params.userId;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const posts = generateUserPosts(userId as string);
    const vocas = generateUserVocas(userId as string);
    const playlists = generateUserPlaylists(userId as string);

    const allItems: AllItem[] = [
      ...posts.map(post => ({ 
        id: post.id,
        title: post.title, 
        type: 'post' as const,
        createdAt: post.createdAt 
      })),
      ...vocas.map(voca => ({ 
        ...voca, 
        type: 'voca' as const 
      })),
      ...playlists.map(playlist => ({ 
        ...playlist, 
        type: 'playlist' as const 
      }))
    ].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 페이지네이션 처리
    const start = page * size;
    const end = start + size;
    const paginatedItems = allItems.slice(start, end);

    return HttpResponse.json({
      id: userId,
      posts: allItems.filter(item => item.type === 'post'),
      vocas: allItems.filter(item => item.type === 'voca'),
      playlists: allItems.filter(item => item.type === 'playlist'),
      allItems: paginatedItems,
      totalPages: Math.ceil(allItems.length / size),
      totalElements: allItems.length,
      size,
      number: page
    });
  })
] 