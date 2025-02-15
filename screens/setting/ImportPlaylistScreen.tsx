import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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
          <Text style={styles.backButton}>←</Text>
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
              <Image source={item.thumbnail} style={styles.thumbnail} />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 24,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingButton: {
    fontSize: 20,
    width: 40,
    textAlign: 'right',
  },
  importButton: {
    backgroundColor: '#000',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistContainer: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  placeholderThumbnail: {
    backgroundColor: '#E5E5E5',  // 회색 배경
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  arrowIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#666',
  },
});

export default ImportPlaylistScreen; 