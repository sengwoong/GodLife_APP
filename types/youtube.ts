export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
}

export interface YouTubePlaylistItem {
  id: string;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  duration: string;
} 