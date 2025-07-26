import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, FlatList, View, TextInput, TextStyle } from 'react-native'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { colors, getFontStyle, PlayListNavigations, spacing } from '../../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import Margin from '../../components/division/Margin';
import FAB from '../../components/common/FAB';
import { CompoundOption } from '../../components/Modal';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';
import PlaylistSearch from '../../components/playlist/PlaylistSearch';
import PlaylistList from '../../components/playlist/PlaylistList';
import { useCreatePlayList, useDeletePlayList } from '../../server/query/hooks/usePlayList';
import useAuthStore from '../../store/useAuthStore';
import { PullToRefresh } from '../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<PlayListStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function PlayListScreen() {
  const navigation = useNavigation<Navigation>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    selectedPlaylistId: null as number | null,
    selectedPlaylistTitle: null as string | null,
  });

  const { mutate: deletePlayList } = useDeletePlayList();
  const { mutate: createPlayList } = useCreatePlayList();
  const queryClient = useQueryClient();

  const navigateToPlayListContent = (playlistId: number) => {
    navigation.navigate(PlayListNavigations.PLAYLISTCONTENT, { 
      playListIndex: playlistId,
    });
  };

  const navigateToMusic = (playlistId: number, playlistTitle: string) => {
    navigation.navigate(PlayListNavigations.PLAYLISTCONTENT, { 
      playListIndex: playlistId,
    });
  };

  // const userId = useAuthStore(state => state.user?.id);
  const userId = 1;

  if (!userId) {
    throw new Error('User ID is undefined');
  }
  
  const handleAddPlaylist = () => {
    setIsModalVisible(false); 
    createPlayList({
      playlistData: {
        playlistTitle: newPlaylistName,
        imageUrl: '',
        isShared: false,
      },
      userId: userId,
    });
  };

  const handleLongPress = (playlistId: number, playlistTitle: string) => {
    setContextMenu({
      isVisible: true,
      selectedPlaylistId: playlistId,
      selectedPlaylistTitle: playlistTitle,
    });
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 플레이리스트 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['playlists', userId] });
    queryClient.invalidateQueries({ queryKey: ['playlist'] });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} isFlatList={true}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>플레이리스트</Text>
          <Text style={styles.header__subtitle}>플레이리스트를 선택하세요</Text>
        </View>
        <Margin size={'M12'} />
        <PlaylistSearch />
        <PlaylistList
          navigateToMusic={navigateToMusic}
          onLongPress={handleLongPress}
        />
        
        <FAB onPress={() => setIsModalVisible(true)} />

        <CompoundOption
          isVisible={isModalVisible}
          hideOption={() => setIsModalVisible(false)}
          animationType="slide">
          <CompoundOption.Background>
            <CompoundOption.Container style={styles.modal}>
              <CompoundOption.Title>새 플레이리스트 만들기</CompoundOption.Title>
              <Margin size={'M12'} />
              <View style={styles.modal__input}>
                <TextInput
                  placeholder="플레이리스트 이름을 입력하세요"
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  autoFocus
                />
              </View>
              <Margin size={'M12'} />
              <CompoundOption.Divider />
              
              <View style={styles.modal__buttons}>
                <CompoundOption.Button 
                  onPress={() => setIsModalVisible(false)}>
                  취소
                </CompoundOption.Button>
                <CompoundOption.Button 
                  onPress={handleAddPlaylist}>
                  추가
                </CompoundOption.Button>
              </View>
            </CompoundOption.Container>
          </CompoundOption.Background>
        </CompoundOption>

        <CompoundOption
          isVisible={contextMenu.isVisible}
          hideOption={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
        >
          <CompoundOption.Background>
            <CompoundOption.Container>
              <CompoundOption.Title>{contextMenu.selectedPlaylistTitle} 플레이리스트</CompoundOption.Title>
              <CompoundOption.Button
                onPress={() => {
                  navigation.navigate(PlayListNavigations.PLAYLISTEDIT, { playListIndex: contextMenu.selectedPlaylistId! });
                  setContextMenu(prev => ({ ...prev, isVisible: false }));
                }}>
                수정하기
              </CompoundOption.Button>
              <CompoundOption.Divider />
              <CompoundOption.Button
                onPress={() => {
                  navigation.navigate(PlayListNavigations.PLAYLISTCONTENT, { 
                    playListIndex: contextMenu.selectedPlaylistId!,
                  });
                  setContextMenu(prev => ({ ...prev, isVisible: false }));
                }}>
                뮤직 플레이
              </CompoundOption.Button>
        
              <CompoundOption.Divider />
              <CompoundOption.Button
                isDanger
                onPress={() => {
                  if (contextMenu.selectedPlaylistId) {
                    deletePlayList({ playlistId: contextMenu.selectedPlaylistId, userId });
                  }
                  setContextMenu(prev => ({ ...prev, isVisible: false }));
                }}>
                삭제하기
              </CompoundOption.Button>
            </CompoundOption.Container>
          </CompoundOption.Background>
        </CompoundOption>
      </SafeAreaView>
    </PullToRefresh>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: spacing.M16,
  },
  header: {
    backgroundColor: colors.WHITE,
  },
  header__title: {
    color: colors.BLACK,
    ...getFontStyle('title', 'large', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  header__subtitle: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  }as TextStyle ,
  modal: {
    backgroundColor: colors.WHITE,
  },
  modal__input: {
    paddingHorizontal: spacing.M16,
    paddingBottom: spacing.M16,
  },
  modal__textInput: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  },
  modal__buttons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
});

export default PlayListScreen;