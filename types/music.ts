export interface Music {
    id: string;
    musicTitle: string;
    musicUrl: string;
    color: string;
    imageUrl: string;
} 

export interface MusicLike {
    id: string;
    musicId: string;
    userId: string;
}
  