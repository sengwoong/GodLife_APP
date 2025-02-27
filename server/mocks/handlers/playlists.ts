import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { PlaylistRequest } from '../../common/types/serverType'
import { PlaylistShareRequest } from '../../../types/playlist'

export const playlistHandlers = [
  http.post(`${BASE_URL}/playlists/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PlaylistRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: params.userId
    })
  }),

  http.put(`${BASE_URL}/playlists/playlist/:playlistId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PlaylistRequest
    return HttpResponse.json({
      id: params.playlistId,
      ...body,
      userId: params.userId
    })
  }),

  http.put(`${BASE_URL}/playlists/:playlistId`, async ({ params, request }) => {
    const { playlistId } = params;
    const body = await request.json() as PlaylistRequest;
    
    return HttpResponse.json({
      id: Number(playlistId),
      ...body,
    });
  }),

  http.put(`${BASE_URL}/playlists/share/:playlistId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PlaylistShareRequest;
    return HttpResponse.json({
      id: Number(params.playlistId),
      isShared: body.isShared,
      userId: Number(params.userId)
    });
  }),

  http.delete(`${BASE_URL}/playlists/playlist/:playlistId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/playlists/user/:userId`, ({ params, request }) => {
    const url = new URL(request.url);
    const { userId } = params;
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allPlaylists = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      playlistTitle: `Playlist ${i + 1}`,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
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

  http.get(`${BASE_URL}/playlists/:playListIndex`, ({ params }) => {
    return HttpResponse.json({
      id: params.playListIndex,
      playlistTitle: `Playlist ${params.playListIndex}`
    })
  }),
]