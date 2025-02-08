import React, { useMemo, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextStyle } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/searchbar/SearchBar';
import { spacing, VocaNavigations } from '../../constants';
import { VocaStackParamList } from '../../navigations/stack/VocaStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import BulletinBoard from '../../components/BulletinBoard';
import FAB from '../../components/common/FAB';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<VocaStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function VocaContentScreen() {
  const navigation = useNavigation<Navigation>();
  const [searchText, setSearchText] = useState<string>('');

  const schedules = useMemo(
    () => [
      { id: 20, title: '프로젝트 마감', content: '프로젝트 마감 상세 내용', time: '5:00 PM', day: 10 },
      { id: 31, title: '친구 생일', content: '친구 생일 상세 내용', time: 'All Day', day: 20 },
      { id: 10, title: '미팅', content: '미팅 상세 내용', time: '10:00 AM', day: 30 },
    ],
    []
  );

  const navigateToVocaUpdateWord = (Index: number) => {
    navigation.navigate(VocaNavigations.VOCACONTENTEDIT, {type:'단어', Index });
  };

  const navigateToVocaAddWord = () => {
    navigation.navigate(VocaNavigations.VOCACONTENTEDIT, {type:'단어', Index:undefined});
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <SearchBar
          initialSuggestions={[
            'React',
            'React Native',
            'JavaScript',
            'TypeScript',
            'Node.js',
            'Python',
            'Django',
            'Spring',
          ]}
        />
        <BulletinBoard data={schedules} onItemPress={navigateToVocaUpdateWord} />
      </SafeAreaView>
      <FAB onPress={navigateToVocaAddWord} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.M20,
    alignItems: 'center',
  },
});

export default VocaContentScreen;
