import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaylistLayout from '../../../components/common/MusicListPlay/MusicListLayout';

function LikedPlaylistScreen() {
  // 임시 userId - 실제로는 인증 상태에서 가져와야 합니다
  const userId = "1";

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
    console.log('선택된 플레이리스트:', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PlaylistLayout
        title="좋아요 한 곡"
        data={data?.content || []}
        showTabs={false}
        isLoading={isLoading}
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