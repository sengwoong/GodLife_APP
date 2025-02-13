import React from 'react';
import { CompositeNavigationProp, RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';
import PlayListLayout from '../../components/playlist/PlaylistLayout.tsx';
import FAB from '../../components/common/FAB';
import { PlayListNavigations } from '../../constants';

type PlayListContentScreenRouteProp = RouteProp<PlayListStackParamList, 'PlayListContent'>;
type PlayListNavigationProp = StackNavigationProp<PlayListStackParamList>;

function PlayListContentScreen() {
  const route = useRoute<PlayListContentScreenRouteProp>();
  const navigation = useNavigation<PlayListNavigationProp>();
  const { playListIndex } = route.params;

  const playListData = [
    { id: 1, title: '별을 여행서', artist: '요조', color: '#8B5CF6' },
    { id: 2, title: '기침비', artist: '이민우', color: '#EF4444' },
    { id: 3, title: '활짝핀 기억', artist: '델리스파이스', color: '#10B981' },
    { id: 4, title: '우리의 새벽', artist: '태연', color: '#8B5CF6' },
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

  const handleAddMusic = () => {
    navigation.navigate('PlayListEdit', {
      type: '음악',
      Index: playListIndex
    });
  };

  return (  
    <>
      <PlayListLayout
        title={`플레이리스트 ${playListIndex + 1}`}
        data={playListData}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
        onMenuPress={handleMenu}
      />
      <FAB onPress={handleAddMusic} />
    </>
  );
}

export default PlayListContentScreen;
