import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeHeaderLeft from '../HomeHeaderLeft';
import SettingScreen from '../../../screens/setting/SettingScreen';
import ImportPlaylistScreen from '../../../screens/setting/ImportPlaylistScreen';
import { SettingNavigations } from '../../../constants';

// 새로운 스크린들 import
import PointHistoryScreen from '../../../screens/setting/PointHistoryScreen';
import RecentPlaylistScreen from '../../../screens/setting/RecentPlaylistScreen';
import LikedPlaylistScreen from '../../../screens/setting/LikedPlaylistScreen';
import StudyWordsScreen from '../../../screens/setting/StudyWordsScreen';
import PointUsageScreen from '../../../screens/setting/PointUsageScreen';
import MyPlaylistScreen from '../../../screens/setting/MyPlaylistScreen';
import PurchasedWordsScreen from '../../../screens/setting/PurchasedWordsScreen';
import MyWordsScreen from '../../../screens/setting/MyWordsScreen';
import PostCommentsScreen from '../../../screens/setting/PostCommentsScreen';
import PostAdsScreen from '../../../screens/setting/PostAdsScreen';
import PostShareScreen from '../../../screens/setting/PostShareScreen';

export type SettingStackParamList = {
  [SettingNavigations.SETTING]: undefined;
  [SettingNavigations.IMPORTPLAYLIST]: undefined;
  [SettingNavigations.POINTHISTORY]: undefined;
  [SettingNavigations.POINTUSAGE]: undefined;
  [SettingNavigations.RECENTPLAYLIST]: undefined;
  [SettingNavigations.MYPLAYLIST]: undefined;
  [SettingNavigations.LIKEDPLAYLIST]: undefined;
  [SettingNavigations.STUDYWORDS]: undefined;
  [SettingNavigations.PURCHASEDWORDS]: undefined;
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
        name={SettingNavigations.RECENTPLAYLIST}
        component={RecentPlaylistScreen}
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
        name={SettingNavigations.PURCHASEDWORDS}
        component={PurchasedWordsScreen}
        options={{
          headerTitle: '구매한 단어',
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