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
    VOCAMAIN: 'VocaMainMain',
    VOCACONTENT: 'VocaContent',
    WORDCONTENTEDIT: 'WordContentEdit',
    VOCACONTENTEDIT: 'VocaContentEdit',
    } as const;
  
const CalendarNavigations = {
    CALENDAR: 'CalendarMain',
    CALENDAREDIT: 'CalendarEdit',
    } as const;

const PlayListNavigations = {
    PLAYLIST: 'PlayListMain',
    PLAYLISTCONTENT: 'PlayListContent',
    PLAYLISTEDIT: 'PlayListEdit',
    } as const;
    
const MainNavigations = {
  MAIN: 'MainPage',
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
  RECENTPLAYLIST: 'RecentPlaylist',
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
