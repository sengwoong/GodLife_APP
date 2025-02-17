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



  http.get(`${BASE_URL}/playlists`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || '';
 
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 10;

    const allPlaylists = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Playlist ${i + 1}`
    }));

    const filteredPlaylists = allPlaylists.filter(playlist =>
      playlist.title.toLowerCase().includes(search)
    );
    console.log('filteredPlaylists', filteredPlaylists)
    console.log('allPlaylists', allPlaylists)
    console.log('search', search)

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
  })
] 