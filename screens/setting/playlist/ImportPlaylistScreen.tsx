import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextStyle, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, getFontStyle } from '../../../constants';
import { useUserPlaylist } from '../../../server/query/hooks/usePlayList';
import { CompoundOption } from '../../../components/Modal';
import { BASE_URL } from '../../../server/common/types/constants';

function ImportPlaylistScreen() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: playlistResponse, isLoading: playlistLoading } = useUserPlaylist({ 
    userId: 1, // 임시 userId
    size: 20 
  });

  const handleImportPlaylist = async () => {
    if (!playlistUrl.trim()) {
      Alert.alert('오류', '플레이리스트 URL을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/youtube/playlists/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          playlistUrl: playlistUrl.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('재생목록 가져오기에 실패했습니다');
      }

      Alert.alert(
        "성공",
        "YouTube 재생목록을 성공적으로 가져왔습니다.",
        [{ text: "확인", onPress: () => {
          setIsModalVisible(false);
          setPlaylistUrl('');
        }}]
      );
    } catch (error) {
      Alert.alert(
        "오류",
        "재생목록을 가져오는데 실패했습니다. 다시 시도해주세요.",
        [{ text: "확인" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('오류', 'API 키를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/youtube/api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, 
          apiKey: apiKey.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('API 키 저장에 실패했습니다');
      }

      Alert.alert(
        "성공",
        "YouTube API 키가 저장되었습니다.",
        [{ text: "확인", onPress: () => setIsSettingModalVisible(false) }]
      );
      setApiKey('');
    } catch (error) {
      Alert.alert('오류', 'API 키 저장에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>유튜브 플레이리스트</Text>
        <TouchableOpacity onPress={() => setIsSettingModalVisible(true)}>
          <Text style={styles.settingButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Import Button */}
      <TouchableOpacity 
        style={styles.importButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.importButtonText}>유튜브 플레이리스트 불러오기</Text>
      </TouchableOpacity>

      {/* Playlist List */}
      <ScrollView style={styles.playlistContainer}>
        {playlistResponse?.pages.flatMap(page => page.content).map((playlist) => (
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

      {/* Import Modal */}
      <CompoundOption
        isVisible={isModalVisible}
        hideOption={() => {
          setIsModalVisible(false);
          setPlaylistUrl('');
        }}
      >
        <CompoundOption.Background>
          <CompoundOption.Container style={styles.modalContainer}>
            <CompoundOption.Title>
              플레이리스트 URL 입력
            </CompoundOption.Title>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={playlistUrl}
                onChangeText={setPlaylistUrl}
                placeholder="YouTube 플레이리스트 URL을 입력하세요"
                placeholderTextColor={colors.GRAY}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <CompoundOption.Divider />
            <CompoundOption.Button
              onPress={handleImportPlaylist}
              disabled={isLoading}
            >
              {isLoading ? '가져오는 중...' : '가져오기'}
            </CompoundOption.Button>
            <CompoundOption.Divider />
            <CompoundOption.Button
              onPress={() => {
                setIsModalVisible(false);
                setPlaylistUrl('');
              }}
              disabled={isLoading}
            >
              취소
            </CompoundOption.Button>
          </CompoundOption.Container>
        </CompoundOption.Background>
      </CompoundOption>

      {/* Settings Modal */}
      <CompoundOption
        isVisible={isSettingModalVisible}
        hideOption={() => setIsSettingModalVisible(false)}
        animationType="slide"
      >
        <CompoundOption.Background>
          <CompoundOption.Container>
            <CompoundOption.Title>
              YouTube API 키 설정
            </CompoundOption.Title>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="YouTube Data API v3 키를 입력하세요"
                placeholderTextColor={colors.GRAY}
                secureTextEntry
              />
            </View>
            <CompoundOption.Divider />
            <CompoundOption.Button onPress={handleSaveApiKey}>
              저장
            </CompoundOption.Button>
            <CompoundOption.Divider />
            <CompoundOption.Button
              onPress={() => setIsSettingModalVisible(false)}
            >
              취소
            </CompoundOption.Button>
          </CompoundOption.Container>
        </CompoundOption.Background>
      </CompoundOption>

      {playlistLoading && (
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
    color: colors.BLACK,
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
  inputContainer: {
    padding: spacing.M16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.BLACK,
    borderRadius: spacing.M8,
    padding: spacing.M12,
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  modalContainer: {
    paddingVertical: spacing.M16,
    width: '90%',
    alignSelf: 'center',
  },
});

export default ImportPlaylistScreen; 