import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextStyle, Text } from 'react-native';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { spacing, VocaNavigations } from '../../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import FAB from '../../components/common/FAB';
import { VocaStackParamList } from '../../navigations/stack/beforeLogin/VocaStackNavigator';
import Margin from '../../components/division/Margin';
import { getFontStyle } from '../../constants';
import { colors } from '../../constants';
import VocaContentList from '../../components/voca/VocaContentList';
import VocaContentSearch from '../../components/voca/VocaContentSearch';
import { PullToRefresh } from '../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<VocaStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function VocaContentScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<VocaStackParamList, 'VocaContent'>>();
  const { vocaIndex } = route.params || {};
  const queryClient = useQueryClient();
 
  const navigateToVocaUpdateWord = (wordIndex: number) => {
    navigation.navigate(VocaNavigations.WORDCONTENTEDIT, { vocaIndex, wordIndex });
  };

  const navigateToVocaAddWord = () => {
    navigation.navigate(VocaNavigations.WORDCONTENTEDIT, {vocaIndex, wordIndex: undefined });
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 단어 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['words', vocaIndex] });
    queryClient.invalidateQueries({ queryKey: ['vocas'] });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} isFlatList={true}>
      <SafeAreaView style={styles.container}>
        <Margin size={'M16'} />
        <View style={styles.header}>
          <Text style={styles.header__title}>단어 목록</Text>
          <Text style={styles.header__subtitle}>학습할 단어를 선택하세요</Text>
        </View>
        <Margin size={'M12'} />
        <VocaContentSearch />
        <Margin size={'M4'} />
        <View style={styles.content}>
          <VocaContentList navigateToWordDetail={navigateToVocaUpdateWord} />
        </View>
        <FAB onPress={navigateToVocaAddWord} />
      </SafeAreaView>
    </PullToRefresh>
  );
}

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
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default VocaContentScreen;
