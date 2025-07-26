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
import { PullToRefresh } from '../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

type PlayListContentScreenRouteProp = RouteProp<PlayListStackParamList, 'PlayListContent'>;
type PlayListNavigationProp = StackNavigationProp<PlayListStackParamList>;

function PlayListContentScreen() {
  const route = useRoute<PlayListContentScreenRouteProp>();
  const navigation = useNavigation<PlayListNavigationProp>();
  const { playListIndex } = route.params;
  const queryClient = useQueryClient();

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

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 음악 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['musics', playListIndex] });
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
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
    <PullToRefresh onRefresh={handleRefresh}>
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
    </PullToRefresh>
  );
}

export default PlayListContentScreen;
