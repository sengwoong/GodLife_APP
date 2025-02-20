import { authHandlers } from './auth'
import { wordHandlers } from './words'
import { vocaHandlers } from './voca'
import { userHandlers } from './users'
import { scheduleHandlers } from './schedules'
import { playlistHandlers } from './playlists'
import { alarmHandlers } from './alarms'
import { musicHandlers } from './musics'
import { postHandlers } from './posts'


export const handlers = [
  ...authHandlers,
  ...wordHandlers,
  ...vocaHandlers,
  ...userHandlers,
  ...scheduleHandlers,
  ...playlistHandlers,
  ...musicHandlers,
  ...alarmHandlers,
  ...postHandlers
] 