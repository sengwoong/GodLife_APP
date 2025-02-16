import { http, HttpResponse } from 'msw'
import { BASE_URL } from './constants'
import { WordRequest } from '../types'

export const wordHandlers = [
  http.put(`${BASE_URL}/words/word/:wordId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as WordRequest
    return HttpResponse.json({
      id: params.wordId,
      ...body,
      userId: params.userId,
    })
  }),

  http.delete(`${BASE_URL}/words/word/:wordId/user/:userId`, ({ params }) => {
    return HttpResponse.json({
      id: params.wordId,
      userId: params.userId,
      deleted: true
    })
  }),

  http.post(`${BASE_URL}/words`, async ({ request }) => {
    const body = await request.json() as WordRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  }),

  http.get(`${BASE_URL}/words/voca/:vocaId`, ({ params }) => {
    return HttpResponse.json({
      content: [
        {
          id: 1,
          word: "Example",
          meaning: "예시",
          vocaId: Number(params.vocaId)
        }
      ],
      totalPages: 1,
      totalElements: 1,
      size: 10,
      number: 0
    })
  })
] 