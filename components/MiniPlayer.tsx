import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, colorHex, getFontStyle, spacing } from '../constants/index'; // Modal.tsx와 동일한 경로로 가정
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import YoutubeIframe, { PLAYER_STATES } from 'react-native-youtube-iframe';
import { usePlayerStore } from '../store/usePlayerStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const FULL_SCREEN_PLAYER_HEIGHT = SCREEN_HEIGHT * 0.9; // 전체 화면 플레이어 높이 (조정 가능)
const MINI_PLAYER_HEIGHT = 60; // 대략적인 미니 플레이어 높이 (스타일에 따라 조정)
const PLAYLIST_OFFSET = SCREEN_HEIGHT * 0.3; // 재생 목록이 얼마나 위로 올라갈지
const PLAYLIST_THRESHOLD = SCREEN_HEIGHT * 0.1; // 재생 목록 표시 임계값
const MINI_THRESHOLD = SCREEN_HEIGHT * 0.3; // 미니 플레이어로 돌아가는 임계값

interface MiniPlayerProps {
  isVisible: boolean;
  songTitle: string;
  artistName: string;
  albumArtUrl?: string; // 앨범 아트 URL (선택 사항)
  isPlaying: boolean;
  isLooping?: boolean; // 무한 재생 상태 추가
  onPress?: () => void; // 미니 플레이어 전체 클릭 시
  onPlayPause?: () => void;
  onPrevious?: () => void; // 이전 곡 재생 함수 추가
  onNext?: () => void; // 다음 곡 재생 함수 추가
  onToggleLooping?: () => void; // 무한 재생 토글 함수 추가
  onClose?: () => void;
  style?: ViewStyle;
  onFullScreenToggle?: (isFullScreen: boolean) => void;
  videoId?: string; // 유튜브 비디오 ID 추가
  currentTrackIndex?: number; // 현재 트랙 인덱스 추가
  totalTracks?: number; // 전체 트랙 수 추가
  playlistTracks?: Array<{
    id: number;
    musicTitle: string;
    artist: string;
    imageUrl?: string;
    videoId?: string;
  }>;
  onSelectTrack?: (index: number) => void;
}

// 아이콘 대신 임시 텍스트 사용
const PlayIcon = () => <Text style={styling().iconStyle}>▶</Text>;
const PauseIcon = () => <Text style={styling().iconStyle}>❚❚</Text>;
const CloseIcon = () => <Text style={styling().iconStyle}>✕</Text>;

