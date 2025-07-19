import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  nickName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage?: string;
  level?: number;
  // 필요한 다른 사용자 정보들을 여기에 추가
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 1, 
    username: 'testuser',
    nickName: '테스트유저',
    email: 'test@example.com',
    phoneNumber: '010-1234-5678',
    address: '서울시 강남구',
    profileImage: 'https://example.com/avatar.png',
    level: 1
  },
  token: 'hardcoded-token-123',
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

export default useAuthStore; 