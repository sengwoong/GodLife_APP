import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PostScreen from '../../../screens/post/PostScreen';
import { PostDetailScreen } from '../../../screens/post/PostDetailScreen';
import { PostAvatarScreen } from '../../../screens/post/PostAvatarScreen';
import { PostNavigations } from '../../../constants';
import HomeHeaderLeft from '../HomeHeaderLeft';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';


export type PostStackParamList = {
  [PostNavigations.POST]: undefined;
  [PostNavigations.POSTDETAIL]: {
    postId: number;
  };
  [PostNavigations.POSTAVATAR]: {
    userId: number;
  };
  PostAvatar: { userId: number };
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
        options={({ navigation }) => ({
          headerTitle: '포스트 상세',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Icon name="left" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
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