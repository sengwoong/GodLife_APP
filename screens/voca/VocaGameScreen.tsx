import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  TextStyle,
  Alert
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';

type VocaGameRouteProp = RouteProp<{
  VocaGame: { vocaIndex: number };
}, 'VocaGame'>;

interface Word {
  id: number;
  english: string;
  korean: string;
}

interface GameWord extends Word {
  options: string[];
  correctAnswer: string;
}

const VocaGameScreen = () => {
  const route = useRoute<VocaGameRouteProp>();
  const navigation = useNavigation();
  const { vocaIndex } = route.params;
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // 임시 데이터 - 실제로는 API에서 가져와야 함
  const [gameWords, setGameWords] = useState<GameWord[]>([
    {
      id: 1,
      english: 'APPLE',
      korean: '사과',
      options: ['사과', '배', '바나나'],
      correctAnswer: '사과'
    },
    {
      id: 2,
      english: 'BOOK',
      korean: '책',
      options: ['책', '펜', '노트'],
      correctAnswer: '책'
    },
    {
      id: 3,
      english: 'CAR',
      korean: '자동차',
      options: ['자동차', '버스', '기차'],
      correctAnswer: '자동차'
    }
  ]);

  const currentWord = gameWords[currentWordIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === currentWord.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // 게임 종료
      Alert.alert(
        '게임 완료!',
        `점수: ${score}/${gameWords.length}`,
        [
          {
            text: '다시하기',
            onPress: () => {
              setCurrentWordIndex(0);
              setScore(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
            }
          },
          {
            text: '종료',
            style: 'cancel',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const handleSkip = () => {
    handleNextQuestion();
  };

  const getAnswerStyle = (option: string) => {
    if (!isAnswered) return styles.answerOption;
    
    if (option === currentWord.correctAnswer) {
      return [styles.answerOption, styles.correctAnswer];
    } else if (option === selectedAnswer && option !== currentWord.correctAnswer) {
      return [styles.answerOption, styles.wrongAnswer];
    }
    
    return styles.answerOption;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M16'} />

      {/* 점수 표시 */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>점수: {score}/{gameWords.length}</Text>
      </View>

      <Margin size={'M32'} />

      {/* 영어 단어 */}
      <View style={styles.wordContainer}>
        <Text style={styles.englishWord}>{currentWord.english}</Text>
      </View>

      <Margin size={'M32'} />

      {/* 선택지 */}
      <View style={styles.optionsContainer}>
        {currentWord.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getAnswerStyle(option)}
            onPress={() => handleAnswerSelect(option)}
            disabled={isAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Margin size={'M32'} />

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>스킵</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextQuestion}
        >
          <Text style={styles.nextButtonText}>다음 문제</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.M12,
  },
  iconButton: {
    padding: spacing.M8,
  },
  iconText: {
    fontSize: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  wordContainer: {
    alignItems: 'center',
    paddingVertical: spacing.M24,
  },
  englishWord: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
    fontSize: 48,
  } as TextStyle,
  optionsContainer: {
    gap: spacing.M12,
  },
  answerOption: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    paddingVertical: spacing.M16,
    paddingHorizontal: spacing.M20,
    alignItems: 'center',
  },
  correctAnswer: {
    backgroundColor: colors.GREEN,
    borderColor: colors.GREEN,
  },
  wrongAnswer: {
    backgroundColor: colors.RED,
    borderColor: colors.RED,
  },
  optionText: {
    ...getFontStyle('body', 'large', 'medium'),
    color: colors.BLACK,
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.M12,
    marginTop: 'auto',
    marginBottom: spacing.M32,
  },
  skipButton: {
    flex: 1,
    backgroundColor: colors.RED,
    borderRadius: 8,
    paddingVertical: spacing.M16,
    alignItems: 'center',
  },
  skipButtonText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  nextButton: {
    flex: 1,
    backgroundColor: colors.GREEN,
    borderRadius: 8,
    paddingVertical: spacing.M16,
    alignItems: 'center',
  },
  nextButtonText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
});

export default VocaGameScreen; 