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
  ActivityIndicator 
} from 'react-native';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import { useVoca, useUpdateVoca } from '../../server/query/hooks/useVoca';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/useAuthStore';
import SelectButton from '../../components/SelectButton';

export default function VocaEditScreen() {
  const route = useRoute<RouteProp<VocaStackParamList, 'VocaContentEdit'>>();
  const { vocaIndex } = route.params;
  const user = useAuthStore(state => state.user);
  const userId = user?.id;
  const [title, setTitle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const languages = ['English', '日本語', 'Tiếng Việt', '中文', 'Русский'];

  const { data: vocaData, isLoading } = useVoca(vocaIndex);
  const updateVocaMutation = useUpdateVoca();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (vocaData) {
      setTitle(vocaData.vocaTitle);
      setSelectedLanguage(vocaData.languages || 'English');
    }
  }, [vocaData]);

  const handleSubmit = async () => {
    try {
      if (!userId ) {
        console.log('User not found:', userId);  
        throw new Error('User ID is not available');
      }

      await updateVocaMutation.mutateAsync({
        vocaId: vocaIndex,
        userId,
        data: {
          vocaTitle: title,
          languages: selectedLanguage,
        },
      });

      queryClient.invalidateQueries({ 
        queryKey: ['vocas', userId]
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error updating voca:', error);
    }
  };

  if (isLoading) {
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
            단어장 수정하기
          </Text>
        </View>
        <Margin size={'M12'} />
        
        <TextInput
          style={styles.form__input}
          placeholder={'단어장 이름을 입력하세요'}
          value={title}
          onChangeText={setTitle}
        />
        <Margin size={'M4'} />

        <SelectButton
          options={languages}
          selectedOption={selectedLanguage}
          onSelect={setSelectedLanguage}
          disabled={false}
        />

        <Margin size={'M8'} />
  
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
        >
          <Text style={styles.button__text}>
            수정하기
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