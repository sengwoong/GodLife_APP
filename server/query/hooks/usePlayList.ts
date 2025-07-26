import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Playlist } from '../../../types/playlist';

interface PlaylistResponse {
  content: Playlist[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useCreatePlayList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({playlistData, userId}: {playlistData: Omit<Playlist, 'id' | 'createdAt'>, userId: number}) => {
      const response = await fetch(`${BASE_URL}/playlists/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
      });
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

export function useSelectPlaylistShare(userId: number) {
  return useQuery({
    queryKey: ['playlists', 'share', userId],
    queryFn: () => fetch(`${BASE_URL}/playlists/share/user/${userId}`).then(res => res.json()),
  });
}

export function useUserPlaylist({ userId, searchText = '', page = 0, size = 10 }: UserPlaylistParams) {
  return useInfiniteQuery<PlaylistResponse, Error>({
    queryKey: ['userPlaylist', userId, searchText, page, size],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/playlists/user/${userId}?page=${pageParam}&size=${size}&search=${encodeURIComponent(searchText)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      return response.json() as Promise<PlaylistResponse>;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });
}

export function usePlayList(playListIndex: number, userId: number) {
  return useQuery({
    queryKey: ['playlists', playListIndex, userId],
    queryFn: () => fetch(`${BASE_URL}/playlists/playlist/${playListIndex}/user/${userId}`).then(res => res.json()),
  });
}

export function useUpdatePlayList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      playlistId, 
      playlistTitle,
      description,
      imageUrl,
      userId
    }: {
      playlistId: number;
      playlistTitle: string;
      description: string;
      imageUrl: string;
      userId: number;
    }) => {
      const response = await fetch(`${BASE_URL}/playlists/playlist/${playlistId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistTitle, description, imageUrl }),
      });
      if (!response.ok) {
        throw new Error('Failed to update playlist');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

export function useUpdatePlaylistShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      playlistId, 
      userId, 
      isShared 
    }: { 
      playlistId: number;
      userId: string | number;
      isShared: boolean;
    }) => {
      const response = await fetch(`${BASE_URL}/playlists/share/${playlistId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isShared }),
      });
      if (!response.ok) {
        throw new Error('플레이리스트 공유 상태 업데이트에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] });
    },
  });
}

export function useDeletePlayList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, userId }: { playlistId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/playlists/playlist/${playlistId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

export interface UserPlaylistParams {
  userId: string | number;
  searchText?: string;
  page?: number;
  size?: number;
}


