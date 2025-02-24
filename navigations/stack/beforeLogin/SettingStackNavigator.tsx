import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeHeaderLeft from '../HomeHeaderLeft';
import SettingScreen from '../../../screens/setting/SettingScreen';

import { SettingNavigations } from '../../../constants';

// 새로운 스크린들 import
import PointHistoryScreen from '../../../screens/setting/points/PointHistoryScreen';
import ImportScreen from '../../../screens/setting/playlist/ImportPlaylistScreen';
import StudyWordsScreen from '../../../screens/setting/words/StudyWordsScreen';
import PointUsageScreen from '../../../screens/setting/points/PointUsageScreen';
import PurchasedWordsScreen from '../../../screens/setting/words/PurchasedWordsScreen';
import MyWordsScreen from '../../../screens/setting/words/MyWordsScreen';
import PostCommentsScreen from '../../../screens/setting/post/PostCommentsScreen';
import PostAdsScreen from '../../../screens/setting/post/PostAdsScreen';
import PostShareScreen from '../../../screens/setting/post/PostShareScreen';
import ImportPlaylistScreen from '../../../screens/setting/playlist/ImportPlaylistScreen';
import LikedPlaylistScreen from '../../../screens/setting/playlist/LikedPlaylistScreen';
import MyPlaylistScreen from '../../../screens/setting/playlist/MyPlaylistScreen';

export type SettingStackParamList = {
  [SettingNavigations.SETTING]: undefined;
  [SettingNavigations.IMPORTPLAYLIST]: undefined;
  [SettingNavigations.POINTHISTORY]: undefined;
  [SettingNavigations.POINTUSAGE]: undefined;
  [SettingNavigations.IMPORT]: undefined;
  [SettingNavigations.MYPLAYLIST]: undefined;
  [SettingNavigations.LIKEDPLAYLIST]: undefined;
  [SettingNavigations.STUDYWORDS]: undefined;
  [SettingNavigations.MYWORDS]: undefined;
  [SettingNavigations.POSTCOMMENTS]: undefined;
  [SettingNavigations.POSTADS]: undefined;
  [SettingNavigations.POSTSHARE]: undefined;
};

const Stack = createStackNavigator<SettingStackParamList>();

function SettingStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          shadowColor: 'gray',
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: 'black',
      }}>
      <Stack.Screen
        name={SettingNavigations.SETTING}
        component={SettingScreen}
        options={{
          headerTitle: '설정',
          headerLeft: () => <HomeHeaderLeft />,
        }}
      />
      <Stack.Screen
        name={SettingNavigations.IMPORTPLAYLIST}
        component={ImportPlaylistScreen}
        options={{
          headerShown: true,
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.POINTHISTORY}
        component={PointHistoryScreen}
        options={{
          headerTitle: '포인트 적립 내역',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.POINTUSAGE}
        component={PointUsageScreen}
        options={{
          headerTitle: '포인트 사용 내역',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.IMPORT}
        component={ImportScreen}
        options={{
          headerTitle: '최근 재생목록',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.MYPLAYLIST}
        component={MyPlaylistScreen}
        options={{
          headerTitle: '내 플레이리스트',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.LIKEDPLAYLIST}
        component={LikedPlaylistScreen}
        options={{
          headerTitle: '찜한 곡',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.STUDYWORDS}
        component={StudyWordsScreen}
        options={{
          headerTitle: '공부할 단어',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.MYWORDS}
        component={MyWordsScreen}
        options={{
          headerTitle: '나의 단어',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.POSTCOMMENTS}
        component={PostCommentsScreen}
        options={{
          headerTitle: '포스트 댓글 관리',
        }}
      />
      <Stack.Screen
        name={SettingNavigations.POSTADS}
        component={PostAdsScreen}
        options={{
          headerTitle: '포스트 광고 관리',
        }}
      />

      <Stack.Screen
        name={SettingNavigations.POSTSHARE}
        component={PostShareScreen}
        options={{
          headerTitle: '포스트 친구에게 전송',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default SettingStackNavigator; 