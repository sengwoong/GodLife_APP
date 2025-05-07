import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { MusicRequest } from '../../common/types/serverType'

// 임베딩이 허용될 가능성이 매우 높은 NCS (NoCopyrightSounds) 유튜브 비디오 ID 목록
const youtubeVideoIds = [
  '6CQWklzrUZQ', // Alan Walker - Fade [NCS Release]
  'icKtd3wUBug', 
  '6aQ4lK1xCcI'
];

export const musicHandlers = [
  http.post(`${BASE_URL}/musics/playlist/:playlistId`, async ({ request }) => {
    const body = await request.json() as MusicRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  }),

  http.put(`${BASE_URL}/musics/playlist/:playlistId/music/:musicId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as MusicRequest
    return HttpResponse.json({
      id: params.musicId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/musics/playlist/:playlistId/music/:musicId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/musics/playlist/:playlistId`, ({ params, request }) => {
    const url = new URL(request.url);
    const index = parseInt(url.searchParams.get('index') || '-1', 10);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    const allMusics = Array.from({ length: 1000 }, (_, i) => {
      const videoId = youtubeVideoIds[i % youtubeVideoIds.length];
      return {
        id: (i + 1).toString(),
        musicTitle: `Music ${i + 1} (Video ${videoId.substring(0,5)})`, // 제목에 비디오 ID 일부 표시 (선택 사항)
        musicUrl: `https://www.youtube.com/watch?v=${videoId}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        imageUrl: `https://img.youtube.com/vi/${videoId}/0.jpg` // 유튜브 썸네일 URL 사용
      };
    });

    const filteredMusics = allMusics.filter(music => 
      music.musicTitle.toLowerCase().includes(search)
    );

    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 10;
    const start = page * size;
    const end = start + size;

    const paginatedMusics = filteredMusics.slice(start, end);

    if (index >= 0) {
      return HttpResponse.json({
        content: [allMusics[index]],
        totalPages: 1,
        totalElements: 1,
        size: 1,
        number: 0
      });
    }

    return HttpResponse.json({
      content: paginatedMusics,
      totalPages: Math.ceil(filteredMusics.length / size),
      totalElements: filteredMusics.length,
      size,
      number: page
    });
  }),

  http.get(`${BASE_URL}/musics/:musicId`, ({ params }) => {
    const { musicId } = params;
    // musicId가 숫자라고 가정하고, youtubeVideoIds 배열 내에서 선택
    const numericId = parseInt(musicId as string, 10);
    const videoId = youtubeVideoIds[numericId % youtubeVideoIds.length] || youtubeVideoIds[0];

    return HttpResponse.json({
      id: musicId,
      musicTitle: `Music ${musicId} (Video ${videoId.substring(0,5)})`,
      musicUrl: `https://www.youtube.com/watch?v=${videoId}`,
      color: '#000000',
      imageUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`
    });
  }),

  http.get(`${BASE_URL}/musics/liked/:userId`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const likedMusics = Array.from({ length: 20 }, (_, i) => {
      const videoId = youtubeVideoIds[i % youtubeVideoIds.length];
      return {
        id: (i + 1).toString(),
        musicTitle: `좋아요 한 음악 ${i + 1} (Video ${videoId.substring(0,5)})`,
        musicUrl: `https://www.youtube.com/watch?v=${videoId}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        imageUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        musicLike: true
      };
    });

    const start = page * size;
    const end = start + size;
    const paginatedMusics = likedMusics.slice(start, end);

    return HttpResponse.json({
      content: paginatedMusics,
      totalPages: Math.ceil(likedMusics.length / size),
      totalElements: likedMusics.length,
      size,
      number: page
    });
  }),
] 