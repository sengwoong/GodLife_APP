import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import { PlayListNavigations} from '../../../constants';
import HomeHeaderLeft from '../HomeHeaderLeft';
import PlayListContentScreen from '../../../screens/playlist/PlayListContentScreen';
import MusicListEditScreen from '../../../screens/playlist/MusicEditScreen';
import PlayListScreen from '../../../screens/playlist/PlayListScreen';

export type PlayListStackParamList = {
  [PlayListNavigations.PLAYLIST]:undefined;
  [PlayListNavigations.PLAYLISTCONTENT]: {playListIndex: number };
  [PlayListNavigations.MUSICEDIT]:  {Index: number | undefined};
}
const Stack = createStackNavigator<PlayListStackParamList>();

function PlayListStackNavigator() {
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
        name={PlayListNavigations.PLAYLIST}
        component={PlayListScreen}
        options={(navigation) => ({
          headerTitle: '플레이리스트',
          headerLeft: () => HomeHeaderLeft(),
        })}
      />
      <Stack.Screen
        name={PlayListNavigations.PLAYLISTCONTENT}
        component={PlayListContentScreen}
        options={{
          headerShown: true,
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={PlayListNavigations.MUSICEDIT}
        component={MusicListEditScreen}
        options={{
          headerShown: true,
          headerTitle: ' ',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default PlayListStackNavigator;
