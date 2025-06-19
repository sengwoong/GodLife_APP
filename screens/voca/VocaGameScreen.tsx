import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { colors, spacing } from '../../constants';
import CustomButton from '../../components/CustomButton';
import Margin from '../../components/division/Margin';
import { useVocaWords } from '../../server/query/hooks/useVoca';
import { RouteProp, useRoute } from '@react-navigation/native';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import useAuthStore from '../../store/useAuthStore';
import axios from 'axios';

const { width } = Dimensions.get('window');

interface GameWord {
  id: number;
  word: string;
  meanings: string[];
  correct: string;
}

type VocaGameScreenRouteProp = RouteProp<VocaStackParamList, 'VOCAGAME'>;

export function VocaGameScreen() {
  const route = useRoute<VocaGameScreenRouteProp>();
  const vocaId = route.params?.vocaId;
  const { user } = useAuthStore();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [isSavingScore, setIsSavingScore] = useState(false);

  const { data: vocaWords, isLoading } = useVocaWords(vocaId);

  useEffect(() => {
    if (vocaWords) {
      const words: GameWord[] = vocaWords.map((word: { id: number; word: string; meaning: string; wrongMeanings: string[] }) => ({
        id: word.id,
        word: word.word,
        meanings: [word.meaning, ...word.wrongMeanings].sort(() => Math.random() - 0.5),
        correct: word.meaning
      }));
      setGameWords(words);
    }
  }, [vocaWords]);

  const saveGameScore = async () => {
    if (!user?.id || !vocaId) return;

    try {
      setIsSavingScore(true);
      const response = await axios.post('http://localhost:3000/api/points/voca-game', {
        userId: user.id,
        vocaId,
        score,
        totalWords: gameWords.length,
      });

      if (response.data.success) {
        Alert.alert(
          '게임 종료!', 
          `획득한 포인트: ${response.data.data.pointsEarned}\n최종 점수: ${score}/${gameWords.length}`
        );
      }
    } catch (error) {
      console.error('점수 저장 실패:', error);
      Alert.alert('오류', '점수 저장에 실패했습니다.');
    } finally {
      setIsSavingScore(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentWord.correct) {
      setScore(prev => prev + 1);
      Alert.alert('정답입니다! 🎉');
    } else {
      Alert.alert('틀렸습니다 😢', `정답은 "${currentWord.correct}" 입니다.`);
    }

    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setShowResult(true);
      saveGameScore();
    }
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setShowResult(false);
  };

  if (isLoading || isSavingScore) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.GREEN} />
      </SafeAreaView>
    );
  }

  if (!gameWords || gameWords.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noWordsText}>단어장에 단어가 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const currentWord = gameWords[currentWordIndex];

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>게임 종료!</Text>
          <Margin size="M16" />
          <Text style={styles.resultScore}>
            점수: {score} / {gameWords.length}
          </Text>
          <Margin size="M32" />
          <CustomButton
            label="다시 시작"
            onPress={restartGame}
            color="BLACK"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentWordIndex + 1) / gameWords.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentWordIndex + 1} / {gameWords.length}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>점수: {score}</Text>
        </View>
      </View>
      <View style={styles.gameContainer}>
        <View style={styles.wordContainer}>
          <Text style={styles.englishWord}>{currentWord.word}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {currentWord.meanings.map((meaning, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(meaning)}
            >
              <Text style={styles.optionText}>{meaning}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => handleAnswer('')}
        >
          <Text style={styles.skipButtonText}>스킵</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.M16,
    paddingTop: spacing.M16,
  },
  progressContainer: {
    marginBottom: spacing.M16,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.GREEN,
  },
  progressText: {
    textAlign: 'center',
    marginTop: spacing.M8,
    color: colors.GRAY,
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.M16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GREEN,
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: spacing.M16,
    justifyContent: 'space-between',
    paddingBottom: spacing.M32,
  },
  wordContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    padding: spacing.M24,
    marginVertical: spacing.M32,
    borderRadius: 20,
  },
  englishWord: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.BLACK,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.M16,
    maxHeight: 320,
  },
  optionButton: {
    backgroundColor: colors.WHITE,
    padding: spacing.M16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,

  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.BLACK,
  },
  skipButton: {
    backgroundColor: colors.LIGHT_RED,
    padding: spacing.M16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.M16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.WHITE,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.M16,
  },
  resultTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.BLACK,
  },
  resultScore: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.GREEN,
  },
  noWordsText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.BLACK,
    textAlign: 'center',
  },
});

export default VocaGameScreen; 