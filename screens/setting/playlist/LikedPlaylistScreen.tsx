import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaylistLayout from '../../../components/common/MusicListPlay/MusicListLayout';

interface PlaylistItem {
  id: number;
  title: string;
  artist: string;
  color: string;
}

const likedSongs: PlaylistItem[] = [
  {
    id: 1,
    title: '좋아요 한 노래 1',
    artist: '아티스트 1',
    color: '#FFFFFF',
  },
  {
    id: 2,
    title: '좋아요 한 노래 2',
    artist: '아티스트 2',
    color: '#FFFFFF',
  },
];

function LikedPlaylistScreen() {
  const handlePlayAll = () => {
    console.log('Play all songs');
  };

  const handleShuffle = () => {
    console.log('Shuffle songs');
  };

  const handleMenu = () => {
    console.log('Open menu');
  };

  const handleItemPress = (id: number) => {
    const selectedSong = likedSongs.find(song => song.id === id);
    if (selectedSong) {
      console.log('Selected song:', selectedSong.title);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PlaylistLayout
        title="좋아요 한 곡"
        data={likedSongs}
        showTabs={false}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
        onMenuPress={handleMenu}
        onItemPress={handleItemPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default LikedPlaylistScreen; 