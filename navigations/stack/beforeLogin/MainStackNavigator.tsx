import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainNavigations } from '../../../constants';
import HomeHeaderLeft from '../HomeHeaderLeft';
import MainScreen from '../../../screens/main/MainScreen';
import { PostDetailScreen } from '../../../screens/post/PostDetailScreen';

export type mainStackParamList = {
  [MainNavigations.MAIN]: undefined;
  [MainNavigations.POST_DETAIL]: { postId: number };
};

const Stack = createNativeStackNavigator<mainStackParamList>();

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={MainNavigations.MAIN}
        component={MainScreen}
        options={{
          headerShown: true,
          headerLeft: () => <HomeHeaderLeft />,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
      <Stack.Screen
        name={MainNavigations.POST_DETAIL}
        component={PostDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '게시글 상세',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default MainStackNavigator;
