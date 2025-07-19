import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';

interface MusicResponse {
  musicId: number;
  musicTitle: string;
  musicUrl: string;
  imageUrl: string;
  color: string;
  playlist: {
    playlistId: number;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MusicListResponse {
  content: MusicResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface CreateMusicData {
  musicTitle: string;
  musicUrl: string;
  imageUrl?: string;
  color?: string;
  playlistId: number;
}

interface UpdateMusicData {
  musicTitle: string;
  musicUrl: string;
  imageUrl?: string;
  color?: string;
}

// 플레이리스트 음악 목록 조회 (페이지네이션)
export function useMusicList(playlistId: number, page: number = 0, size: number = 10) {
  return useQuery<MusicListResponse>({
    queryKey: ['musicList', playlistId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'createdAt,desc'
      });
      
      const response = await fetch(`${BASE_URL}/musics/playlist/${playlistId}?${params}`);
      if (!response.ok) {
        throw new Error('음악 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: playlistId !== undefined,
  });
}

// 사용자 좋아요 음악 목록 조회
export function useLikedMusics(userId: number, page: number = 0, size: number = 10) {
  return useQuery<MusicListResponse>({
    queryKey: ['likedMusics', userId, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'createdAt,desc'
      });
      
      const response = await fetch(`${BASE_URL}/musicLikes/user/${userId}?${params}`);
      if (!response.ok) {
        throw new Error('좋아요한 음악 목록을 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: userId !== undefined,
  });
}

// 음악 좋아요 여부 확인
export function useMusicLikeStatus(musicId: number, userId: number) {
  return useQuery<boolean>({
    queryKey: ['musicLikeStatus', musicId, userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/musicLikes/check/music/${musicId}/user/${userId}`);
      if (!response.ok) {
        throw new Error('좋아요 상태를 확인할 수 없습니다');
      }
      return response.json();
    },
    enabled: musicId !== undefined && userId !== undefined,
  });
}

// 플레이리스트에 음악 추가
export function useCreateMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, userId, musicData }: { playlistId: number, userId: number, musicData: CreateMusicData }) => {
      const response = await fetch(`${BASE_URL}/musics/playlist/${playlistId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error('음악 추가에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['musicList', playlistId] });
    },
  });
}

// 음악 정보 수정
export function useUpdateMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ musicId, userId, data }: { musicId: number, userId: number, data: UpdateMusicData }) => {
      const response = await fetch(`${BASE_URL}/musics/music/${musicId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('음악 수정에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['musicList', data.playlist.playlistId] });
    },
  });
}

// 음악 삭제
export function useDeleteMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ musicId, userId, playlistId }: { musicId: number, userId: number, playlistId: number }) => {
      const response = await fetch(`${BASE_URL}/musics/music/${musicId}/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('음악 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['musicList', playlistId] });
    },
  });
}

// 음악 좋아요 추가
export function useAddMusicLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ musicId, userId }: { musicId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/musicLikes/music/${musicId}/user/${userId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('좋아요 추가에 실패했습니다');
      }
      return response.json();
    },
    onSuccess: (_, { musicId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['musicLikeStatus', musicId, userId] });
      queryClient.invalidateQueries({ queryKey: ['likedMusics', userId] });
    },
  });
}

// 음악 좋아요 삭제
export function useRemoveMusicLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ musicId, userId }: { musicId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/musicLikes/music/${musicId}/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('좋아요 삭제에 실패했습니다');
      }
    },
    onSuccess: (_, { musicId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['musicLikeStatus', musicId, userId] });
      queryClient.invalidateQueries({ queryKey: ['likedMusics', userId] });
    },
  });
}