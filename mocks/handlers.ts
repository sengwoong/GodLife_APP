import { http, HttpResponse } from 'msw'

interface LoginRequest {
  username: string
  password: string
}

export const handlers = [
  http.post('http://10.0.2.2:8081/api/login', async ({ request }) => {
    console.log('/api/login 백엔드 호출')
    const { username, password } = await request.json() as LoginRequest
    console.log('username', username)
    console.log('password', password)
    if (username === 'test@test.com' && password === 'password') {
      return HttpResponse.json({
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'test',
          name: '테스트 사용자'
        }
      })
    }
    
    return new HttpResponse(null, {
      status: 401,
      statusText: '인증 실패'
    })
  }),

  http.get('/api/example', () => {
    return HttpResponse.json({
      message: '모의 응답 데이터입니다',
    })
  }),
] 