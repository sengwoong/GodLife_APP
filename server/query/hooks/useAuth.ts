import { useMutation } from '@tanstack/react-query'
import { Platform } from 'react-native'
import { BASE_URL } from '../../common/types/constants'
import { User } from '../../../types/user'

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
    name: string
  }
}

interface SignUpRequest {
  email: string
  nickName: string
  phoneNumber: string
  address: string
  age: number
  password: string
}

interface UpdateUserRequest {
  email?: string
  nickName?: string
  phoneNumber?: string
  address?: string
}




export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        console.log('useLogin 호출')
        console.log('credentials', credentials)
        const response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
        console.log('response', response)
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

// 회원가입
export function useSignUp() {
  return useMutation({
    mutationFn: async (userData: SignUpRequest) => {
      try {
        console.log('useSignUp 호출')
        console.log('userData', userData)
        const response = await fetch(`${BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })

        console.log('response', response)
        // 응답 텍스트를 먼저 확인
        const responseText = await response.text()
        
        try {
          // JSON으로 파싱 시도
          const data = JSON.parse(responseText)
          
          if (!response.ok) {
            throw new Error(data.message || '회원가입 실패')
          }
          
          return data as User
        } catch (parseError) {
          console.error('Response is not JSON:', responseText)
          throw new Error('서버 응답 형식이 잘못되었습니다')
        }
      } catch (error) {
        console.error('Error during sign up:', error)
        throw error
      }
    },
  })
}

// 회원정보 조회
export function useGetUser(userId: string | number) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '회원정보 조회 실패')
      }

      return response.json() as Promise<User>
    },
  })
}

// 회원정보 수정
export function useUpdateUser(userId: string | number) {
  return useMutation({
    mutationFn: async (updateData: UpdateUserRequest) => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '회원정보 수정 실패')
      }

      return response.json() as Promise<User>
    },
  })
}

// 회원탈퇴
export function useDeleteUser(userId: string | number) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '회원탈퇴 실패')
      }

      return true
    },
  })
} 