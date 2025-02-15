import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';

interface WordList {
  id: number;
  title: string;
  wordCount: number;
  isShared: boolean;
  lastModified: string;
}

function MyWordsScreen() {
  const [myWordsList, setMyWordsList] = useState<WordList[]>([
    { id: 1, title: '자주 틀리는 단어', wordCount: 50, isShared: true, lastModified: '2024.03.15' },
    { id: 2, title: '오늘 배운 단어', wordCount: 30, isShared: false, lastModified: '2024.03.14' },
    { id: 3, title: '시험 준비 단어', wordCount: 100, isShared: true, lastModified: '2024.03.10' },
    { id: 4, title: '회화 필수 단어', wordCount: 75, isShared: false, lastModified: '2024.03.05' },
  ]);

  const toggleSharing = (id: number) => {
    setMyWordsList(prevList =>
      prevList.map(item =>
        item.id === id ? { ...item, isShared: !item.isShared } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>나의 단어장</Text>
        <Text style={styles.header__subtitle}>직접 만든 단어장을 관리하세요</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['자주', '시험', '회화', '오늘']} 
        />
      </View>
      
      <FlatList
        data={myWordsList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.list__item}>
            <View style={styles.list__content}>
              <View style={styles.list__mainInfo}>
                <View style={styles.list__titleRow}>
                  <Text style={styles.list__title}>{item.title}</Text>
                  <Text style={styles.list__count}>{item.wordCount}개의 단어</Text>
                </View>
                <Text style={styles.list__date}>마지막 수정: {item.lastModified}</Text>
              </View>
              <View style={styles.list__shareContainer}>
                <Text style={styles.list__shareText}>
                  {item.isShared ? '공유중' : '비공개'}
                </Text>
                <Switch
                  value={item.isShared}
                  onValueChange={() => toggleSharing(item.id)}
                  trackColor={{ false: colors.GRAY, true: colors.YELLOW }}
                  thumbColor={colors.WHITE}
                />
              </View>
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
  list__mainInfo: {
    flex: 1,
    marginRight: spacing.M12,
  },
  list__titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.M4,
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    marginRight: spacing.M8,
  } as TextStyle,
  list__count: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__date: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__shareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list__shareText: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
    marginRight: spacing.M8,
  } as TextStyle,
});

export default MyWordsScreen; 