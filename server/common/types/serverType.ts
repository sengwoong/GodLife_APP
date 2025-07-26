export interface LoginRequest {
  email: string
  password: string
}

export interface WordRequest {
  word: string
  meaning: string
  vocaId: number
}

export interface VocaRequest {
  vocaTitle: string
  description: string
  languages: string
}

export interface UserRequest {
  email: string
  password: string
  nickName: string
}

export interface UpdateUserRequest {
  nickName: string
  phoneNumber: string
  address: string
  email: string
}



export interface ScheduleRequest {
  scheduleTitle: string
  content: string
  startTime: string
  endTime: string
  day: string
  hasAlarm: boolean
}

export interface PlaylistRequest {
  playListTitle: string
}

export interface MusicRequest {
  musicTitle: string
  musicUrl: string
}



export interface PostRequest {
  title: string
  content: string
  imageUrl?: string
}

export interface CommentRequest {
  content: string
  postId: number
}



export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
} 