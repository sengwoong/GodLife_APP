const authNavigations = {
  HOME: 'Home',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
} as const;

const drawerNavigations = {
  PLAYLIST: 'PlayList',
  CALENDAR: 'Calendar',
  SETTING: 'Setting',
  VOCA: 'Voca',
  MAIN: 'Main',
  POST: 'Post'
} as const;
  
const VocaNavigations = {
  VOCAAIGENERATE: 'VOCAAIGENERATE',
  VOCA: 'VOCA',
  VOCACONTENT: 'VOCACONTENT',
  VOCACONTENTEDIT: 'VOCACONTENTEDIT',
  VOCAEDIT: 'VOCAEDIT',
  WORDEDIT: 'WORDEDIT',
  VOCAGAME: 'VOCAGAME',
} as const;
  
const CalendarNavigations = {
    CALENDAR: 'CalendarMain',
    CALENDAREDIT: 'CalendarEdit',
    } as const;

const PlayListNavigations = {
    PLAYLIST: 'PlayList',
    PLAYLISTCONTENT: 'PlayListContent',
    PLAYLISTEDIT: 'PlaylistEdit',
    MUSICEDIT: 'MusicEdit',
    NOW_PLAYING: 'NowPlaying',
} as const;
    
const MainNavigations = {
  MAIN: 'Main',
  POST_DETAIL: 'PostDetail'
} as const;

const PostNavigations = {
  POST: 'PostMain',
  POSTDETAIL: 'PostDetail',
  POSTAVATAR: 'PostAvatar',
} as const;

export const SettingNavigations = {
  SETTING: 'SettingMain',
  IMPORTPLAYLIST: 'ImportPlaylist',
  POINTHISTORY: 'PointHistory',
  POINTUSAGE: 'PointUsage',
  IMPORT: 'Import',
  MYPLAYLIST: 'MyPlaylist',
  LIKEDPLAYLIST: 'LikedPlaylist',
  STUDYWORDS: 'StudyWords',
  PURCHASEDWORDS: 'PurchasedWords',
  MYWORDS: 'MyWords',
  POSTCOMMENTS: 'PostComments',
  POSTADS: 'PostAds',
  POSTSHARE: 'PostShare',
} as const;

export { 
  VocaNavigations,
  authNavigations,
  drawerNavigations,
  CalendarNavigations,
  PlayListNavigations,
  MainNavigations,
  PostNavigations
};
