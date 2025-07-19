export interface YouTubeTrack {
  id: string | number; // 백엔드의 음악 ID (musicId와 동일)
  musicId: string | number; // 백엔드의 음악 ID
  musicUrl: string;    // 원본 유튜브 URL
  musicTitle: string;
  imageUrl?: string;
  videoId?: string | null; // 추출된 유튜브 비디오 ID
  duration?: number;     // (선택적) 미리 알고 있는 경우
  playListIdContext?: string | number; // 이 트랙이 속한 플레이리스트 ID
  artist?: string; // 아티스트 정보가 있다면 추가
  // 기타 필요한 필드
} 