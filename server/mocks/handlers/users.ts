import { http, HttpResponse } from 'msw'
import { BASE_URL } from './constants'
import { UserRequest, UpdateUserRequest } from '../types'

export const userHandlers = [
  http.get(`${BASE_URL}/users/user/:userId`, ({ params }) => {
    return HttpResponse.json({
      id: params.userId,
      email: "test@example.com",
      nickName: "테스트유저",
      phoneNumber: "010-1234-5678",
      address: "서울시 강남구"
    })
  }),

  http.put(`${BASE_URL}/users/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as UpdateUserRequest
    return HttpResponse.json({
      id: params.userId,
      ...body
    })
  }),

  http.delete(`${BASE_URL}/users/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${BASE_URL}/users`, async ({ request }) => {
    const body = await request.json() as UserRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  })
] 