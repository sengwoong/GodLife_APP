import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity, View, TextStyle, TextInput, ActivityIndicator, GestureResponderEvent, Alert } from 'react-native';
import { CompositeNavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
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
import { useQueryClient } from '@tanstack/react-query';
import SelectButton from '../../components/SelectButton';
import Icon from 'react-native-vector-icons/AntDesign';
import { useCreateVoca, useDeleteVoca } from '../../server/query/hooks/useVoca';

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
  const [refreshing, setRefreshing] = useState(false);

  // 화면 포커스 시 자동으로 refetch
  useFocusEffect(
    React.useCallback(() => {
      const autoRefresh = async () => {
        await queryClient.invalidateQueries({ 
          queryKey: ['userVocas'], 
          exact: false 
        });
      };
      autoRefresh();
    }, [queryClient, userId])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ 
      queryKey: ['userVocas'], 
      exact: false 
    });
    setRefreshing(false);
  };

  const createVocaMutation = useCreateVoca();
  const deleteVocaMutation = useDeleteVoca();

  const navigateToVocaGame = (vocaId: number) => {
    navigation.navigate(VocaNavigations.VOCAGAME, { vocaId });
  };

  const handleAddVoca = async () => {
    if (!newVocaName.trim() || !userId) {
      Alert.alert('오류', '단어장 이름을 입력해주세요.');
      return;
    }

    try {
      await createVocaMutation.mutateAsync({
        userId: userId,
        vocaTitle: newVocaName.trim(),
        languages: selectedLanguage,
      });
      
      setIsModalVisible(false);
      setNewVocaName('');
      Alert.alert('성공', '단어장이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('❌ 단어장 생성 실패:', error);
      Alert.alert('오류', '단어장 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteVoca = async () => {
    if (!contextMenu.selectedVocaId || !userId) {
      Alert.alert('오류', '삭제할 단어장을 선택해주세요.');
      return;
    }

    try {
      await deleteVocaMutation.mutateAsync({
        vocaId: contextMenu.selectedVocaId,
        userId: userId,
      });
      
      setContextMenu(prev => ({ ...prev, isVisible: false }));
      Alert.alert('성공', '단어장이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('❌ 단어장 삭제 실패:', error);
      Alert.alert('오류', '단어장 삭제에 실패했습니다. 다시 시도해주세요.');
    }
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
        <View style={styles.header__content}>
          <View>
            <Text style={styles.header__title}>단어장</Text>
            <Text style={styles.header__subtitle}>학습할 단어장asdasd을 선택하세요</Text>
          </View>
          <View style={styles.header__buttons}>
            <TouchableOpacity 
              style={styles.header__button} 
              onPress={() => navigation.navigate(VocaNavigations.VOCAAIGENERATE)}
            >
              {React.createElement(Icon as any, { name: "aliwangwang", size: 20, color: colors.BLUE })}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.header__button} 
              onPress={() => {
                Alert.alert('도움말', '단어장 사용법에 대한 도움말입니다.');
              }}
            >
              {React.createElement(Icon as any, { name: "questioncircle", size: 20, color: colors.YELLOW })}
            </TouchableOpacity>
     
          </View>
        </View>
      </View>

      <Margin size={'M12'} />

      <VocaSearch />
      
      <VocaList
        userId={userId!}
        navigateToVocaContent={navigateToVocaGame}
        onLongPress={handleLongPress}
        onRefresh={handleRefresh}
        refreshing={refreshing}
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
            <CompoundOption.Title>"{contextMenu.selectedVocaTitle}" 단어장</CompoundOption.Title>
            <CompoundOption.Button
              onPress={() => {
                navigation.navigate(VocaNavigations.VOCACONTENTEDIT, { vocaId: contextMenu.selectedVocaId! });
                setContextMenu(prev => ({ ...prev, isVisible: false }));
              }}>
              수정하기
            </CompoundOption.Button>
            <CompoundOption.Button
              onPress={() => {

                navigation.navigate(VocaNavigations.VOCACONTENT, { vocaId: contextMenu.selectedVocaId! });
                setContextMenu(prev => ({ ...prev, isVisible: false }));
              }}>
              단어 목록 보기
            </CompoundOption.Button>
            <CompoundOption.Divider />
            <CompoundOption.Button
              isDanger
              onPress={handleDeleteVoca}>
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
  header__content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  header__buttons: {
    flexDirection: 'row',
    gap: spacing.M8,
  },
  header__button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
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
  gameButton: {
    backgroundColor: colors.BLACK,
    padding: spacing.M12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.M12,
  },
  gameButtonText: {
    color: colors.WHITE,
    ...getFontStyle('title', 'medium', 'bold'),
  } as TextStyle,
});

export default VocaScreen;
