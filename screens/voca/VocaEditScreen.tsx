import React, { useState } from 'react';
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
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import SelectButton from '../../components/SelectButton';

export default function VocaEditScreen() {
  const [title, setTitle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const languages = ['English', '日本語', 'Tiếng Việt', '中文', 'Русский'];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>
            새 단어장 만들기
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
          onPress={() => {}}
        >
          <Text style={styles.button__text}>
            등록하기
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