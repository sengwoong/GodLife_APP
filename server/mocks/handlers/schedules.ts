import { http, HttpResponse } from 'msw'
import { BASE_URL } from './constants'
import { ScheduleRequest } from '../types'

export const scheduleHandlers = [
  http.put(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ScheduleRequest
    return HttpResponse.json({
      id: params.scheduleId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/schedules/schedule/:scheduleId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/schedules/user/:userId`, () => {
    return HttpResponse.json({
      content: [
        {
          id: 1,
          scheduleTitle: "미팅",
          startTime: "2024-03-20T09:00:00",
          endTime: "2024-03-20T10:00:00"
        }
      ],
      totalPages: 1,
      totalElements: 1,
      size: 10,
      number: 0
    })
  }),

  http.post(`${BASE_URL}/schedules/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as ScheduleRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      userId: params.userId
    })
  })
] 