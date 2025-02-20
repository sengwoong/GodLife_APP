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

export function useInfinitePlayList(searchText: string) {
  return useInfiniteQuery<PlaylistResponse, Error>({
    queryKey: ['playlists', searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/playlists?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
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

export function useDeletePlayList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: number) => {
      const response = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }
      return response.json();
    },
    onSuccess: () => {
      // 삭제 성공 시 플레이리스트 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
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

export function useCreatePlayList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({playlistData, userId}: {playlistData: Omit<Playlist, 'id'>, userId: number}) => {
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


export function usePlayList(playListIndex: number) {
  return useQuery({
    queryKey: ['playlists', playListIndex],
    queryFn: () => fetch(`${BASE_URL}/playlists/${playListIndex}`).then(res => res.json()),
  });
}

