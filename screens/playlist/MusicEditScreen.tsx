import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';
import { useSingleMusic, useCreateMusic, useUpdateMusic } from '../../server/query/hooks/useMusic';
import useAuthStore from '../../store/useAuthStore';
import useUserId from '../../server/query/hooks/useUserId';

export default function MusicEditScreen() {
  const [title, setTitle] = useState('');
  const [URL, setURL] = useState('');
  const navigation = useNavigation();

  const route = useRoute<RouteProp<PlayListStackParamList, 'MusicEdit'>>();
  const { playListIndex, musicIndex } = route.params;
  // const userId = useAuthStore(state => state.user?.id);
  const userId = useUserId();
  if (!userId) {
    throw new Error('User ID is undefined');
  }
  const { data: musicData, isLoading } = musicIndex !== undefined ? useSingleMusic(musicIndex) : { data: null, isLoading: false };
  
  const createMusicMutation = useCreateMusic();
  const updateMusicMutation = useUpdateMusic();

  useEffect(() => {
    if (musicIndex && musicData) {
      setTitle(musicData.musicTitle);
      setURL(musicData.musicUrl);
    }
  }, [musicIndex, musicData]);

  const handleSubmit = async () => {
    try {
      const newMusicData = {
        musicTitle: title,
        musicUrl: URL,
        color: '#000000',
        imageUrl: '',
      };

      if (musicIndex) {
        await updateMusicMutation.mutateAsync({
          musicId: musicIndex,
          ...newMusicData,
          playlistId: playListIndex,
          userId: userId,
        });
      } else {
        await createMusicMutation.mutateAsync({
          ...newMusicData,
          playlistId: playListIndex,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving music:', error);
    }
  };

  if (isLoading && musicIndex) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.GREEN} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>
            {musicIndex ? '음악 수정하기' : '음악 추가하기'}
          </Text>
        </View>
        <Margin size={'M12'} />
        
        <TextInput
          style={styles.form__input}
          placeholder={'음악 제목을 입력하세요'}
          value={title}
          onChangeText={setTitle}
        />
        <Margin size={'M4'} />
        <TextInput
          style={[styles.form__input, styles.form__textarea]}
          placeholder="URL 링크를 입력하세요"
          value={URL}
          onChangeText={setURL}
          multiline
        />
        <Margin size={'M12'} />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.button__text}>
            {musicIndex ? '수정하기' : '추가하기'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.M16,
    backgroundColor: colors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center', 
  },
  header__title: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  form__input: {
    padding: spacing.M16,
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: 5,
  },
  form__textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.GREEN,
    paddingVertical: spacing.M12,
    borderRadius: 5,
    alignItems: 'center',
  },
  button__text: {
    color: colors.WHITE,
    ...getFontStyle('titleBody', 'small', 'bold'),
  } as TextStyle,
});
