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
  TextStyle,
  ActivityIndicator,
  Alert
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
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');

  const { data: wordData, isLoading } = wordId !== undefined ? useWord(vocaId, wordId) : { data: null, isLoading: false };

  const navigation = useNavigation();
  const createWordMutation = useCreateWord();
  const updateWordMutation = useUpdateWord();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (wordData) {
      setWord(wordData.word);
      setMeaning(wordData.meaning);
    }
  }, [wordData]);

  const handleSubmit = async () => {
    if (!word.trim() || !meaning.trim()) {
      Alert.alert('입력 오류', '영어 단어와 한글 뜻을 모두 입력해주세요.');
      return;
    }

    try {
      if (wordId !== undefined && wordData) {
        if (!userId) {
          throw new Error('User ID is not available');
        }

        await updateWordMutation.mutateAsync({
          wordId: wordData.id,
          data: {
            word: word.trim(),
            meaning: meaning.trim(),
          },
          userId: userId,
        });

        queryClient.invalidateQueries({ 
          queryKey: ['words', vocaId]
        });

        queryClient.invalidateQueries({ 
          queryKey: ['word', vocaId, wordId]
        });

        Alert.alert('성공', '단어가 성공적으로 수정되었습니다.');
      } else {
        await createWordMutation.mutateAsync({
          word: word.trim(),
          meaning: meaning.trim(),
          vocaId,
        });

        queryClient.invalidateQueries({ 
          queryKey: ['words', vocaId]
        });

        Alert.alert('성공', '단어가 성공적으로 추가되었습니다.');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving word:', error);
      Alert.alert('오류', '단어 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.GREEN} />
          <Text style={styles.loadingText}>단어 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isSubmitting = createWordMutation.isPending || updateWordMutation.isPending;

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
          value={word}
          onChangeText={setWord}
          editable={!isSubmitting}
        />
        <Margin size={'M4'} />

        <TextInput
          style={[styles.form__input, styles.form__textarea]}
          placeholder="한글 뜻"
          value={meaning}
          onChangeText={setMeaning}
          multiline
          editable={!isSubmitting}
        />

        <Margin size={'M8'} />
  
        <TouchableOpacity 
          style={[styles.button, isSubmitting && styles.button__disabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.button__text}>{wordId ? '수정하기' : '등록하기'}</Text>
          )}
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
  button__disabled: {
    backgroundColor: colors.GRAY,
  },
  button__text: {
    color: colors.WHITE,
    ...getFontStyle('titleBody', 'small', 'bold'),
  } as TextStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.M12,
    ...getFontStyle('titleBody', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
});
