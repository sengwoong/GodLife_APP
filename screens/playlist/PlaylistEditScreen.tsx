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
import { useCreatePlayList, usePlayList, useUpdatePlayList } from '../../server/query/hooks/usePlayList';
import useAuthStore from '../../store/useAuthStore';
import useUserId from '../../server/query/hooks/useUserId';

export default function PlaylistEditScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const route = useRoute<RouteProp<PlayListStackParamList, 'PlaylistEdit'>>();
  const { playListIndex } = route.params;
  const { data: playlistData } = usePlayList(playListIndex);
  
  const userId = useUserId();
//   if (!userId) {
//     throw new Error('User ID is undefined');
//   }

  const createPlaylistMutation = useCreatePlayList();
  const updatePlaylistMutation = useUpdatePlayList();

  useEffect(() => {
    if (playlistData) {
      setTitle(playlistData.playlistTitle);
      setDescription(playlistData.description || '');
    }
  }, [playlistData]);

  const handleSubmit = async () => {
    try {
      const playlistData = {
        playlistTitle: title,
        description,
        imageUrl: '',
      };

      if (playListIndex) {
        await updatePlaylistMutation.mutateAsync({
          playlistId: playListIndex,
          ...playlistData,
          userId,
        });
      } else {
        await createPlaylistMutation.mutateAsync({
          playlistData,
          userId,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>
            {playListIndex ? '플레이리스트 수정하기' : '플레이리스트 만들기'}
          </Text>
        </View>
        <Margin size={'M12'} />
        
        <TextInput
          style={styles.form__input}
          placeholder={'플레이리스트 제목을 입력하세요'}
          value={title}
          onChangeText={setTitle}
        />
        <Margin size={'M4'} />
        <TextInput
          style={[styles.form__input, styles.form__textarea]}
          placeholder="플레이리스트 설명을 입력하세요"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Margin size={'M12'} />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={createPlaylistMutation.isPending || updatePlaylistMutation.isPending}
        >
          <Text style={styles.button__text}>
            {playListIndex ? '수정하기' : '만들기'}
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
