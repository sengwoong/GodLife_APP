export interface YouTubePlaylist {
  playlistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
}

export interface YouTubePlaylistItem {
  playlistItemId: string;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  duration: string;
} 