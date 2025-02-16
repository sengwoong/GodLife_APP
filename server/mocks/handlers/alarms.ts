import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { AlarmRequest } from '../../common/types/serverType'

export const alarmHandlers = [
  http.put(`${BASE_URL}/alarms/alarm/:alarmId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as AlarmRequest
    return HttpResponse.json({
      id: params.alarmId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/alarms/alarm/:alarmId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${BASE_URL}/alarms/schedule/:scheduleId/users/:userId`, async ({ params, request }) => {
    const body = await request.json() as AlarmRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      scheduleId: params.scheduleId,
      userId: params.userId
    })
  })
] 