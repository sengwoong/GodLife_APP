import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaylistLayout from '../../../components/common/MusicListPlay/MusicListLayout';
import { useLikedMusics } from '../../../server/query/hooks/useMusic';
import { Music } from '../../../types/music';

function LikedPlaylistScreen() {
  const userId = "1"; // 임시 userId
  const { data, isLoading } = useLikedMusics({ userId });

  const handlePlayAll = () => {
    console.log('전체 재생');
  };

  const handleShuffle = () => {
    console.log('셔플 재생');
  };

  const handleMenu = () => {
    console.log('메뉴 열기');
  };

  const handleItemPress = (id: string) => {
    console.log('선택된 음악:', id);
  };

  const formattedMusics = data?.content.map(music => ({
    id: music.id,
    musicTitle: music.musicTitle,
    musicUrl: music.musicUrl,
    color: music.color,
    imageUrl: music.imageUrl,
    musicLike: music.musicLike
  })) || [];

  return (
    <SafeAreaView style={styles.container}>
      <PlaylistLayout
        title="좋아요 한 곡"
        musicList={formattedMusics}
        showTabs={false}
        searchbar={false}
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