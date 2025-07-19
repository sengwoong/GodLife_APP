import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, Modal, ScrollView, Platform, Image, TextStyle, Dimensions, ImageStyle } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import YoutubeIframe, { PLAYER_STATES, YoutubeIframeRef } from 'react-native-youtube-iframe';
import Slider from '@react-native-community/slider';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import { useInfiniteMusic } from '../../server/query/hooks/useMusic';
import Icon from 'react-native-vector-icons/AntDesign';
import { usePlayerStore } from '../../store/usePlayerStore';
import { YouTubeTrack } from '../../types/player';

// 유튜브 URL에서 Video ID를 추출하는 헬퍼 함수
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

type NowPlayingScreenRouteProp = RouteProp<PlayListStackParamList, 'NowPlaying'>;

function NowPlayingScreen() {
  const route = useRoute<NowPlayingScreenRouteProp>();
  const navigation = useNavigation();
  const { playListId, musicIdToPlay } = route.params as { playListId: number; musicIdToPlay?: number };

  const playerRef = useRef<YoutubeIframeRef>(null);

  // Zustand 스토어에서 상태 및 액션 가져오기
  const {
    currentPlayingTrack,
    isPlaying,
    currentTime,
    duration,
    isLooping,
    actualPlayerState,
    startPlaylist,
    togglePlayPause,
    playNext,
    playPrevious,
    setLooping,
    updateProgress,
    setActualPlayerState,
    currentPlaylistTracks,
    currentTrackIndex,
    selectTrack,
  } = usePlayerStore();

  // 로컬 상태 (가사 모달 등)
  const [lyricsModalVisible, setLyricsModalVisible] = useState(false);
  const [lyricsContent, setLyricsContent] = useState<string>('가사 준비 중입니다...');
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 플레이리스트 데이터 로드 (useInfiniteMusic은 페이지네이션 기반이므로, 전체 목록을 가져오는 쿼리가 필요할 수 있음)
  const { data: musicDataResult, isLoading: isLoadingMusicQuery, error: musicError } = useInfiniteMusic(playListId, '');

  // 플레이리스트 메뉴 상태 추가
  const [showPlaylist, setShowPlaylist] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // 플레이리스트 로드 및 재생 시작
      const loadAndPlay = async () => {
        if (!playListId) return;

        // 데이터가 있으면 재생 시작
        const infiniteData = musicDataResult as any;
        if (infiniteData?.pages && infiniteData.pages.length > 0) {
          const tracks = infiniteData.pages.flatMap((page: any) => page.content) as YouTubeTrack[];
          
          if (tracks.length > 0) {
            // 특정 곡 재생 요청이 있으면 해당 곡부터, 없으면 처음부터
            const startIndex = musicIdToPlay 
              ? tracks.findIndex(track => String(track.id) === String(musicIdToPlay)) || 0
              : 0;
            
            startPlaylist(tracks, startIndex, playListId);
          } else {
            Alert.alert("정보", "플레이리스트에 음악이 없습니다.");
          }
        }
      };

      loadAndPlay();
    }, [playListId, musicIdToPlay, musicDataResult, startPlaylist])
  );

  // 플레이어 상태 변경 핸들러 수정
  const onPlayerStateChange = useCallback((state: PLAYER_STATES) => {
    setActualPlayerState(state); // 스토어의 actualPlayerState 업데이트

    if (state === PLAYER_STATES.ENDED) {
      if (isLooping && playerRef.current) {
        playerRef.current.seekTo(0, true);
      }
    }
  }, [setActualPlayerState, isLooping]);

  // 재생 시간 업데이트 로직
  useEffect(() => {
    const updatePlayerProgress = async () => {
      if (playerRef.current && (actualPlayerState === PLAYER_STATES.PLAYING || isPlaying)) { // isPlaying도 조건에 추가
        try {
          const currentT = await playerRef.current.getCurrentTime();
          const totalD = await playerRef.current.getDuration();
          updateProgress(currentT, totalD > 0 ? totalD : duration); // duration이 0이면 이전 값 유지
        } catch (error) {
          // console.warn("Error updating progress:", error);
        }
      }
    };

    if (isPlaying && currentPlayingTrack?.videoId) { // isPlaying (의도된 상태) 기준으로 interval 관리
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(updatePlayerProgress, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, actualPlayerState, currentPlayingTrack, updateProgress, duration]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const handleToggleLooping = () => {
    setLooping(!isLooping);
  };

  const handleSeek = async (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value, true);
      updateProgress(value); // UI 즉시 업데이트
    }
  };

  const toggleLyricsModal = () => {
    if (!lyricsModalVisible && currentPlayingTrack) {
        // 가사 로직 (예시)
        if (currentPlayingTrack.musicTitle.includes("동물")) {
            setLyricsContent("똑똑한 동물 친구들 이야기...");
        } else {
            setLyricsContent(`"${currentPlayingTrack.musicTitle}"에 대한 가사 정보가 없거나 준비 중입니다.`);
        }
    }
    setLyricsModalVisible(!lyricsModalVisible);
  };

  // 재생/일시정지 토글 함수 직접 구현
  const handleTogglePlayPause = useCallback(() => {
    // 현재 상태의 반대로 설정
    togglePlayPause();
    
    // 디버깅을 위한 로그
  }, [togglePlayPause]);

  // 광고 스킵 기능 추가
  const handleSkipAd = useCallback(() => {
    if (playerRef.current) {
      // 광고 스킵 시도
      playerRef.current.seekTo(duration, true); // 영상 끝으로 이동하여 광고 종료
      
      // 다음 곡으로 이동
      playNext();
    }
  }, [playNext, duration]);

  // 광고 감지 로직 추가
  useEffect(() => {
    // 유튜브 광고 감지 (실제로는 더 복잡한 로직이 필요할 수 있음)
    const checkForAds = async () => {
      if (playerRef.current && isPlaying) {
        try {
          // 현재 재생 중인 URL 확인
          const videoUrl = await playerRef.current.getVideoUrl();
          
          // 광고 URL 패턴 확인 (예시)
          if (videoUrl && videoUrl.includes('&ad=')) {
            setIsAdPlaying(true);
          } else {
            setIsAdPlaying(false);
          }
        } catch (error) {
          console.error("광고 확인 중 오류:", error);
        }
      }
    };
    
    const adCheckInterval = setInterval(checkForAds, 2000);
    return () => clearInterval(adCheckInterval);
  }, [isPlaying]);

  // 플레이리스트 토글 함수
  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  // 플레이리스트 항목 클릭 핸들러
  const handleTrackSelect = (index: number) => {
    // 선택한 트랙으로 변경
    selectTrack(index);
    
    // 플레이리스트 메뉴 닫기
    setShowPlaylist(false);
  };

  // 가사 버튼 핸들러 함수 추가
  const handleLyricsPress = () => {
    setLyricsModalVisible(true);
  };

  // 공유 버튼 핸들러 함수 추가
  const handleSharePress = () => {
    // 공유 기능 구현
    Alert.alert("공유", "공유 기능이 준비 중입니다.");
  };

  // 로딩 및 에러 UI
  if (isLoadingPlaylist || (isLoadingMusicQuery && !currentPlayingTrack)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.GREEN} />
          <Text style={styles.loadingText}>음악 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (musicError && !currentPlayingTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>음악 정보를 불러오는데 실패했습니다.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
            <Text style={styles.buttonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPlayingTrack?.videoId && !isLoadingPlaylist && !isLoadingMusicQuery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>재생할 수 있는 음악이 없습니다.</Text>
          <Text style={styles.playlistInfo}>플레이리스트 ID: {playListId}</Text>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
             <Text style={styles.buttonText}>뒤로가기</Text>
           </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {React.createElement(Icon as any, { name: "arrowleft", size: 24, color: colors.WHITE })}
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentPlayingTrack?.musicTitle || '재생 중인 곡 없음'}
          </Text>
        </View>
        
        <View style={styles.headerIconContainer}>
          <TouchableOpacity onPress={togglePlaylist}>
            {React.createElement(Icon as any, { name: "menu-fold", size: 24, style: styles.headerIcon })}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSharePress}>
            {React.createElement(Icon as any, { name: "sharealt", size: 24, style: styles.headerIcon })}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLyricsPress}>
            {React.createElement(Icon as any, { name: "profile", size: 24, style: styles.headerIcon })}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.hiddenPlayerContainer}>
          {currentPlayingTrack?.videoId && (
            <YoutubeIframe
              ref={playerRef}
              height={1}
              width={1}
              play={isPlaying}
              videoId={currentPlayingTrack.videoId}
              onChangeState={onPlayerStateChange}
              webViewStyle={{ opacity: 0, position: 'absolute', top: -1000, left: -1000 }}
              onError={(e) => console.error('Youtube Player Error:', e)}
              onReady={() => {
                playerRef.current?.getDuration().then((d: number) => updateProgress(currentTime, d));
              }}
              forceAndroidAutoplay={true}
              webViewProps={{
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
              }}
            />
          )}
        </View>

        <View style={styles.albumArtContainer}>
          {currentPlayingTrack?.imageUrl ? (
            <Image source={{ uri: currentPlayingTrack.imageUrl }} style={styles.albumArtStyle as ImageStyle} />
          ) : (
            <View style={[styles.albumArtStyle, styles.albumArtPlaceholder]}>
              <Text style={{ fontSize: 100, color: colors.WHITE }}>🎵</Text>
            </View>
          )}
        </View>
        
        <Margin size={'M20'} />

        <View style={styles.musicInfoContainer}>
          <Text style={styles.musicTitleStyle} numberOfLines={2} ellipsizeMode="tail">
            {currentPlayingTrack?.musicTitle || '제목 없음'}
          </Text>
          <Text style={styles.musicArtist} numberOfLines={1} ellipsizeMode="tail">
            {currentPlayingTrack?.artist || '아티스트 정보 없음'}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.timeTextStyle}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration > 0 ? duration : 1}
            value={currentTime}
            minimumTrackTintColor={colors.GREEN}
            maximumTrackTintColor={colors.LIGHT_GRAY}
            thumbTintColor={colors.GREEN}
            onSlidingStart={() => {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
              }
            }}
            onSlidingComplete={handleSeek}
          />
          <Text style={styles.timeTextStyle}>{formatTime(duration)}</Text>
        </View>

        <Margin size={'M24'} />
        
        <View style={styles.playerControls}>
          <TouchableOpacity 
            onPress={playPrevious} 
            style={styles.controlButtonBase} 
            disabled={currentPlaylistTracks.length <= 0 || currentTrackIndex <= 0}
          >
            {React.createElement(Icon as any, { 
              name: "stepbackward", 
              size: 28, 
              color: (currentPlaylistTracks.length <= 0 || currentTrackIndex <= 0) ? colors.LIGHT_GRAY : colors.BLACK 
            })}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleTogglePlayPause} style={[styles.controlButtonBase, styles.playPauseButton]}>
            {React.createElement(Icon as any, { name: isPlaying ? "pause" : "caretright", size: 32, color: colors.WHITE })}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={playNext} 
            style={styles.controlButtonBase} 
            disabled={currentPlaylistTracks.length <= 0 || currentTrackIndex >= currentPlaylistTracks.length - 1}
          >
            {React.createElement(Icon as any, { 
              name: "stepforward", 
              size: 28, 
              color: (currentPlaylistTracks.length <= 0 || currentTrackIndex >= currentPlaylistTracks.length - 1) ? colors.LIGHT_GRAY : colors.BLACK 
            })}
          </TouchableOpacity>
        </View>

         <View style={styles.secondaryControls}>
            <TouchableOpacity 
              style={[styles.loopButton, isLooping && styles.loopButtonActive]} 
              onPress={handleToggleLooping}
            >
              {React.createElement(Icon as any, { name: "retweet", size: 18, color: isLooping ? colors.GREEN : colors.WHITE })}
              <Text style={[styles.loopText, isLooping && styles.loopTextActive]}>
                {isLooping ? "무한 재생 켜짐" : "무한 재생"}
              </Text>
            </TouchableOpacity>
         </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={lyricsModalVisible}
        onRequestClose={toggleLyricsModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={toggleLyricsModal}
        >
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.modalTitle}>가사</Text>
            <ScrollView style={styles.lyricsScrollView}>
              <Text style={styles.lyricsText}>{lyricsContent}</Text>
            </ScrollView>
            <TouchableOpacity onPress={toggleLyricsModal} style={styles.modalCloseButton}>
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {isAdPlaying && (
        <View style={styles.adOverlay}>
          <Text style={styles.adText}>광고 재생 중...</Text>
          <TouchableOpacity 
            style={styles.skipAdButton}
            onPress={handleSkipAd}
          >
            <Text style={styles.skipAdText}>광고 스킵</Text>
          </TouchableOpacity>
        </View>
      )}

      {showPlaylist && (
        <View style={styles.playlistOverlay}>
          <TouchableOpacity 
            style={styles.playlistCloseArea} 
            onPress={togglePlaylist}
            activeOpacity={1}
          />
          <View style={styles.playlistContainer}>
            <View style={styles.playlistHeader}>
              <Text style={styles.playlistHeaderTitle}>현재 재생 목록</Text>
              <TouchableOpacity onPress={togglePlaylist}>
                {React.createElement(Icon as any, { name: "close", size: 24, color: colors.WHITE })}
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.playlistScrollView}>
              {currentPlaylistTracks.map((track, index) => (
                <TouchableOpacity 
                  key={track.id} 
                  style={[
                    styles.playlistItem,
                    currentTrackIndex === index && styles.playlistItemActive
                  ]}
                  onPress={() => handleTrackSelect(index)}
                >
                  <View style={styles.playlistItemContent}>
                    {track.imageUrl ? (
                      <Image source={{ uri: track.imageUrl }} style={styles.playlistItemImage as ImageStyle} />
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
    width: '100%',
    paddingHorizontal: spacing.M16,
    paddingTop: spacing.M16,
    paddingBottom: spacing.M8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...getFontStyle('titleBody', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  backButton: {
    padding: spacing.M8,
  },
  headerIconContainer: {
    position: 'absolute',
    top: spacing.M16,
    right: spacing.M16,
    zIndex: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: spacing.M8,
  },
  headerIcon: {
    marginHorizontal: spacing.M8,
    color: colors.WHITE,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.M12,
  },
  hiddenPlayerContainer: {
    position: 'absolute',
    top: -Dimensions.get('window').height,
    left: -Dimensions.get('window').width,
    width: 1,
    height: 1,
    opacity: 0,
  },
  albumArtContainer: {
    width: Dimensions.get('window').width * 0.7,
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: colors.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: spacing.M20,
  },
  albumArtStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  musicInfoContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.M16,
  },
  musicTitleStyle: {
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  musicArtist: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.GRAY,
    textAlign: 'center',
    marginTop: spacing.M4,
  } as TextStyle,
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '85%',
    marginTop: spacing.M20,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '60%',
    marginTop: spacing.M20,
    marginBottom: spacing.M20,
  },
  controlButtonBase: {
    padding: spacing.M12,
    borderRadius: 35,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.GRAY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginHorizontal: spacing.M4,
  },
  playPauseButton: {
    backgroundColor: colors.GREEN,
    padding: spacing.M16,
    elevation: 6,
  },
  loopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M16,
    borderRadius: 20,
    marginTop: spacing.M16,
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
  loopButtonActive: {
    borderColor: colors.GREEN,
  },
  loopText: {
    color: colors.WHITE,
    fontSize: 14,
    marginLeft: spacing.M8,
    fontWeight: '500',
  },
  loopTextActive: {
    color: colors.GREEN,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.M16,
  },
  button: {
    backgroundColor: colors.GREEN,
    paddingVertical: spacing.M12,
    paddingHorizontal: spacing.M24,
    borderRadius: 8,
    marginTop: spacing.M16,
  },
  buttonText: {
    color: colors.WHITE,
    ...getFontStyle('titleBody', 'small', 'bold'),
  } as TextStyle,
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.M16,
    paddingBottom: spacing.M20,
  },
  loadingText: {
    marginTop: 8,
    color: colors.GRAY,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  errorText: {
    ...getFontStyle('titleBody', 'medium', 'bold'),
    color: colors.RED,
    textAlign: 'center',
    marginBottom: spacing.M8,
  } as TextStyle,
  playlistInfo: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.GRAY,
    marginTop: spacing.M4,
  } as TextStyle,
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    padding: spacing.M20,
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
    marginBottom: spacing.M16,
  } as TextStyle,
  lyricsScrollView: {
    width: '100%',
    marginBottom: spacing.M16,
  },
  lyricsText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
    textAlign: 'center',
  } as TextStyle,
  modalCloseButton: {
    backgroundColor: colors.GREEN,
    paddingVertical: spacing.M12,
    paddingHorizontal: spacing.M20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  progressContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.M24,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: spacing.M8,
  },
  timeTextStyle: {
    color: colors.GRAY,
    width: 45,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  albumArtPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_GRAY,
  },
  adOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  adText: {
    color: colors.WHITE,
    fontSize: 18,
    marginBottom: spacing.M16,
  },
  skipAdButton: {
    backgroundColor: colors.RED,
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M16,
    borderRadius: 8,
  },
  skipAdText: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  playlistOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 10,
  },
  playlistCloseArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playlistContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: colors.BLACK,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 1,
    borderLeftColor: colors.GRAY,
  },
  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  playlistHeaderTitle: {
    ...getFontStyle('titleBody', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  playlistScrollView: {
    maxHeight: 200,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.M12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  playlistItemActive: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  playlistItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistItemImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: spacing.M12,
  },
  playlistItemImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: colors.LIGHT_GRAY,
    marginRight: spacing.M12,
  },
  playlistItemInfo: {
    flex: 1,
  },
  playlistItemTitle: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  playlistItemTitleActive: {
    color: colors.GREEN,
  } as TextStyle,
  playlistItemArtist: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.GRAY,
  } as TextStyle,
  playlistItemPlayingIndicator: {
    marginLeft: spacing.M12,
  },
  playlistItemPlayingText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.GREEN,
  } as TextStyle,
});

export default NowPlayingScreen; 