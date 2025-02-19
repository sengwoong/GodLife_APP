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
  startTime: string
  endTime: string
}

export interface PlaylistRequest {
  playListTitle: string
}

export interface MusicRequest {
  musicTitle: string
  musicUrl: string
}

export interface AlarmRequest {
  alarmTitle: string
  alarmContent: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
} 