import { http, HttpResponse } from 'msw'
import { BASE_URL } from './constants'
import { PlaylistRequest } from '../types'

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
  })
] 