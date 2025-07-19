import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Playlist {
  playlistId: number;
  playlistTitle: string;
  imageUrl: string;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistResponse {
  content: Playlist[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface CreatePlaylistData {
  playListTitle: string;
}

interface UpdatePlaylistData {
  playListTitle: string;
}

// 사용자 플레이리스트 목록 조회 (페이지네이션)
export function useUserPlaylists(userId: number, searchText: string, page: number = 0, size: number = 10) {
  return useQuery<PlaylistResponse>({
    queryKey: ['userPlaylists', userId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'createdAt,desc',
        searchText: searchText
      });
      
      const response = await fetch(`${BASE_URL}/playlists/user/${userId}?${params}`);
      if (!response.ok) {
        throw new Error('플레이리스트 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 공유된 플레이리스트 목록 조회
export function useSharedPlaylists(page: number = 0, size: number = 10) {
  return useQuery<PlaylistResponse>({
    queryKey: ['sharedPlaylists', page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'createdAt,desc'
      });
      
      const response = await fetch(`${BASE_URL}/playlists/shared?${params}`);
      if (!response.ok) {
        throw new Error('공유 플레이리스트 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
  });
}

// 플레이리스트 생성
export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playlistData, userId }: { playlistData: CreatePlaylistData, userId: number }) => {
      const response = await fetch(`${BASE_URL}/playlists/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
      });
      if (!response.ok) {
        throw new Error('플레이리스트 생성에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPlaylists', userId] });
    },
  });
}

// 플레이리스트 수정
export function useUpdatePlaylist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      playlistId, 
      userId,
      data
    }: {
      playlistId: number;
      userId: number;
      data: UpdatePlaylistData;
    }) => {
      const response = await fetch(`${BASE_URL}/playlists/playlist/${playlistId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('플레이리스트 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPlaylists', userId] });
    },
  });
}

// 플레이리스트 공유 토글
export function useTogglePlaylistShare() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      playlistId, 
      userId
    }: { 
      playlistId: number;
      userId: number;
    }) => {
      const response = await fetch(`${BASE_URL}/playlists/${playlistId}/share?user_id=${userId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('플레이리스트 공유 상태 변경에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPlaylists', userId] });
      queryClient.invalidateQueries({ queryKey: ['sharedPlaylists'] });
    },
  });
}

// 플레이리스트 삭제
export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playlistId, userId }: { playlistId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/playlists/playlist/${playlistId}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('플레이리스트 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['userPlaylists', userId] });
    },
  });
}


