import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextStyle } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainDrawerParamList } from '../../../navigations/drawer/MainDrawerNavigator';
import { colors, getFontStyle, spacing } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';
import { SettingStackParamList } from '../../../navigations/stack/beforeLogin/SettingStackNavigator';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<SettingStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function RecentPlaylistScreen() {
  const navigation = useNavigation<Navigation>();

  const recentPlaylists = [
    { id: 1, title: '나의 플레이리스트 1' },
    { id: 2, title: '운동할 때 듣는 노래' },
    { id: 3, title: '공부할 때 듣는 노래' },
  ];

  const handlePlaylistPress = (playlist: { id: number, title: string }) => {
    // TODO: 플레이리스트 선택 시 처리
    console.log('Selected playlist:', playlist);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.header__title}>최근 플레이리스트</Text>
        <Text style={styles.header__subtitle}>최근에 들은 플레이리스트</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['React', 'React Native', 'JavaScript', 'TypeScript']} 
        />
      </View>
      
      <FlatList
        data={recentPlaylists}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list__item}
            onPress={() => handlePlaylistPress(item)}>
            <View style={styles.list__content}>
              <Text style={styles.list__title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
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
});

export default RecentPlaylistScreen; 