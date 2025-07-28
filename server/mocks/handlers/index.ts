import { authHandlers } from './auth'
import { wordHandlers } from './words'
import { vocaHandlers } from './voca'
import { userHandlers } from './users'
import { scheduleHandlers } from './schedules'
import { playlistHandlers } from './playlists'  
import { musicHandlers } from './musics'
import { postHandlers } from './posts'
import { pointHandlers } from './points'
import { followHandlers } from './follows'


export const handlers = [
  ...authHandlers,
  ...wordHandlers,
  ...vocaHandlers,
  ...userHandlers,
  ...scheduleHandlers,
  ...playlistHandlers,
  ...musicHandlers,
  ...postHandlers,
  ...pointHandlers,
  ...followHandlers
] 