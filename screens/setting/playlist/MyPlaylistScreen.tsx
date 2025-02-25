import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextStyle, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserPlaylist, useUpdatePlaylistShare } from '../../../server/query/hooks/usePlayList';
import { colors, spacing, getFontStyle, SettingNavigations } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

function MyPlaylistScreen() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 임시로 userId를 1로 설정 (실제로는 인증 시스템에서 가져와야 함)
  const { data: playlistResponse, isLoading, error } = useUserPlaylist({ 
    userId: 1,
    size: 20 
  });
  const updateShare = useUpdatePlaylistShare();

  const toggleSharing = async (id: number, currentShared: boolean) => {
    try {
      await updateShare.mutateAsync({
        playlistId: id,
        userId: 1,
        isShared: !currentShared
      });
    } catch (error) {
      console.error('공유 상태 업데이트 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>에러가 발생했습니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 플레이리스트</Text>

      </View>

      {/* 플레이리스트 목록 */}
      <ScrollView style={styles.playlistContainer}>
        {playlistResponse?.content.map((playlist) => (
          <View key={playlist.id} style={styles.playlistItem}>
            <View style={[styles.thumbnail, styles.placeholderThumbnail]} />
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{playlist.playlistTitle}</Text>
                <Text style={styles.timestamp}>
                  {new Date(playlist.createdAt).toLocaleDateString('ko-KR')}
                </Text>
              </View>
              <View style={styles.shareContainer}>
                <Text style={styles.shareText}>
                  {playlist.isShared ? '공유중' : '비공개'}
                </Text>
                <Switch
                  value={playlist.isShared}
                  onValueChange={() => toggleSharing(playlist.id, playlist.isShared || false)}
                  trackColor={{ false: colors.BLACK, true: colors.BLACK }}
                  thumbColor={colors.WHITE}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 새 플레이리스트 추가 버튼 */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate(SettingNavigations.IMPORTPLAYLIST)}
      >
        <Text style={styles.addButtonText}>+ 유튜브에서 불러오기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.M16,
  },
  headerTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  settingButton: {
    ...getFontStyle('title', 'medium', 'regular'),
    width: spacing.M40,
    textAlign: 'right',
  } as TextStyle,
  playlistContainer: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BLACK,
  },
  thumbnail: {
    width: spacing.M48,
    height: spacing.M48,
    borderRadius: spacing.M4,
    marginRight: spacing.M12,
  },
  placeholderThumbnail: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
    marginBottom: spacing.M4,
  } as TextStyle,
  timestamp: {
    ...getFontStyle('title', 'small', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  shareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
    marginRight: spacing.M8,
  } as TextStyle,
  addButton: {
    margin: spacing.M16,
    padding: spacing.M16,
    backgroundColor: colors.BLACK,
    borderRadius: spacing.M8,
    alignItems: 'center',
  },
  addButtonText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
});

export default MyPlaylistScreen; 