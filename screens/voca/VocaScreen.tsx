import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity, View, TextStyle, TextInput, ActivityIndicator } from 'react-native';
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
import { useInfiniteVoca } from '../../server/query/hooks/useVoca';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<VocaStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function VocaScreen() {
  const navigation = useNavigation<Navigation>();
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newVocaName, setNewVocaName] = useState('');

  const userId = 1;
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVoca(userId);

  const navigateToVocaContent = (vocaIndex: number) => {
    navigation.navigate(VocaNavigations.VOCACONTENT, { vocaIndex });
  };

  const handleAddVoca = () => {
    if (!newVocaName.trim()) return;
    
    const newVoca = {
      title: newVocaName.trim(),
    };
    
    setIsModalVisible(false);
    setNewVocaName('');
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M16'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>단어장</Text>
        <Text style={styles.header__subtitle}>학습할 단어장을 선택하세요</Text>
      </View>
      <Margin size={'M12'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['React', 'React Native', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Django', 'Spring']} 
        />
      </View>
      
      <FlatList
        data={data?.pages.flatMap(page => page.content)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list__item}
            onPress={() => navigateToVocaContent(item.id)}>
            <View style={styles.list__content}>
              <Text style={styles.list__title}>{item.vocaTitle}</Text>
              <Text style={styles.list__count}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={colors.GREEN} /> : null}
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