export function MiniPlayer({
  isVisible,
  songTitle,
  artistName,
  albumArtUrl,
  isPlaying,
  isLooping = false,
  onPress,
  onPlayPause,
  onPrevious,
  onNext,
  onToggleLooping,
  onClose,
  style,
  onFullScreenToggle,
  videoId,
  currentTrackIndex = 0,
  totalTracks = 0,
  playlistTracks = [],
  onSelectTrack,
}: MiniPlayerProps) {
  const styles = styling();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue(0);
  
  // 플레이어 참조 타입 수정
  const playerRef = React.useRef<any>(null);
  
  // 플레이어 상태 변경 핸들러 개선
  const onPlayerStateChange = React.useCallback((state: PLAYER_STATES) => {
    console.log("MiniPlayer state changed:", state);
    
    if (state === PLAYER_STATES.ENDED && onPlayPause) {
      // 곡이 끝나면 재생 상태 업데이트
      runOnJS(onPlayPause)();
    }
  }, [onPlayPause]);

  // 재생/일시정지 토글 함수 직접 구현
  const handleTogglePlayPause = () => {
    if (onPlayPause) {
      console.log("MiniPlayer toggle play/pause, new state:", !isPlaying);
      onPlayPause();
    }
  };

  const openFullScreenPlayer = () => {
    'worklet';
    translateY.value = withTiming(0, { duration: 300 });
    runOnJS(setIsFullScreen)(true);
    if (onFullScreenToggle) {
      runOnJS(onFullScreenToggle)(true);
    }
  };

  const closeFullScreenPlayer = () => {
    'worklet';
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    runOnJS(setIsFullScreen)(false);
    runOnJS(setShowPlaylist)(false);
    if (onFullScreenToggle) {
      runOnJS(onFullScreenToggle)(false);
    }
  };

  const resetToFullScreen = () => {
    'worklet';
    translateY.value = withTiming(0, { duration: 300 });
  };

  // 미니 플레이어 제스처 추가
  const miniPlayerGesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      // 미니 플레이어에서는 위로 드래그할 때만 반응
      if (event.translationY < 0) {
        translateY.value = Math.max(0, SCREEN_HEIGHT + event.translationY);
      }
    })
    .onEnd((event) => {
      // 충분히 위로 드래그했거나 빠르게 드래그한 경우 전체 화면으로
      if (event.translationY < -MINI_THRESHOLD || event.velocityY < -500) {
        openFullScreenPlayer();
      } else {
        // 그렇지 않으면 미니 플레이어로 복귀
        closeFullScreenPlayer();
      }
    });

  // 전체 화면 플레이어 제스처 수정
  const fullScreenPlayerGesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      // 아래로 드래그할 때만 반응
      if (event.translationY > 0) {
        translateY.value = Math.min(SCREEN_HEIGHT, event.translationY);
      }
    })
    .onEnd((event) => {
      // 충분히 아래로 드래그했거나 빠르게 드래그한 경우 미니 플레이어로
      if (event.translationY > MINI_THRESHOLD || event.velocityY > 500) {
        closeFullScreenPlayer();
      } else {
        // 그렇지 않으면 전체 화면으로 복귀
        resetToFullScreen();
      }
    });

  // 애니메이션 스타일 수정
  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    // 미니 플레이어는 translateY가 SCREEN_HEIGHT일 때만 보이고, 그 외에는 숨김
    const opacity = translateY.value === SCREEN_HEIGHT ? 1 : 0;
    return {
      opacity,
      transform: [
        { translateY: translateY.value === SCREEN_HEIGHT ? 0 : SCREEN_HEIGHT }
      ],
    };
  });

  const animatedFullScreenStyle = useAnimatedStyle(() => {
    // 전체 화면 플레이어는 translateY가 SCREEN_HEIGHT가 아닐 때만 보임
    const opacity = translateY.value === SCREEN_HEIGHT ? 0 : 1;
    return {
      opacity,
      transform: [{ translateY: translateY.value }],
    };
  });

  // 초기화 코드 추가
  React.useEffect(() => {
    // 컴포넌트 마운트 시 미니 플레이어 상태로 초기화
    translateY.value = SCREEN_HEIGHT;
  }, []);

  const handleMiniPlayerPress = () => {
    'worklet';
    openFullScreenPlayer();
    // onPress prop이 있다면 호출 (예: 네비게이션 등 다른 액션)
    if (onPress) {
        runOnJS(onPress)();
    }
  };

  // 재생 목록 토글 함수 추가
  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* 미니 플레이어 */}
      <GestureDetector gesture={miniPlayerGesture}>
        <Animated.View 
          style={[
            styles.container, 
            style, 
            { display: isVisible && !isFullScreen ? 'flex' : 'none' },
            animatedMiniPlayerStyle
          ]}
        >
          {/* 미니 플레이어 내용 */}
          <View style={styles.miniPlayerContent}>
            {albumArtUrl ? (
              <Image source={{ uri: albumArtUrl }} style={styles.albumArt} />
            ) : (
              <View style={styles.albumArtPlaceholder} />
            )}
            
            <View style={styles.infoContainer}>
              <Text style={styles.titleText} numberOfLines={1}>{songTitle}</Text>
              <Text style={styles.artistText} numberOfLines={1}>{artistName}</Text>
            </View>
            
            <View style={styles.controlsContainer}>
              <Pressable onPress={handleTogglePlayPause} style={styles.controlButton}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </Pressable>
              {onClose && (
                <Pressable onPress={onClose} style={styles.controlButton}>
                  <CloseIcon />
                </Pressable>
              )}
            </View>
          </View>
      
          {/* 미니 플레이어에도 숨겨진 유튜브 플레이어 추가 */}
          {videoId && (
            <View style={styles.hiddenPlayerContainer}>
              <YoutubeIframe
                ref={playerRef}
                height={1}
                width={1}
                videoId={videoId}
                play={isPlaying}
                onChangeState={onPlayerStateChange}
                forceAndroidAutoplay={true}
              />
            </View>
          )}
        </Animated.View>
      </GestureDetector>

      {/* 전체 화면 플레이어 */}
      <GestureDetector gesture={fullScreenPlayerGesture}>
        <Animated.View 
          style={[
            styles.fullScreenPlayer, 
            { display: isVisible && isFullScreen ? 'flex' : 'none' },
            animatedFullScreenStyle
          ]}
        >
          <View style={styles.fullScreenHeader}>
            <View style={styles.dragIndicator} />
            
            {/* 재생 목록 토글 버튼 추가 */}
            <TouchableOpacity 
              style={styles.playlistToggleButton}
              onPress={togglePlaylist}
            >
              <Text style={styles.playlistToggleText}>
                {showPlaylist ? "앨범 보기" : "재생 목록"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 재생 목록 또는 앨범 아트 표시 */}
          {showPlaylist ? (
            <View style={styles.playlistContainer}>
              <Text style={styles.playlistTitle}>현재 재생 목록</Text>
              <ScrollView style={styles.playlistScrollView}>
                {playlistTracks.map((track, index) => (
                  <TouchableOpacity 
                    key={track.id} 
                    style={[
                      styles.playlistItem,
                      currentTrackIndex === index && styles.playlistItemActive
                    ]}
                    onPress={() => {
                      if (onSelectTrack) {
                        onSelectTrack(index);
                      }
                    }}
                  >
                    <View style={styles.playlistItemContent}>
                      {track.imageUrl ? (
                        <Image source={{ uri: track.imageUrl }} style={styles.playlistItemImage} />
                      ) : (
                        <View style={styles.playlistItemImagePlaceholder} />
                      )}
                      <View style={styles.playlistItemInfo}>
                        <Text 
                          style={[
                            styles.playlistItemTitle,
                            currentTrackIndex === index && styles.playlistItemTitleActive
                          ]}
                          numberOfLines={1}
                        >
                          {track.musicTitle}
                        </Text>
                        <Text style={styles.playlistItemArtist} numberOfLines={1}>
                          {track.artist}
                        </Text>
                      </View>
                    </View>
                    {currentTrackIndex === index && (
                      <View style={styles.playlistItemPlayingIndicator}>
                        <Text style={styles.playlistItemPlayingText}>
                          {isPlaying ? '▶' : '❚❚'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.fullScreenContent}>
              {/* 앨범 아트 및 재생 컨트롤 */}
              {albumArtUrl ? (
                <Image source={{ uri: albumArtUrl }} style={styles.fullScreenAlbumArt} />
              ) : (
                <View style={styles.fullScreenAlbumArtPlaceholder} />
              )}
              <Text style={styles.fullScreenSongTitle}>{songTitle}</Text>
              <Text style={styles.fullScreenArtistName}>{artistName}</Text>
              
              <View style={styles.fullScreenControls}>
                <Pressable 
                  onPress={onPrevious} 
                  disabled={currentTrackIndex <= 0}
                  style={[
                    styles.fullScreenControlButton, 
                    styles.secondaryControlButton,
                    currentTrackIndex <= 0 && styles.disabledButton
                  ]}>
                  <Text style={styles.controlIconLarge}>⏮</Text>
                </Pressable>
                
                <Pressable onPress={handleTogglePlayPause} style={styles.fullScreenControlButton}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </Pressable>
                
                <Pressable 
                  onPress={onNext}
                  disabled={currentTrackIndex >= totalTracks - 1}
                  style={[
                    styles.fullScreenControlButton, 
                    styles.secondaryControlButton,
                    currentTrackIndex >= totalTracks - 1 && styles.disabledButton
                  ]}>
                  <Text style={styles.controlIconLarge}>⏭</Text>
                </Pressable>
              </View>
              
              <View style={styles.secondaryControls}>
                <Pressable 
                  onPress={onToggleLooping} 
                  style={[
                    styles.loopButton,
                    isLooping && styles.loopButtonActive
                  ]}>
                  <Text style={[
                    styles.controlIcon, 
                    isLooping && styles.controlIconActive
                  ]}>🔄</Text>
                  <Text style={[
                    styles.loopText,
                    isLooping && styles.loopTextActive
                  ]}>
                    한 곡 반복
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styling = () =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0, 
      left: 0,
      right: 0,
      backgroundColor: colors.BLACK, 
      paddingVertical: spacing.M8,
      paddingHorizontal: spacing.M16,
      borderTopWidth: 1,
      borderTopColor: colorHex.LIGHT_GRAY,
      elevation: 5, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      zIndex: 10, // MiniPlayer가 다른 요소 위에 오도록
    } as ViewStyle,
    miniPlayerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    albumArt: {
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: spacing.M12,
    } as ImageStyle,
    albumArtPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: spacing.M12,
      backgroundColor: colors.GRAY, 
    } as ViewStyle,
    infoContainer: {
      flex: 1,
      marginRight: spacing.M8,
    } as ViewStyle,
    titleText: {
      ...getFontStyle('titleBody', 'small', 'bold'),
      color: colors.WHITE, // 예시 색상
    } as TextStyle,
    artistText: {
      ...getFontStyle('titleBody', 'small', 'regular'),
      color: colors.LIGHT_GRAY, // 예시 색상
    } as TextStyle,
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    controlButton: {
      padding: spacing.M8,
      marginLeft: spacing.M8,
    } as ViewStyle,
    buttonPressed: {
      opacity: 0.7,
    },
    iconStyle: {
      color: colors.WHITE, 
      fontSize: 18,
    } as TextStyle,
    // FullScreenPlayer 스타일
    fullScreenPlayer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: SCREEN_HEIGHT,
      backgroundColor: colors.BLACK,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: spacing.M16,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      zIndex: 20,
    } as ViewStyle,
    fullScreenHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.M16,
      paddingTop: spacing.M16, // Status bar 높이 고려
    },
    fullScreenCloseButton: {
      padding: spacing.M8,
    },
    fullScreenCloseIcon: {
      fontSize: 24,
      color: colors.WHITE,
    },
    fullScreenTitle: {
      ...getFontStyle('titleBody', 'medium', 'bold'),
      color: colors.WHITE,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: spacing.M8,
    } as TextStyle,
    fullScreenContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', // 내용을 중앙에 배치 (예시)
    },
    fullScreenAlbumArt: {
      width: SCREEN_HEIGHT * 0.35,
      height: SCREEN_HEIGHT * 0.35,
      borderRadius: 10,
      marginBottom: spacing.M24,
      resizeMode: 'cover',
    } as ImageStyle,
    fullScreenAlbumArtPlaceholder: {
      width: SCREEN_HEIGHT * 0.35,
      height: SCREEN_HEIGHT * 0.35,
      borderRadius: 10,
      backgroundColor: colors.GRAY,
      marginBottom: spacing.M24,
    } as ViewStyle,
    fullScreenSongTitle: {
      ...getFontStyle('titleBody', 'large', 'bold'),
      color: colors.WHITE,
      textAlign: 'center',
      marginBottom: spacing.M8,
    } as TextStyle,
    fullScreenArtistName: {
      ...getFontStyle('titleBody', 'medium', 'regular'),
      color: colors.LIGHT_GRAY,
      textAlign: 'center',
      marginBottom: spacing.M32,
    } as TextStyle,
    fullScreenControls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '80%',
      marginTop: spacing.M20,
    },
    fullScreenControlButton: {
        padding: spacing.M16,
        backgroundColor: colors.GREEN,
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60%',
      marginTop: spacing.M20,
    },
    secondaryControlButton: {
      padding: spacing.M12,
      backgroundColor: colors.WHITE,
      borderRadius: 25,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing.M12,
    },
    disabledButton: {
      opacity: 0.5,
    },
    loopButtonActive: {
      backgroundColor: colors.GREEN,
    },
    loopButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: spacing.S8,
      paddingHorizontal: spacing.M12,
      borderRadius: 20,
      marginTop: spacing.M16,
    },
    loopText: {
      color: colors.WHITE,
      fontSize: 14,
      marginLeft: spacing.S4,
    },
    loopTextActive: {
      fontWeight: 'bold',
    },
    controlIcon: {
      fontSize: 16,
      color: colors.WHITE,
    },
    controlIconActive: {
      color: colors.WHITE,
    },
    hiddenPlayerContainer: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
      overflow: 'hidden',
      zIndex: -1,
    },
    playlistSection: {
      width: '100%',
      marginTop: spacing.M32,
      paddingHorizontal: spacing.M16,
    },
    playlistTitle: {
      ...getFontStyle('titleBody', 'large', 'bold'),
      color: colors.WHITE,
      marginBottom: spacing.M16,
      marginTop: spacing.M8,
    },
    playlistScrollView: {
      maxHeight: SCREEN_HEIGHT * 0.3,
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.M8,
      paddingHorizontal: spacing.M4,
      borderRadius: 8,
      marginBottom: spacing.M8,
      justifyContent: 'space-between',
    },
    playlistItemActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    playlistItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    playlistItemImage: {
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: spacing.M12,
    },
    playlistItemImagePlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 4,
      backgroundColor: colors.GRAY,
      marginRight: spacing.M12,
    },
    playlistItemInfo: {
      flex: 1,
    },
    playlistItemTitle: {
      ...getFontStyle('titleBody', 'small', 'bold'),
      color: colors.WHITE,
    },
    playlistItemTitleActive: {
      color: colors.GREEN,
    },
    playlistItemArtist: {
      ...getFontStyle('titleBody', 'small', 'regular'),
      color: colors.LIGHT_GRAY,
    },
    playlistItemPlayingIndicator: {
      marginLeft: spacing.M8,
    },
    playlistItemPlayingText: {
      color: colors.GREEN,
      fontSize: 16,
    },
    dragIndicator: {
      width: 40,
      height: 5,
      backgroundColor: colors.GRAY,
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: spacing.M8,
    },
    playlistView: {
      flex: 1,
      width: '100%',
      paddingHorizontal: spacing.M16,
    },
    playlistToggleButton: {
      position: 'absolute',
      right: spacing.M16,
      top: spacing.M16,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingVertical: spacing.M8,
      paddingHorizontal: spacing.M16,
      borderRadius: 20,
    },
    playlistToggleText: {
      color: colors.WHITE,
      ...getFontStyle('body', 'small', 'medium'),
    },
    playlistContainer: {
      flex: 1,
      width: '100%',
      paddingHorizontal: spacing.M16,
    },
  });

// 사용 예시 업데이트
// 
// function App() {
//   const { 
//     currentPlayingTrack, 
//     isPlaying, 
//     togglePlayPause,
//     currentTrackIndex,
//     playNext,
//     playPrevious
//   } = usePlayerStore();
//
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={{ flex: 1 }}>
//         <MiniPlayer
//           isVisible={!!currentPlayingTrack}
//           songTitle={currentPlayingTrack?.musicTitle || ''}
//           artistName={currentPlayingTrack?.artist || ''}
//           albumArtUrl={currentPlayingTrack?.imageUrl}
//           isPlaying={isPlaying}
//           onPlayPause={togglePlayPause}
//           videoId={currentPlayingTrack?.videoId}
//         />
//       </View>
//     </GestureHandlerRootView>
//   );
// } 