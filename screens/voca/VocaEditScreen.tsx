import { RouteProp, useRoute } from '@react-navigation/native';
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
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import SelectButton from '../../components/SelectButton';

export default function VocaEditScreen() {
  const route = useRoute<RouteProp<VocaStackParamList, 'VocaContentEdit'>>();
  const { type, Index } = route.params || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();

  const languages = ['English', '日本語', 'Tiếng Việt', '中文', 'Русский'];
  const typeNameWord = '단어';

  const handleSubmit = () => {
    console.log('Word:', title);
    console.log('Description:', description);
    console.log('Language:', selectedLanguage);
    console.log('Type:', type, 'Index:', Index);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>{type || 'Type 없음'}</Text>
        </View>
        <Margin size={'M12'} />
        
        <TextInput
          style={styles.form__input}
          placeholder={type+'추가하기'}
          value={title}
          onChangeText={setTitle}
        />
        <Margin size={'M4'} />
        {type === typeNameWord && (
          <TextInput
            style={[styles.form__input, styles.form__textarea]}
            placeholder="단어 해석"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        )}
        <Margin size={'M4'} />
        
        <SelectButton
          options={languages}
          selectedOption={selectedLanguage}
          onSelect={setSelectedLanguage}
          disabled={false} 
        />
        <Margin size={'M12'} />
        
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
    height: 50,
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
