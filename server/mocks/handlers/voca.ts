import { http, HttpResponse } from 'msw'
import { BASE_URL } from './constants'
import { VocaRequest } from '../types'

export const vocaHandlers = [
  http.put(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest
    return HttpResponse.json({
      id: params.vocaId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/vocas/user/:userId`, () => {
    return HttpResponse.json({
      content: [
        {
          id: 1,
          vocaTitle: "기본 단어장",
          description: "기본 설명"
        }
      ],
      totalPages: 1,
      totalElements: 1,
      size: 10,
      number: 0
    })
  }),

  http.post(`${BASE_URL}/vocas/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: params.userId
    })
  })
] 