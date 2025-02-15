import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PostScreen from '../../../screens/post/PostScreen';
import { PostDetailScreen } from '../../../screens/post/PostDetailScreen';
import { PostAvatarScreen } from '../../../screens/post/PostAvatarScreen';
import { PostNavigations } from '../../../constants';
import HomeHeaderLeft from '../HomeHeaderLeft';


export type PostStackParamList = {
  [PostNavigations.POST]: undefined;
  [PostNavigations.POSTDETAIL]: {
    post: {
      id: string;
      userName: string;
      profileImage: string;
      postContent: string;
      postImage: string;
    };
  };
  [PostNavigations.POSTAVATAR]: {
    userName: string;
  };
};

const Stack = createStackNavigator<PostStackParamList>();

function PostStackNavigator() {
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
        name={PostNavigations.POST}
        component={PostScreen}
        options={{
          headerTitle: '포스트',
          headerLeft: () => <HomeHeaderLeft />,
        }}
      />
      <Stack.Screen
        name={PostNavigations.POSTDETAIL}
        component={PostDetailScreen}
        options={{
          headerTitle: '포스트 상세',
        }}
      />
      <Stack.Screen
        name={PostNavigations.POSTAVATAR}
        component={PostAvatarScreen}
        options={{
          headerTitle: '프로필',
        }}
      />
    </Stack.Navigator>
  );
}

export default PostStackNavigator; 