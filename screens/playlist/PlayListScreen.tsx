import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, FlatList, View, TextInput, TextStyle } from 'react-native'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { colors, getFontStyle, PlayListNavigations, spacing } from '../../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import SearchBar from '../../components/searchbar/SearchBar';
import Margin from '../../components/division/Margin';
import FAB from '../../components/common/FAB';
import { CompoundOption } from '../../components/Modal';
import { PlayListStackParamList } from '../../navigations/stack/beforeLogin/PlayListStackNavigator';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<PlayListStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function PlayListScreen() {
  const navigation = useNavigation<Navigation>();
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const playListList = [
    { id: 1, title: 'asmr' },
    { id: 2, title: '힙합' },
    { id: 3, title: '고등금지곡' },
    { id: 4, title: '일렉트로닉' },
  ];

  const navigateToPlayListContent = (playlist: { id: number, title: string }) => {
    navigation.navigate(PlayListNavigations.PLAYLISTCONTENT, { 
      playListIndex: playlist.id,
      playListTitle: playlist.title 
    });
  };

  const handleAddPlaylist = () => {
    setIsModalVisible(false);
    setNewPlaylistName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>플레이리스트</Text>
        <Text style={styles.header__subtitle}>플레이리스트를 선택하세요</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['React', 'React Native', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Django', 'Spring']} 
        />
      </View>
      
      <FlatList
        data={playListList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list__item}
            onPress={() => navigateToPlayListContent(item)}>
            <View style={styles.list__content}>
              <Text style={styles.list__title}>{item.title}</Text>
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
            <CompoundOption.Title>새 플레이리스트 만들기</CompoundOption.Title>
            <Margin size={'M12'} />
            <View style={styles.modal__input}>
              <TextInput
                placeholder="플레이리스트 이름을 입력하세요"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
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
                onPress={handleAddPlaylist}>
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
  }as TextStyle ,
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
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  },
  modal__buttons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
});

export default PlayListScreen;