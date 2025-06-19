import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
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
  TextStyle 
} from 'react-native';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import { useWord, useCreateWord, useUpdateWord } from '../../server/query/hooks/useWord';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/useAuthStore';

export default function WordEditScreen() {
  const route = useRoute<RouteProp<VocaStackParamList, 'WORDEDIT'>>();
  const { vocaId, wordId } = route.params;
  const userId = useAuthStore(state => state.user?.id);
  const [english, setEnglish] = useState('');
  const [korean, setKorean] = useState('');

  const { data: wordData, isLoading } = wordId !== undefined ? useWord(vocaId, wordId) : { data: null, isLoading: false };

  const navigation = useNavigation();
  const createWordMutation = useCreateWord();
  const updateWordMutation = useUpdateWord();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (wordData) {
      setEnglish(wordData.english);
      setKorean(wordData.korean);
    }
  }, [wordData]);

  const handleSubmit = async () => {
    try {
      if (wordId !== undefined && wordData) {
        if (!userId) {
          throw new Error('User ID is not available');
        }

        await updateWordMutation.mutateAsync({
          wordId: wordData.id,
          data: {
            english,
            korean,
          },
          userId: userId,
        });

        queryClient.invalidateQueries({ 
          queryKey: ['words', vocaId]
        });

        queryClient.invalidateQueries({ 
          queryKey: ['word', vocaId, wordId]
        });

      } else {
        await createWordMutation.mutateAsync({
          english,
          korean,
          vocaId,
        });

        queryClient.invalidateQueries({ 
          queryKey: ['words', vocaId]
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>{wordId ? '단어 수정하기' : '단어 추가하기'}</Text>
        </View>
        <Margin size={'M12'} />
        
        <TextInput
          style={styles.form__input}
          placeholder={'영어 단어'}
          value={english}
          onChangeText={setEnglish}
        />
        <Margin size={'M4'} />

        <TextInput
          style={[styles.form__input, styles.form__textarea]}
          placeholder="한글 뜻"
          value={korean}
          onChangeText={setKorean}
          multiline
        />

        <Margin size={'M8'} />
  
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
        >
          <Text style={styles.button__text}>등록하기</Text>
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
