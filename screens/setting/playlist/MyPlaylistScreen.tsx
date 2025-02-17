import React from 'react';
import PlaylistLayout from '../../../components/common/PlaylistMusicLayout';
import { useNavigation } from '@react-navigation/native';

function MyPlaylistScreen() {
  const navigation = useNavigation();

  const playListData = [
    { id: 1, title: '좋아하는 노래', artist: '30곡', color: '#8B5CF6' },
    { id: 2, title: '운동할 때', artist: '12곡', color: '#EF4444' },
    { id: 3, title: '드라이브', artist: '25곡', color: '#10B981' },
    { id: 4, title: '공부할 때', artist: '18곡', color: '#F59E0B' },
  ];

  const handlePlayAll = () => {
    // 전체 재생 로직
  };

  const handleShuffle = () => {
    // 셔플 재생 로직
  };

  const handleMenu = () => {
    // 메뉴 처리 로직
  };

  return (
    <PlaylistLayout
      title="최근 재생한 노래"
      data={playListData}
      showTabs={false}
      onPlayAll={handlePlayAll}
      onShuffle={handleShuffle}
      onMenuPress={handleMenu}
    />
  );
}

export default MyPlaylistScreen; 