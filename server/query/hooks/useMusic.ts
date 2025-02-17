import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
import { Music } from '../../../types/music';



interface MusicResponse {
  content: Music[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export function useInfiniteMusic(albumId: number, searchText: string) {
  return useInfiniteQuery<MusicResponse, Error>({
    queryKey: ['musics', albumId, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`${BASE_URL}/musics/album/${albumId}?page=${pageParam}&search=${encodeURIComponent(searchText)}`);
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

export function useMusic(albumId: number, musicIndex: number) {
  return useQuery<Music, Error>({
    queryKey: ['music', albumId, musicIndex],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/musics/album/${albumId}?index=${musicIndex}`);
      if (!response.ok) {
        throw new Error('Failed to fetch music');
      }
      const data = await response.json();
      return data.content[0];
    },
    enabled: musicIndex !== undefined,
  });
} 