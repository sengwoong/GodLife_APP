import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextStyle, Text, TouchableOpacity } from 'react-native';
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
import { useQueryClient } from '@tanstack/react-query';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<VocaStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function VocaContentScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProp<VocaStackParamList, 'VOCACONTENT'>>();
  const { vocaId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  console.log('VocaContentScreen vocaId:', vocaId);
  
  const navigateToVocaUpdateWord = (wordId: number) => {
    navigation.navigate(VocaNavigations.WORDEDIT, { vocaId, wordId });
  };

  const navigateToVocaAddWord = () => {
    navigation.navigate(VocaNavigations.WORDEDIT, { vocaId });
  };

  const navigateToAIGenerate = () => {
    navigation.navigate(VocaNavigations.VOCAAIGENERATE);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 단어 데이터를 다시 가져오기
      await queryClient.invalidateQueries({ queryKey: ['words', vocaId] });
      console.log('단어 데이터 새로고침 완료');
    } catch (error) {
      console.error('새로고침 중 오류 발생:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
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
        <VocaContentList 
          vocaIndex={vocaId} 
          navigateToWordDetail={navigateToVocaUpdateWord}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
      
      {/* 기존 FAB */}
      <FAB onPress={navigateToVocaAddWord} />
    </SafeAreaView>
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
  aiFab: {
    position: 'absolute',
    bottom: 100, // 기존 FAB 위에 위치
    right: spacing.M16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  aiFab__text: {
    color: colors.WHITE,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
});

export default VocaContentScreen;
