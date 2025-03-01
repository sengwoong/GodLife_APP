export interface Playlist {
    id: number;
    playlistTitle: string;
    imageUrl: string;
    createdAt: string;
    isShared: boolean;
  }
  
export interface PlaylistShareRequest {
  isShared: boolean;
}
  

