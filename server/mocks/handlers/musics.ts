import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { MusicRequest } from '../../common/types/serverType'

export const musicHandlers = [
  http.put(`${BASE_URL}/musics/music/:musicId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as MusicRequest
    return HttpResponse.json({
      id: params.musicId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/musics/music/:musicId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${BASE_URL}/musics`, async ({ request }) => {
    const body = await request.json() as MusicRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  })
] 