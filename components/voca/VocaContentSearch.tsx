import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import SearchBar from '../searchbar/SearchBar';
import { useInfiniteWords } from '../../server/query/hooks/useWord';
import { useSearchStore } from '../../store/useSearchStore';
import useAuthStore from '../../store/useAuthStore';

function VocaContentSearch() {
  const searchText = useSearchStore(state => state.searchText);
  const route = useRoute();
  const { vocaIndex } = route.params as { vocaIndex: number };
  const userId = useAuthStore(state => state.user);

  const {
    data,
  } = useInfiniteWords(vocaIndex, userId as number, searchText);

  const wordSuggestions = data?.pages.flatMap(page => page.content.map(item => item.word)) || [];

  return (
    <View style={styles.search}>
      <SearchBar initialSuggestions={wordSuggestions} />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    alignItems: 'center',
  },
});

export default VocaContentSearch;
  