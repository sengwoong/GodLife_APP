import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/types/constants';

export const youtubeHandlers = [
  http.get(`${BASE_URL}/youtube/playlists`, async () => {
    // 백엔드에서 YouTube API를 호출하고 결과를 반환
    const mockPlaylists = Array.from({ length: 10 }, (_, i) => ({
      id: `playlist-${i + 1}`,
      title: `YouTube Playlist ${i + 1}`,
      description: `Description for playlist ${i + 1}`,
      thumbnailUrl: `https://example.com/thumbnail${i + 1}.jpg`,
      itemCount: Math.floor(Math.random() * 50) + 1
    }));

    return HttpResponse.json(mockPlaylists);
  }),

  http.get(`${BASE_URL}/youtube/playlists/:playlistId/items`, async ({ params }) => {
    const mockItems = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i + 1}`,
      title: `Video ${i + 1}`,
      videoId: `video-${i + 1}`,
      thumbnailUrl: `https://example.com/video${i + 1}.jpg`,
      duration: '3:45'
    }));

    return HttpResponse.json(mockItems);
  }),

  http.post(`${BASE_URL}/youtube/api-key`, async ({ request }) => {
    const body = await request.json();
    
    // 실제로는 여기서 API 키를 데이터베이스에 저장
    return HttpResponse.json({
      success: true,
      message: 'API key saved successfully'
    });
  }),
]; 