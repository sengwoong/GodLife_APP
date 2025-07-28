export interface User {
    id: string | number
    email: string
    nickName: string
    phoneNumber: string
    address: string
    profileImage: string
    bio: string
    level: number
    followers: number
    following: number
}

export interface UserResponse {
  id: number;
  email: string;
  nickName: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  bio?: string;
  level: number;
  followers: number;
  following: number;
  sales: number;
  createdAt: string;
}

export interface FollowResponse {
  followerId: number;
  followingId: number;
  isFollowing: boolean;
  createdAt?: string;
  followerCount: number;
  followingCount: number;
}