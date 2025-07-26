import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { PlaylistRequest } from '../../common/types/serverType'
import { PlaylistShareRequest } from '../../../types/playlist'

export const playlistHandlers = [
  http.post(`${BASE_URL}/playlists/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as PlaylistRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: params.user_id
    })
  }),

  http.put(`${BASE_URL}/playlists/playlist/:playlist_id/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as PlaylistRequest
    return HttpResponse.json({
      id: params.playlist_id,
      ...body,
      userId: params.user_id
    })
  }),

  http.put(`${BASE_URL}/playlists/share/:playlist_id/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as PlaylistShareRequest;
    return HttpResponse.json({
      id: Number(params.playlist_id),
      isShared: body.isShared,
      userId: Number(params.user_id)
    });
  }),

  http.delete(`${BASE_URL}/playlists/playlist/:playlist_id/user/:user_id`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/playlists/user/:user_id`, ({ params, request }) => {
    const url = new URL(request.url);
    const { user_id } = params;
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allPlaylists = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      playlistTitle: `Playlist ${i + 1}`,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      userId: Number(user_id)
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredPlaylists = allPlaylists.filter(playlist =>
      playlist.playlistTitle.toLowerCase().includes(search)
    );

    const start = page * size;
    const end = start + size;
    const paginatedPlaylists = filteredPlaylists.slice(start, end);

    return HttpResponse.json({
      content: paginatedPlaylists,
      totalPages: Math.ceil(filteredPlaylists.length / size),
      totalElements: filteredPlaylists.length,
      size,
      number: page
    });
  }),

  // 단일 플레이리스트 조회 (user_id는 쿼리스트링에서 받거나, 없으면 1로 처리)
  http.get(`${BASE_URL}/playlists/playlist/:playlist_id/user/:user_id`, ({ params }) => {
    return HttpResponse.json({
      id: params.playlist_id,
      playlistTitle: `Playlist ${params.playlist_id}`,
      userId: Number(params.user_id)
    })
  }),
]