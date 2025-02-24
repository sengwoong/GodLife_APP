import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserPlaylist } from '../../../server/query/hooks/usePlayList';
import { colors, spacing, getFontStyle } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

function MyPlaylistScreen() {
  const navigation = useNavigation();
  
  // 임시로 userId를 1로 설정 (실제로는 인증 시스템에서 가져와야 함)
  const { data: playlistResponse, isLoading, error } = useUserPlaylist({ 
    userId: 1,
    size: 20 
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>로딩 중...</Text>
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
        <TouchableOpacity>
          <Text style={styles.settingButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 플레이리스트 목록 */}
      <ScrollView style={styles.playlistContainer}>
        {playlistResponse?.content.map((playlist) => (
          <TouchableOpacity 
            key={playlist.id} 
            style={styles.playlistItem}
            onPress={() => console.log('플레이리스트 선택:', playlist.id)}
          >
            <View style={styles.thumbnailContainer}>
              <View style={styles.thumbnail} />
              <Text style={styles.playCount}>0곡</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{playlist.playlistTitle}</Text>
              <Text style={styles.timestamp}>
                {new Date(playlist.createdAt).toLocaleDateString('ko-KR')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 새 플레이리스트 추가 버튼 */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => console.log('새 플레이리스트 추가')}
      >
        <Text style={styles.addButtonText}>+ 새 플레이리스트 만들기</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  headerTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
  }as TextStyle, 
  settingButton: {
    ...getFontStyle('title', 'medium', 'regular'),
    width: spacing.M40,
    textAlign: 'right',
  }as TextStyle,
  playlistContainer: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  thumbnailContainer: {
    alignItems: 'center',
  },
  thumbnail: {
    width: spacing.M48,
    height: spacing.M48,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: spacing.M4,
    marginBottom: spacing.M4,
  },
  playCount: {
    ...getFontStyle('title', 'small', 'regular'),
    color: colors.GRAY,
  }as TextStyle,
  contentContainer: {
    flex: 1,
    marginLeft: spacing.M12,
    justifyContent: 'center',
  },
  title: {
    ...getFontStyle('body', 'medium', 'regular'),
    marginBottom: spacing.M4,
  }as TextStyle,
  timestamp: {
    ...getFontStyle('title', 'small', 'regular'),
    color: colors.GRAY,
  }as TextStyle,
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
  }as TextStyle,
});

export default MyPlaylistScreen; 