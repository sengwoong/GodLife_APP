import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity, View, TextStyle, TextInput, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import { colors, getFontStyle, spacing, VocaNavigations } from '../../constants';
import FAB from '../../components/common/FAB';
import { CompoundOption } from '../../components/Modal';
import Margin from '../../components/division/Margin';
import VocaList from '../../components/voca/VocaList'; 
import VocaSearch from '../../components/voca/VocaSearch';
import useAuthStore from '../../store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../server/common/types/constants';
import SelectButton from '../../components/SelectButton';

// 네비게이션 타입 정의
type Navigation = CompositeNavigationProp<
  StackNavigationProp<VocaStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;


const VocaScreen = () => {
  const navigation = useNavigation<Navigation>(); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [newVocaName, setNewVocaName] = useState(''); 
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    selectedVocaId: null as number | null,
    selectedVocaTitle: null as string | null,
  });

  const languages = ['English', '日本語', 'Tiếng Việt', '中文', 'Русский'];
  const userId = useAuthStore(state => state.user?.id);

  const queryClient = useQueryClient();

  const { mutate: createVoca } = useMutation({
    mutationFn: async (newVocaName: string) => {
      const response = await fetch(`${BASE_URL}/vocas/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vocaTitle: newVocaName, languages: selectedLanguage }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to create new voca');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocas', userId]});
      console.log('단어장 추가 성공');
    },
  });

  const navigateToVocaContent = (vocaIndex: number) => {
    navigation.navigate(VocaNavigations.VOCACONTENT, { vocaIndex });
  };

  const navigateToVocaGame = (vocaIndex: number) => {
    navigation.navigate(VocaNavigations.VOCAGAME, { vocaIndex });
  };

  const handleAddVoca = () => {
    if (!newVocaName.trim()) return;
    createVoca(newVocaName); 
    setIsModalVisible(false);
    setNewVocaName('');
  };

  const handleContextMenuPress = (vocaId: number, vocaTitle: string) => {
    setContextMenu({
      isVisible: true,
      selectedVocaId: vocaId,
      selectedVocaTitle: vocaTitle,
    });
  };

  const handleLongPress = (vocaId: number, vocaTitle: string) => {
    setContextMenu({
      isVisible: true,
      selectedVocaId: vocaId,
      selectedVocaTitle: vocaTitle,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      <Margin size={'M16'} />

      <View style={styles.header}>
        <Text style={styles.header__title}>단어장</Text>
        <Text style={styles.header__subtitle}>학습할 단어장을 선택하세요</Text>
      </View>

      <Margin size={'M12'} />

      <VocaSearch />
      
      <VocaList
        userId={userId!}
        navigateToVocaGame={navigateToVocaGame}
        onLongPress={handleLongPress}
      />
      
      <FAB onPress={() => setIsModalVisible(true)} /> 



      <CompoundOption
        isVisible={isModalVisible} 
        hideOption={() => setIsModalVisible(false)}
      >
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
              />
            </View>
            <Margin size={'M12'} />
            <View style={styles.modal__input}>
              <SelectButton
                options={languages}
                selectedOption={selectedLanguage}
                onSelect={setSelectedLanguage}
                disabled={false} 
              />
            </View>
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



      <CompoundOption
        isVisible={contextMenu.isVisible}
        hideOption={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
      >
        <CompoundOption.Background>
          <CompoundOption.Container>
            <CompoundOption.Title>{contextMenu.selectedVocaTitle} 단어장</CompoundOption.Title>

            <Margin size={'M12'} />
            <CompoundOption.Button
              onPress={() => {
                navigation.navigate(VocaNavigations.VOCACONTENTEDIT, { vocaIndex: contextMenu.selectedVocaId! });
              }}>
              단어장 수정하기
            </CompoundOption.Button>

            <CompoundOption.Button
              onPress={() => navigateToVocaContent(contextMenu.selectedVocaId!)}>
              단어로 이동
            </CompoundOption.Button>
            <CompoundOption.Button
              isDanger
              onPress={() => {
                console.log('삭제:', contextMenu.selectedVocaId);
              }}>
              삭제하기
            </CompoundOption.Button>
          </CompoundOption.Container>
        </CompoundOption.Background>
      </CompoundOption>
    </SafeAreaView>
  );
};

// 스타일 정의
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
  search: {
    paddingHorizontal: spacing.M20,
    width: '100%',
    alignItems: 'center',
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
  },
  modal__input: {
    paddingHorizontal: spacing.M16,
    paddingBottom: spacing.M16,
  },
  modal__textInput: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    padding: spacing.M12,
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  },
  modal__buttons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
});

export default VocaScreen;
