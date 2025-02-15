import React, { useMemo, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextStyle, Text } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/searchbar/SearchBar';
import { spacing, VocaNavigations } from '../../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import BulletinBoard from '../../components/BulletinBoard';
import FAB from '../../components/common/FAB';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import Margin from '../../components/division/Margin';
import { getFontStyle } from '../../constants';
import { colors } from '../../constants';

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
    <SafeAreaView style={styles.container}>
      <Margin size={'M16'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>단어 목록</Text>
        <Text style={styles.header__subtitle}>학습할 단어를 선택하세요</Text>
      </View>
      <Margin size={'M12'} />
      <View style={styles.search}>
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
      </View>
      <Margin size={'M4'} />
      <View style={styles.content}>
        <BulletinBoard data={schedules} onItemPress={navigateToVocaUpdateWord} />
      </View>
      <FAB onPress={navigateToVocaAddWord} />
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.M20,
  },
});

export default VocaContentScreen;
