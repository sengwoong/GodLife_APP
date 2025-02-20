import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { PlaylistRequest } from '../../common/types/serverType'

export const playlistHandlers = [
  http.put(`${BASE_URL}/playlists/playlist/:playlistId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PlaylistRequest
    return HttpResponse.json({
      id: params.playlistId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/playlists/playlist/:playlistId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${BASE_URL}/playlists/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as PlaylistRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: params.userId
    })
  }),

  http.get(`${BASE_URL}/playlists/:playListIndex`, ({ params }) => {
    return HttpResponse.json({
      id: params.playListIndex,
      playlistTitle: `Playlist ${params.playListIndex}`
    })
  }),

  http.get(`${BASE_URL}/playlists`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || '';
 
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 3;

    const allPlaylists = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      playlistTitle: `Playlist ${i + 1}`
    }));

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

  http.put(`${BASE_URL}/playlists/:playlistId`, async ({ params, request }) => {
    const { playlistId } = params;
    const body = await request.json() as PlaylistRequest;
    
    return HttpResponse.json({
      id: Number(playlistId),
      ...body,
    });
  }),

  http.get(`${BASE_URL}/playlists/user/:userId`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const allPlaylists = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      playlistTitle: `Playlist ${i + 1}`,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = page * size;
    const end = start + size;
    const paginatedPlaylists = allPlaylists.slice(start, end);

    return HttpResponse.json({
      content: paginatedPlaylists,
      totalPages: Math.ceil(allPlaylists.length / size),
      totalElements: allPlaylists.length,
      size,
      number: page
    });
  }),
] 