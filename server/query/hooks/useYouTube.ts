import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

export function useYouTubePlaylists(accessToken: string) {
  return useQuery({
    queryKey: ['youtubePlaylists', accessToken],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/youtube/playlists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('유튜브 재생목록을 가져오는데 실패했습니다');
      }
      return response.json();
    },
    enabled: !!accessToken,
  });
}

export function useYouTubePlaylistItems(playlistId: string, accessToken: string) {
  return useQuery({
    queryKey: ['youtubePlaylistItems', playlistId, accessToken],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/youtube/playlists/${playlistId}/items`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('재생목록 항목을 가져오는데 실패했습니다');
      }
      return response.json();
    },
    enabled: !!playlistId && !!accessToken,
  });
} 