import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FeedScreen from '../../../screens/feed/FeedScreen';
import { FeedDetailScreen } from '../../../screens/feed/FeedDetailScreen';
import FeedAvatarScreen from '../../../screens/feed/FeedAvatarScreen';
import { FeedNavigations } from '../../../constants';
import HomeHeaderLeft from '../HomeHeaderLeft';


export type FeedStackParamList = {
  [FeedNavigations.FEED]: undefined;
  [FeedNavigations.FEEDDETAIL]: {
    post: {
      id: string;
      userName: string;
      profileImage: string;
      postContent: string;
      postImage: string;
    };
  };
  [FeedNavigations.FEEDAVATAR]: {
    userName: string;
  };
};

const Stack = createStackNavigator<FeedStackParamList>();

function FeedStackNavigator() {
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
        name={FeedNavigations.FEED}
        component={FeedScreen}
        options={{
          headerTitle: '피드',
          headerLeft: () => <HomeHeaderLeft />,
        }}
      />
      <Stack.Screen
        name={FeedNavigations.FEEDDETAIL}
        component={FeedDetailScreen}
        options={{
          headerTitle: '피드 상세',
        }}
      />
      <Stack.Screen
        name={FeedNavigations.FEEDAVATAR}
        component={FeedAvatarScreen}
        options={{
          headerTitle: '피로필',
        }}
      />
    </Stack.Navigator>
  );
}

export default FeedStackNavigator; 