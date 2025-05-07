import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RootNavigator from './navigations/root/RootNavigator';
import { QueryProvider } from './server/query/QueryProvider';
import { MiniPlayer } from './components/MiniPlayer';
import { usePlayerStore } from './store/usePlayerStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

const Drawer = createDrawerNavigator();

function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };

  const { 
    currentPlayingTrack, 
    isPlaying, 
    togglePlayPause,
    isLooping,
    setLooping,
    currentTrackIndex,
    currentPlaylistTracks,
    playPrevious,
    playNext,
    selectTrack
  } = usePlayerStore();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NavigationContainer theme={navTheme}>
          <QueryProvider>
            <Drawer.Navigator>
              <Drawer.Screen 
                name="Root" 
                component={RootNavigator}
                options={{
                  headerShown: false
                }}
              />
            </Drawer.Navigator>
            <MiniPlayer
              isVisible={!!currentPlayingTrack}
              songTitle={currentPlayingTrack?.musicTitle || ''}
              artistName={currentPlayingTrack?.artist || ''}
              albumArtUrl={currentPlayingTrack?.imageUrl}
              isPlaying={isPlaying}
              isLooping={isLooping}
              onPlayPause={togglePlayPause}
              onPrevious={playPrevious}
              onNext={playNext}
              onToggleLooping={() => setLooping(!isLooping)}
              onSelectTrack={(index) => selectTrack(index)}
              videoId={currentPlayingTrack?.videoId}
              currentTrackIndex={currentTrackIndex}
              totalTracks={currentPlaylistTracks.length}
              playlistTracks={currentPlaylistTracks}
            />
          </QueryProvider>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

export default App;
