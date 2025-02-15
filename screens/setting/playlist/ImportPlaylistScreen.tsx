import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextStyle  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, getFontStyle } from '../../../constants';

function ImportPlaylistScreen() {
  const navigation = useNavigation();

  const playlistData = [
    {
      id: 1,
      title: '별의 이야시',
      artist: '로지',
      timestamp: '2024.01.19 10:23',
      thumbnail: null
    },
    {
      id: 2,
      title: '별의 이야시',
      artist: '로지',
      timestamp: '2024.01.19 10:23',
      thumbnail: null
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>←</Text>
        </TouchableOpacity>
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
        {playlistData.map((item) => (
          <View key={item.id} style={styles.playlistItem}>
            {item.thumbnail ? (
              <Image source={item.thumbnail}  />
            ) : (
              <View style={[styles.thumbnail, styles.placeholderThumbnail]} />
            )}
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </View>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Down Arrow Indicator */}
      <View style={styles.arrowIndicator}>
        <Text style={styles.arrowText}>↓</Text>
      </View>
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
  backButton: {
    ...getFontStyle('title', 'large', 'regular'),
    width: spacing.M40,
  },
  headerTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
  }as TextStyle,
  settingButton: {
    ...getFontStyle('title', 'medium', 'regular'),
    width: spacing.M40,
    textAlign: 'right',
  }as TextStyle,
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
  }as TextStyle,
  artist: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
  }as TextStyle,
  timestamp: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
    marginTop: spacing.M4,
  }as TextStyle,
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
  }as TextStyle,
});

export default ImportPlaylistScreen; 