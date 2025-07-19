import 'react-native-gesture-handler';
import React, { useState } from 'react';
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

  const [currentScreen, setCurrentScreen] = useState<string | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NavigationContainer 
          theme={navTheme}
          onStateChange={(state) => {
            if (state) {
              const currentRoute = state.routes[state.index];
              if (currentRoute?.state?.routes && currentRoute.state.index !== undefined) {
                const nestedRoute = currentRoute.state.routes[currentRoute.state.index];
                if (nestedRoute?.state?.routes && nestedRoute.state.index !== undefined) {
                  const finalRoute = nestedRoute.state.routes[nestedRoute.state.index];
                  setCurrentScreen(finalRoute?.name || null);
                } else {
                  setCurrentScreen(nestedRoute?.name || null);
                }
              } else {
                setCurrentScreen(currentRoute?.name || null);
              }
            }
          }}
        >
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
              videoId={currentPlayingTrack?.videoId || undefined}
              currentTrackIndex={currentTrackIndex}
              totalTracks={currentPlaylistTracks.length}
              playlistTracks={currentPlaylistTracks.map(track => ({
                id: typeof track.id === 'string' ? parseInt(track.id) : track.id,
                musicTitle: track.musicTitle,
                artist: track.artist || '',
                imageUrl: track.imageUrl,
                videoId: track.videoId || undefined
              }))}
              currentScreen={currentScreen || undefined}
            />
          </QueryProvider>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

export default App;
