import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Music } from '../../../types/music';



interface MusicResponse {
  content: Music[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useInfiniteMusic(playlistId: number, searchText: string) {
  return useInfiniteQuery<MusicResponse, Error>({
    queryKey: ['musics', playlistId, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/musics/playlist/${playlistId}?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch musics');
      }
      return response.json() as Promise<MusicResponse>;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });
}

export function useMusic(playlistId: number, musicId: number) {
  return useQuery<Music, Error>({
    queryKey: ['music', playlistId, musicId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/musics/playlist/${playlistId}?id=${musicId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch music');
      }
      const data = await response.json();
      return data.content[0];
    },
    enabled: musicId !== undefined,
  });
}

export function useSingleMusic(musicId: number) {
  return useQuery<Music, Error>({
    queryKey: ['music', musicId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/musics/${musicId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch music');
      }
      return response.json();
    },
    enabled: !!musicId,
  });
}

export function useCreateMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, ...musicData }: Partial<Music> & { playlistId: number }) => {
      const response = await fetch(`${BASE_URL}/musics/playlist/${playlistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error('Failed to create music');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['musics', variables.playlistId] });
    },
  });
}

export function useUpdateMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, musicId,userId, ...musicData }: Partial<Music> & { playlistId: number, musicId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/musics/playlist/${playlistId}/music/${musicId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error('Failed to update music');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['music', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['musics'] });
    },
  });
} 