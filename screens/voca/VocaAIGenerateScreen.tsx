import React, { useState } from 'react';
import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  TextStyle, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import { CompoundOption } from '../../components/Modal';
import SelectButton from '../../components/SelectButton';
import useAuthStore from '../../store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../server/common/types/constants';
import { useGenerateVocabulary } from '../../server/query/hooks/useVocaAI';

const VocaAIGenerateScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vocaTitle, setVocaTitle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [selectedTopic, setSelectedTopic] = useState<string>('일상생활');
  const [selectedLevel, setSelectedLevel] = useState<string>('초급');
  const [wordCount, setWordCount] = useState<string>('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWords, setGeneratedWords] = useState<Array<{word: string, meaning: string}>>([]);

  const userId = useAuthStore(state => state.user?.id);
  const queryClient = useQueryClient();

  const languages = ['English', '日本語', 'Tiếng Việt', '中文', 'Русский'];
  const topics = ['일상생활', '비즈니스', '여행', '음식', '스포츠', '음악', '영화', '기술', '의학', '교육'];
  const levels = ['초급', '중급', '고급'];

  // AI 단어 생성 뮤테이션
  const generateVocabularyMutation = useGenerateVocabulary();

  const generateWords = () => {
    setIsGenerating(true);
    
    // 난이도를 Dongo_Ai 형식으로 변환
    const getSchoolLevel = (level: string) => {
      switch (level) {
        case '초급': return '초등';
        case '중급': return '중등';
        case '고급': return '고등';
        default: return '중등';
      }
    };

    generateVocabularyMutation.mutate(
      {
        count: parseInt(wordCount),
        school_level: getSchoolLevel(selectedLevel),
        topic: selectedTopic,
        language: selectedLanguage,
        userId: userId?.toString(),
        vocaId: vocaTitle
      },
      {
        onSuccess: (response) => {
          if (response.status === 'success' && response.data) {
            const words = response.data.map(item => ({
              word: item.word,
              meaning: item.meaning
            }));
            setGeneratedWords(words);
            setIsModalVisible(false);
          } else {
            Alert.alert('오류', '단어 생성에 실패했습니다.');
          }
          setIsGenerating(false);
        },
        onError: (error) => {
          console.error('AI 단어 생성 실패:', error);
          
          // 네트워크 에러인 경우 더 자세한 안내
          if (error instanceof TypeError && error.message.includes('Network request failed')) {
            Alert.alert(
              '네트워크 오류', 
              '백엔드 서버에 연결할 수 없습니다.\n\n1. Dongo_Ai 서버가 실행 중인지 확인하세요\n2. 포트 8000번에서 실행되고 있는지 확인하세요\n3. 네트워크 연결을 확인하세요'
            );
          } else {
            Alert.alert('오류', `단어 생성에 실패했습니다.\n${error.message}`);
          }
          setIsGenerating(false);
        }
      }
    );
  };

  // 단어장 생성 뮤테이션
  const { mutate: createVocaWithWords } = useMutation({
    mutationFn: async () => {
      const url = `${BASE_URL}/vocas/user/${userId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          vocaTitle, 
          languages: selectedLanguage 
        }),
      });
      if (!response.ok) {
        throw new Error('단어장 생성에 실패했습니다.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocas', userId]});
      Alert.alert('성공', 'AI로 생성된 단어가 포함된 단어장이 생성되었습니다!');
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('오류', '단어장 생성에 실패했습니다.');
    },
  });

  const handleGenerateWords = () => {
    if (!vocaTitle.trim()) {
      Alert.alert('알림', '단어장 이름을 입력해주세요.');
      return;
    }
    generateWords();
  };

  const handleCreateVoca = () => {
    if (generatedWords.length === 0) {
      Alert.alert('알림', '먼저 단어를 생성해주세요.');
      return;
    }
    createVocaWithWords();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M16'} />

      <View style={styles.header}>
        <Text style={styles.header__title}>AI 단어 생성</Text>
        <Text style={styles.header__subtitle}>AI가 주제에 맞는 단어를 생성해드립니다</Text>
      </View>

      <Margin size={'M12'} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.section__title}>단어장 정보</Text>
          <Margin size={'M8'} />
          <TextInput
            style={styles.input}
            placeholder="단어장 이름을 입력하세요"
            value={vocaTitle}
            onChangeText={setVocaTitle}
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.section}>
          <Text style={styles.section__title}>언어 선택</Text>
          <Margin size={'M8'} />
          <SelectButton
            options={languages}
            selectedOption={selectedLanguage}
            onSelect={setSelectedLanguage}
            disabled={false}
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.section}>
          <Text style={styles.section__title}>주제 선택</Text>
          <Margin size={'M8'} />
          <SelectButton
            options={topics}
            selectedOption={selectedTopic}
            onSelect={setSelectedTopic}
            disabled={false}
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.section}>
          <Text style={styles.section__title}>난이도</Text>
          <Margin size={'M8'} />
          <SelectButton
            options={levels}
            selectedOption={selectedLevel}
            onSelect={setSelectedLevel}
            disabled={false}
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.section}>
          <Text style={styles.section__title}>단어 개수</Text>
          <Margin size={'M8'} />
          <TextInput
            style={styles.input}
            placeholder="생성할 단어 개수 (5-20)"
            value={wordCount}
            onChangeText={setWordCount}
            keyboardType="numeric"
          />
        </View>

        <Margin size={'M24'} />

        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={() => setIsModalVisible(true)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color={colors.WHITE} />
          ) : (
            <Text style={styles.generateButton__text}>AI 단어 생성하기</Text>
          )}
        </TouchableOpacity>

        {generatedWords.length > 0 && (
          <>
            <Margin size={'M24'} />
            <View style={styles.section}>
              <Text style={styles.section__title}>생성된 단어</Text>
              <Margin size={'M12'} />
              {generatedWords.map((word, index) => (
                <View key={index} style={styles.wordItem}>
                  <View style={styles.wordItem__content}>
                    <Text style={styles.wordItem__word}>{word.word}</Text>
                    <Text style={styles.wordItem__separator}>:</Text>
                    <Text style={styles.wordItem__meaning}>{word.meaning}</Text>
                  </View>
                </View>
              ))}
              <Margin size={'M16'} />
              <TouchableOpacity 
                style={styles.createButton} 
                onPress={handleCreateVoca}
              >
                <Text style={styles.createButton__text}>단어장 생성하기</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <CompoundOption
        isVisible={isModalVisible} 
        hideOption={() => setIsModalVisible(false)}
      >
        <CompoundOption.Background>
          <CompoundOption.Container style={styles.modal}>
            <CompoundOption.Title>AI 단어 생성</CompoundOption.Title>
            <Margin size={'M12'} />
            <Text style={styles.modal__description}>
              {selectedTopic} 주제로 {selectedLevel} 난이도의 단어 {wordCount}개를 생성하시겠습니까?
            </Text>
            <CompoundOption.Divider />
            
            <View style={styles.modal__buttons}>
              <CompoundOption.Button 
                onPress={() => setIsModalVisible(false)}>
                취소
              </CompoundOption.Button>
              <CompoundOption.Button 
                onPress={handleGenerateWords}>
                생성하기
              </CompoundOption.Button>
            </View>
          </CompoundOption.Container>
        </CompoundOption.Background>
      </CompoundOption>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: spacing.M16,
  },
  header: {
    backgroundColor: colors.WHITE,
  },
  header__title: {
    color: colors.BLACK,
    ...getFontStyle('title', 'large', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  header__subtitle: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  content: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.M16,
  },
  section__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    marginBottom: spacing.M8,
  } as TextStyle,
  input: {
    padding: spacing.M16,
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  generateButton: {
    backgroundColor: colors.GREEN,
    paddingVertical: spacing.M16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.M16,
  },
  generateButton__text: {
    color: colors.WHITE,
    ...getFontStyle('title', 'medium', 'bold'),
  } as TextStyle,
  wordItem: {
    paddingVertical: spacing.M12,
    paddingHorizontal: spacing.M16,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 8,
    marginBottom: spacing.M8,
  },
  wordItem__content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordItem__word: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
  wordItem__separator: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    marginHorizontal: spacing.M8,
  } as TextStyle,
  wordItem__meaning: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  createButton: {
    backgroundColor: colors.BLACK,
    paddingVertical: spacing.M16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton__text: {
    color: colors.WHITE,
    ...getFontStyle('title', 'medium', 'bold'),
  } as TextStyle,
  modal: {
    backgroundColor: colors.WHITE,
  },
  modal__description: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
    textAlign: 'center',
    paddingHorizontal: spacing.M16,
  } as TextStyle,
  modal__buttons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
});

export default VocaAIGenerateScreen; 