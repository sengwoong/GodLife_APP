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
  FEED: 'Feed'
} as const;

const VocaNavigations = {
    VOCAMAIN: 'VocaMainMain',
    VOCACONTENT: 'VocaContent',
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

const FeedNavigations = {
  FEED: 'FeedMain',
  FEEDDETAIL: 'FeedDetail',
  FEEDAVATAR: 'FeedAvatar',
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
} as const;

export { 
  VocaNavigations,
  authNavigations,
  drawerNavigations,
  CalendarNavigations,
  PlayListNavigations,
  MainNavigations,
  FeedNavigations
};
