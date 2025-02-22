import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { BasePost } from '../../../types/post';
import { Voca } from '../../../types/voca';
import { Playlist } from '../../../types/playlist';
import { Music } from '../../../types/music';

interface UserResponse {
  id: string | number;
  email: string;
  nickName: string;
  phoneNumber: string;
  address: string;
  profileImage: string;
  bio: string;
  level: number;
  followers: number;
  following: number;
}

interface UserPostsResponse {
  id: string | number;
  posts: (BasePost & { type: 'post' })[];
  vocas: (Voca & { type: 'voca' })[];
  playlists: (Playlist & { type: 'playlist' })[];
  allItems: (BasePost | Voca | Playlist & { type: string })[];
  totalPages: number;
  size: number;
}

interface BestUserResponse {
  users: UserResponse[];
}

interface RecommendContentResponse {
  posts: (BasePost & { type: 'post' })[];
  vocas: (Voca & { type: 'voca' })[];
  playlists: (Playlist & { type: 'playlist' })[];
  musics: (Music & { type: 'music' })[];
  allItems: (BasePost | Voca | Playlist | Music & { type: string })[];
  totalPages: number;
  size: number;
}

export const useUser = (userId: string) => {
  return useQuery<UserResponse>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
  });
};

export const useUserAllPosts = (userId: string, page: number, pageSize: number) => {
  return useQuery<UserPostsResponse>({
    queryKey: ['userAllPosts', userId, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/user/${userId}/posts?page=${page}&size=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      return response.json();
    },
  });
};

export const useBestUsers = () => {
  return useQuery<BestUserResponse>({
    queryKey: ['bestUsers'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/best`);
      if (!response.ok) {
        throw new Error('Failed to fetch best users');
      }
      return response.json();
    },
  });
};

export const useUserRecommend = (page: number, pageSize: number) => {
  return useQuery<RecommendContentResponse>({
    queryKey: ['userRecommend', page, pageSize],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/recommend?page=${page}&size=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommended content');
      }
      return response.json();
    },
  });
};    