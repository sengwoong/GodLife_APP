import { create } from 'zustand';
import { YouTubeTrack } from '../types/player'; // 방금 정의한 타입 import
import { PLAYER_STATES } from 'react-native-youtube-iframe';

// 유튜브 URL에서 Video ID를 추출하는 헬퍼 함수 (NowPlayingScreen에서도 사용되므로 공유 가능)
function getYouTubeVideoIdFromUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface PlayerState {
  currentPlaylistTracks: YouTubeTrack[];
  currentTrackIndex: number;
  currentPlayingTrack: YouTubeTrack | null;
  isPlaying: boolean; // 사용자가 의도한 재생 상태
  actualPlayerState: PLAYER_STATES | null; // YoutubeIframe의 실제 상태
  showMiniPlayer: boolean;
  currentTime: number;
  duration: number;
  isLooping: boolean; // 단일 곡 반복 또는 전체 목록 반복 (여기서는 단일 곡 반복으로 가정)

  startPlaylist: (tracks: YouTubeTrack[], startIndex: number, playListIdContext: string | number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  setPlayingState: (playing: boolean) => void; // NowPlayingScreen에서 직접 호출 가능
  setActualPlayerState: (state: PLAYER_STATES) => void;
  updateProgress: (time: number, newDuration?: number) => void;
  setLooping: (loop: boolean) => void;
  hideMiniPlayerAndStop: () => void;
  selectTrack: (index: number) => void;
  // seek 액션은 컴포넌트에서 직접 playerRef.seekTo 후 updateProgress 호출
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentPlaylistTracks: [],
  currentTrackIndex: -1,
  currentPlayingTrack: null,
  isPlaying: false,
  actualPlayerState: null,
  showMiniPlayer: false,
  currentTime: 0,
  duration: 0,
  isLooping: false,

  startPlaylist: (tracks, startIndex, playListIdContext) => {
    const validStartIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));
    const tracksWithVideoId = tracks.map(t => ({
      ...t,
      videoId: getYouTubeVideoIdFromUrl(t.musicUrl),
      playListIdContext: playListIdContext // 모든 트랙에 컨텍스트 ID 부여
    }));
    const newCurrentTrack = tracksWithVideoId[validStartIndex] || null;

    set({
      currentPlaylistTracks: tracksWithVideoId,
      currentTrackIndex: newCurrentTrack ? validStartIndex : -1,
      currentPlayingTrack: newCurrentTrack,
      isPlaying: !!newCurrentTrack, // 트랙이 있으면 재생 시작
      showMiniPlayer: !!newCurrentTrack,
      currentTime: 0,
      duration: newCurrentTrack?.duration || 0, // 미리 알고 있는 duration 사용 또는 0
      actualPlayerState: null, // 초기화
    });
  },

  playNext: () => {
    const { currentPlaylistTracks, currentTrackIndex, isLooping, currentPlayingTrack } = get();
    if (!currentPlayingTrack) return; // 현재 재생 중인 곡이 없으면 아무것도 안 함

    // 현재 곡 반복이 아니라면 다음 곡으로
    if (!isLooping) {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= currentPlaylistTracks.length) {
        // 플레이리스트의 끝에 도달
        // TODO: 플레이리스트 반복 옵션이 있다면 여기서 처리
        set({ isPlaying: false }); // 일단 정지
        return;
      }
      set({
        currentTrackIndex: nextIndex,
        currentPlayingTrack: currentPlaylistTracks[nextIndex],
        currentTime: 0,
        duration: currentPlaylistTracks[nextIndex]?.duration || 0,
        isPlaying: true,
      });
    } else {
      // 현재 곡 반복 (isLooping = true)
      // NowPlayingScreen의 onStateChange에서 seekTo(0)으로 처리되므로, 여기서는 상태만 유지
      set({ isPlaying: true, currentTime: 0 }); // 시간 초기화 및 재생 상태 유지
    }
  },

  playPrevious: () => {
    const { currentPlaylistTracks, currentTrackIndex } = get();
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      set({
        currentTrackIndex: prevIndex,
        currentPlayingTrack: currentPlaylistTracks[prevIndex],
        currentTime: 0,
        duration: currentPlaylistTracks[prevIndex]?.duration || 0,
        isPlaying: true,
      });
    }
    // 첫 곡이면 아무것도 안하거나, 플레이리스트의 마지막으로 가는 로직 추가 가능
  },

  togglePlayPause: () => {
    const { isPlaying, currentPlayingTrack } = get();
    if (!currentPlayingTrack && !isPlaying && get().currentPlaylistTracks.length > 0) {
      // 멈춘 상태이고, 재생목록은 있는데 현재 선택된 곡이 없다면 첫 곡부터 재생
      get().startPlaylist(get().currentPlaylistTracks, 0, get().currentPlaylistTracks[0].playListIdContext!);
    } else {
      set({ isPlaying: !isPlaying });
    }
  },

  setPlayingState: (playing) => set({ isPlaying: playing }),

  setActualPlayerState: (state) => {
    set({ actualPlayerState: state });
    if (state === PLAYER_STATES.ENDED) {
      // isLooping은 NowPlayingScreen의 onStateChange에서 playerRef.seekTo(0)으로 처리.
      // 여기서는 다음 곡으로 넘어가는 로직만 처리.
      if (!get().isLooping) {
        get().playNext();
      } else {
        // 단일 곡 반복 시, isPlaying을 true로 유지하고 currentTime을 0으로 설정
        // 실제 seekTo(0)은 NowPlayingScreen에서 담당
        set(prevState => ({ ...prevState, isPlaying: true, currentTime: 0 }));
      }
    }
    if (state === PLAYER_STATES.PLAYING) {
        set({isPlaying: true});
    }
    if (state === PLAYER_STATES.PAUSED) {
        set({isPlaying: false});
    }
  },

  updateProgress: (time, newDuration) => {
    set(state => ({
      currentTime: time,
      duration: newDuration !== undefined ? newDuration : state.duration,
    }));
  },

  setLooping: (loop) => set({ isLooping: loop }),

  hideMiniPlayerAndStop: () => {
    set({
      showMiniPlayer: false,
      isPlaying: false,
      currentPlayingTrack: null,
      currentPlaylistTracks: [],
      currentTrackIndex: -1,
      currentTime: 0,
      duration: 0,
      actualPlayerState: PLAYER_STATES.ENDED, // 또는 적절한 상태
    });
  },

  selectTrack: (index: number) => {
    const { currentPlaylistTracks } = get();
    
    if (index >= 0 && index < currentPlaylistTracks.length) {
      set({
        currentTrackIndex: index,
        currentPlayingTrack: currentPlaylistTracks[index],
        isPlaying: true, // 선택 시 바로 재생 시작
        currentTime: 0, // 시간 초기화
      });
    }
  },
})); 