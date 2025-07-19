import { useMutation } from '@tanstack/react-query'
import { BASE_URL } from '../../common/types/constants'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  token: string
  user: {
    id: number
    email: string
    nickName: string
  }
}

interface SignUpRequest {
  email: string
  password: string
  nickName: string
  age: number
}

// 로그인
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다');
      }
      
      return response.json() as Promise<LoginResponse>
    },
  })
} 

// 회원가입
export function useSignUp() {
  return useMutation({
    mutationFn: async (userData: SignUpRequest) => {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '회원가입에 실패했습니다')
      }
      
      return response.json()
    },
  })
} 