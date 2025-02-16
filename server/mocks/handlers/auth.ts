import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { LoginRequest } from '../../common/types/serverType'

export const authHandlers = [
  http.post('http://10.0.2.2:8081/api/login', async ({ request }) => {
    console.log('/api/login 백엔드 호출')
    const { email, password } = await request.json() as LoginRequest
    console.log('email', email)
    console.log('password', password)
    if (email === 'test@test.com' && password === 'password') {
      return HttpResponse.json({
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@test.com',
          username: 'test',
        }
      })
    }
    
    return new HttpResponse(null, {
      status: 401,
      statusText: '인증 실패'
    })
  }),
]