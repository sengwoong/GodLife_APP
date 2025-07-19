import React, { useState } from 'react';
import { CompositeNavigationProp, RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, ActivityIndicator, Modal, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';
import PlayListLayout from '../../components/common/MusicListPlay/MusicListLayout';
import FAB from '../../components/common/FAB';
import { PlayListNavigations } from '../../constants';
import { useMusicList } from '../../server/query/hooks/useMusic';
import { Music } from '../../types/music';
import { useSearchStore } from '../../store/useSearchStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { colors, getFontStyle, spacing } from '../../constants';

type PlayListContentScreenRouteProp = RouteProp<PlayListStackParamList, 'PlayListContent'>;
type PlayListNavigationProp = StackNavigationProp<PlayListStackParamList>;

function PlayListContentScreen() {
  const route = useRoute<PlayListContentScreenRouteProp>();
  const navigation = useNavigation<PlayListNavigationProp>();
  const { playListIndex } = route.params;

  const searchText = useSearchStore(state => state.searchText);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const { data } = useMusicList(playListIndex, 0, 10);
  
  // 플레이어 스토어에서 필요한 함수들 가져오기
  const { startPlaylist } = usePlayerStore();

  const handlePlayAll = () => {
    if (musicList && musicList.length > 0) {
      // YouTubeTrack 형식으로 변환
      const tracks = musicList.map(music => ({
        id: music.musicId.toString(),
        musicId: music.musicId.toString(),
        musicTitle: music.musicTitle,
        artist: 'Unknown Artist', // 기본값
        musicUrl: music.musicUrl,
        imageUrl: music.imageUrl || '',
        duration: 0, // 기본값
        playListIdContext: playListIndex
      }));
      
      // 첫 번째 곡부터 순서대로 재생
      startPlaylist(tracks, 0, playListIndex);
    }
  };

  const handleShuffle = () => {
    if (musicList && musicList.length > 0) {
      // YouTubeTrack 형식으로 변환
      const tracks = musicList.map(music => ({
        id: music.musicId.toString(),
        musicId: music.musicId.toString(),
        musicTitle: music.musicTitle,
        artist: 'Unknown Artist', // 기본값
        musicUrl: music.musicUrl,
        imageUrl: music.imageUrl || '',
        duration: 0, // 기본값
        playListIdContext: playListIndex
      }));
      
      // 랜덤한 인덱스 선택
      const randomIndex = Math.floor(Math.random() * tracks.length);
      startPlaylist(tracks, randomIndex, playListIndex);
    }
  };



  const handleAddMusic = () => {
    navigation.navigate(PlayListNavigations.MUSICEDIT, {
      playListIndex: playListIndex,
      musicIndex: undefined
    });
  };

  const handleLongPress = (music: Music) => {
    setSelectedMusic(music);
    setModalVisible(true);
  };

  const handleEditMusic = () => {
    if (selectedMusic) {
      setModalVisible(false);
      navigation.navigate(PlayListNavigations.MUSICEDIT, {
        playListIndex: playListIndex,
        musicIndex: selectedMusic.musicId
      });
    }
  };

  const handleDeleteMusic = () => {
    // 삭제 로직 추가 예정
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMusic(null);
  };

  const musicList: Music[] | undefined = data?.content?.map((item: any) => ({
    musicId: item.musicId,
    musicTitle: item.musicTitle,
    musicUrl: item.musicUrl,
    color: item.color,
    imageUrl: item.imageUrl,
    musicLike: item.musicLike || false,
  })) || undefined;

  const handleMusicItemPress = (id: string) => {
    const selectedMusic = musicList?.find(music => music.musicId.toString() === id);
    if (selectedMusic) {
      navigation.navigate(PlayListNavigations.MUSICEDIT, {
        playListIndex: playListIndex,
        musicIndex: selectedMusic.musicId
      });
    }
  };

  return (  
    <>
      <PlayListLayout
        title={`플레이리스트 ${playListIndex + 1}`}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
        musicList={musicList}
        onItemPress={handleMusicItemPress}
        onItemLongPress={handleLongPress}
      />
      <FAB onPress={handleAddMusic} />

      {/* 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedMusic?.musicTitle}
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleEditMusic}
            >
              <Text style={styles.modalButtonText}>수정하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.deleteButton]} 
              onPress={handleDeleteMusic}
            >
              <Text style={[styles.modalButtonText, styles.deleteButtonText]}>삭제하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={closeModal}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: spacing.M20,
    margin: spacing.M20,
    minWidth: 250,
    alignItems: 'center',
  },
  modalTitle: {
    ...getFontStyle('titleBody', 'medium', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M16,
    textAlign: 'center',
  } as TextStyle,
  modalButton: {
    width: '100%',
    paddingVertical: spacing.M12,
    paddingHorizontal: spacing.M16,
    borderRadius: 8,
    backgroundColor: colors.GREEN,
    marginBottom: spacing.M8,
    alignItems: 'center',
  },
  modalButtonText: {
    ...getFontStyle('titleBody', 'small', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  deleteButtonText: {
    color: colors.WHITE,
  },
  cancelButton: {
    backgroundColor: colors.GRAY,
  },
  cancelButtonText: {
    color: colors.BLACK,
  },
});

export default PlayListContentScreen;
