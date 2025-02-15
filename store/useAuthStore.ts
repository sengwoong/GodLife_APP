import { create } from 'zustand';

interface User {
  username: string;
  // 필요한 다른 사용자 정보들을 여기에 추가
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

export default useAuthStore; 