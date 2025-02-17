import { useInfiniteQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface Playlist {
  id: number;
  title: string;
}

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