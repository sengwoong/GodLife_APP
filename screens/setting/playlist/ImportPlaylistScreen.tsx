import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, getFontStyle } from '../../../constants';
import { useUserPlaylist } from '../../../server/query/hooks/usePlayList';

function ImportPlaylistScreen() {
  const navigation = useNavigation();
  const { data: playlistResponse, isLoading } = useUserPlaylist({ 
    userId: 1, // 임시 userId
    size: 20 
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>유튜브 플레이리스트</Text>
        <TouchableOpacity>
          <Text style={styles.settingButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Import Button */}
      <TouchableOpacity style={styles.importButton}>
        <Text style={styles.importButtonText}>유튜브 플레이리스트 불러오기</Text>
      </TouchableOpacity>

      {/* Playlist List */}
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
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Down Arrow Indicator */}
      <View style={styles.arrowIndicator}>
        <Text style={styles.arrowText}>↓</Text>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
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
  } as TextStyle,
  settingButton: {
    ...getFontStyle('title', 'medium', 'regular'),
    width: spacing.M40,
    textAlign: 'right',
  } as TextStyle,
  importButton: {
    backgroundColor: colors.BLACK,
    margin: spacing.M16,
    padding: spacing.M16,
    borderRadius: spacing.M8,
    alignItems: 'center',
  },
  importButtonText: {
    color: colors.WHITE,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
  playlistContainer: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
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
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...getFontStyle('body', 'medium', 'regular'),
    marginBottom: spacing.M4,
  } as TextStyle,
  timestamp: {
    ...getFontStyle('title', 'small', 'regular'),
    color: colors.GRAY,
  } as TextStyle,
  arrowIndicator: {
    position: 'absolute',
    bottom: spacing.M20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  arrowText: {
    ...getFontStyle('title', 'large', 'regular'),
    color: colors.GRAY,
  } as TextStyle,
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ImportPlaylistScreen; 