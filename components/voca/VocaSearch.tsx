import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants';
import SearchBar from '../searchbar/SearchBar';
import { useInfiniteVoca } from '../../server/query/hooks/useVoca';
import { useSearchStore } from '../../store/useSearchStore';
import useAuthStore from '../../store/useAuthStore';

function VocaSearch() {
  const searchText = useSearchStore(state => state.searchText);
  const userId = useAuthStore(state => state.user?.id);

  const {
    data,
  } = useInfiniteVoca(userId!, searchText);

  return (
    <>
      <View style={styles.search}>
        <SearchBar initialSuggestions={data?.pages.flatMap(page => page.content.map(item => item.vocaTitle))} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    alignItems: 'center',
  },
});

export default VocaSearch;
