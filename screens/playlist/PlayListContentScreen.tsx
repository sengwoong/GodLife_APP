import React from 'react';
import { CompositeNavigationProp, RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';
import PlayListLayout from '../../components/common/MusicListPlay/MusicListLayout';
import FAB from '../../components/common/FAB';
import { PlayListNavigations } from '../../constants';
import { useInfiniteMusic } from '../../server/query/hooks/useMusic';
import { Music } from '../../types/music';
import { useSearchStore } from '../../store/useSearchStore';

type PlayListContentScreenRouteProp = RouteProp<PlayListStackParamList, 'PlayListContent'>;
type PlayListNavigationProp = StackNavigationProp<PlayListStackParamList>;

function PlayListContentScreen() {
  const route = useRoute<PlayListContentScreenRouteProp>();
  const navigation = useNavigation<PlayListNavigationProp>();
  const { playListIndex } = route.params;

  const searchText = useSearchStore(state => state.searchText);


  const { data, fetchNextPage, hasNextPage } = useInfiniteMusic(playListIndex, searchText);

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
    navigation.navigate(PlayListNavigations.MUSICEDIT, {
      playListIndex: playListIndex,
      musicIndex: undefined
    });
  };


  const musicList: Music[] | undefined = data?.pages.flatMap(page => 
    page.content.map(item => ({
      id: item.id.toString(),
      musicTitle: item.musicTitle,
      musicUrl: item.musicUrl,
      color: item.color,
      imageUrl: item.imageUrl,
    }))
  ) || undefined;

  const handleMusicItemPress = (id: string) => {
    const selectedMusic = musicList?.find(music => music.id === id);
    if (selectedMusic) {
      navigation.navigate(PlayListNavigations.MUSICEDIT, {
        playListIndex: playListIndex,
        musicIndex: parseInt(selectedMusic.id)
      });
    }
  };

  return (  
    <>
      <PlayListLayout
        title={`플레이리스트 ${playListIndex + 1}`}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
        onMenuPress={handleMenu}
        musicList={musicList}
        onItemPress={handleMusicItemPress}
      />
      <FAB onPress={handleAddMusic} />
    </>
  );
}

export default PlayListContentScreen;
