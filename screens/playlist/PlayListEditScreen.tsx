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
  TextStyle,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors, getFontStyle, spacing } from '../../constants';
import Margin from '../../components/division/Margin';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';

export default function PlayListEditScreen() {
  const [title, setTitle] = useState('');
  const [URL, setURL] = useState('');

  const route = useRoute<RouteProp<PlayListStackParamList, 'PlayListEdit'>>();
  const { type, Index } = route.params || {};

  const typeNameMusic = '음악';

  const handleSubmit = () => {
    console.log('Title:', title);
    console.log('URL:', URL);
    console.log('Type:', type);
    console.log('Index:', Index);
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
        {type === typeNameMusic && (
          <TextInput
            style={[styles.form__input, styles.form__textarea]}
            placeholder="URL 링크"
            value={URL}
            onChangeText={setURL}
            multiline
          />
        )}
     
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
  }as TextStyle ,
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
    fontSize: 18,
  },
});
