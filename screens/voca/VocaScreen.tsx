import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity, View, TextStyle, TextInput } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import { colors, getFontStyle, spacing, VocaNavigations } from '../../constants';
import SearchBar from '../../components/searchbar/SearchBar';
import FAB from '../../components/common/FAB';
import { CompoundOption } from '../../components/Modal';
import Margin from '../../components/division/Margin';


type Navigation = CompositeNavigationProp<
  StackNavigationProp<VocaStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function VocaScreen() {
  const navigation = useNavigation<Navigation>();
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newVocaName, setNewVocaName] = useState('');

  const [vocaList, setVocaList] = useState([
    { id: 1, title: '초등단어' },
    { id: 2, title: '중등단어' },
    { id: 3, title: '고등단어' },
    { id: 4, title: '중등단어' },
  ]);

  const navigateToVocaContent = (vocaIndex: number) => {
    navigation.navigate(VocaNavigations.VOCACONTENT, { vocaIndex });
  };

  const handleAddVoca = () => {
    if (!newVocaName.trim()) return;
    
    const newVoca = {
      id: vocaList.length + 1,
      title: newVocaName.trim(),
    };
    
    setVocaList([...vocaList, newVoca]);
    setIsModalVisible(false);
    setNewVocaName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>단어장</Text>
        <Text style={styles.header__subtitle}>학습할 단어장을 선택하세요</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['React', 'React Native', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Django', 'Spring']} 
        />
      </View>
      
      <FlatList
        data={vocaList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list__item}
            onPress={() => navigateToVocaContent(item.id)}>
            <View style={styles.list__content}>
              <Text style={styles.list__title}>{item.title}</Text>
              <Text style={styles.list__count}>32개의 단어</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      
      <FAB onPress={() => setIsModalVisible(true)} />

      <CompoundOption
        isVisible={isModalVisible}
        hideOption={() => setIsModalVisible(false)}
        animationType="slide">
        <CompoundOption.Background>
          <CompoundOption.Container style={styles.modal}>
            <CompoundOption.Title>새 단어장 만들기</CompoundOption.Title>
            <Margin size={'M12'} />
            <View style={styles.modal__input}>
              <TextInput
                placeholder="단어장 이름을 입력하세요"
                value={newVocaName}
                onChangeText={setNewVocaName}
                autoFocus
                style={styles.modal__textInput}
              />
            </View>
            <Margin size={'M12'} />
            <CompoundOption.Divider />
            
            <View style={styles.modal__buttons}>
              <CompoundOption.Button 
                onPress={() => setIsModalVisible(false)}>
                취소
              </CompoundOption.Button>
              <CompoundOption.Button 
                onPress={handleAddVoca}>
                추가
              </CompoundOption.Button>
            </View>
          </CompoundOption.Container>
        </CompoundOption.Background>
      </CompoundOption>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    paddingHorizontal: spacing.M20,
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
  search: {
    paddingHorizontal: spacing.M20,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.M16,
  },
  list: {
    paddingHorizontal: spacing.M20,
  },
  list__item: {
    paddingVertical: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  list__content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
  list__count: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  modal: {
    backgroundColor: colors.WHITE,
    paddingTop: spacing.M16,
  },
  modal__input: {
    paddingHorizontal: spacing.M16,
  },
  modal__textInput: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    padding: spacing.M12,
    fontSize: 16,
    color: colors.BLACK,
  },
  modal__buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.M16,
  },
});

export default VocaScreen;
