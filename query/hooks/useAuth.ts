import { useMutation } from '@tanstack/react-query'
import { Platform } from 'react-native'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  token: string
  user: {
    id: number
    username: string
    name: string
  }
}

// Platform에 따른 baseURL 설정
const baseURL = Platform.select({
  android: 'http://10.0.2.2:8081',
  ios: 'http://localhost:8081',
  default: 'http://10.0.2.2:8081',
})

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        console.log('useLogin 호출')
        console.log('credentials', credentials)
        const response = await fetch(`${baseURL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '로그인 실패');
        }
        
        return response.json() as Promise<LoginResponse>
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },
  })
} 