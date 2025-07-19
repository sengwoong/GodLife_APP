export interface Playlist {
    playlistId: number;
    playlistTitle: string;
    imageUrl: string;
    createdAt: string;
    shared: boolean;
  }
  
export interface PlaylistShareRequest {
  isShared: boolean;
}
  

