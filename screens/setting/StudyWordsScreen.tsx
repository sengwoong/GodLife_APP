import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../../constants';
import SearchBar from '../../components/searchbar/SearchBar';
import Margin from '../../components/division/Margin';

function StudyWordsScreen() {
  const [studyList] = useState([
    { id: 1, title: '초등단어', progress: '32/100' },
    { id: 2, title: '중등단어', progress: '45/80' },
    { id: 3, title: '고등단어', progress: '15/90' },
    { id: 4, title: 'TOEIC 단어', progress: '60/120' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>학습 단어장</Text>
        <Text style={styles.header__subtitle}>현재 학습중인 단어장 목록입니다</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['초등', '중등', '고등', 'TOEIC', '토익']} 
        />
      </View>
      
      <FlatList
        data={studyList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.list__item}>
            <View style={styles.list__content}>
              <Text style={styles.list__title}>{item.title}</Text>
              <Text style={styles.list__progress}>{item.progress}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBar__filled, 
                  { width: `${(parseInt(item.progress.split('/')[0]) / parseInt(item.progress.split('/')[1])) * 100}%` }
                ]} 
              />
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
    marginBottom: spacing.M8,
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
  list__progress: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  progressBar: {
    height: 4,
    backgroundColor: colors.GRAY,
    borderRadius: 2,
  },
  progressBar__filled: {
    height: '100%',
    backgroundColor: colors.YELLOW,
    borderRadius: 2,
  },
});

export default StudyWordsScreen; 