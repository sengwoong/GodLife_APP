import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';


interface SearchResultsProps {
  searchText: string;
  filteredSuggestions: string[];
  recentSearches: string[];
  onSuggestionSelect: (suggestion: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchText,
  filteredSuggestions,
  recentSearches,
  onSuggestionSelect,
}) => {
  const renderSuggestionItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => onSuggestionSelect(item)}>
      <Text
        style={[
          styles.suggestion__item,
          item.toLowerCase().startsWith(searchText.toLowerCase()) && styles.suggestion__itemHighlighted
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => onSuggestionSelect(item)}>
      <Text style={styles.recent__item}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.results}>
      <View style={[styles.results__column, styles.results__columnWide]}>
        <Text style={styles.results__title}>추천 검색어</Text>
        <FlatList
          data={filteredSuggestions}
          keyExtractor={(_, index) => `suggestion-${index}`}
          renderItem={renderSuggestionItem}
        />
      </View>

      <View style={[styles.results__column, styles.results__columnNarrow, styles.results__marginHorizontal]}>
        <Text style={styles.results__title}>최근 검색어</Text>
        <FlatList
          data={recentSearches}
          keyExtractor={(_, index) => `recent-${index}`}
          renderItem={renderRecentItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  results: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: spacing.M4,
    justifyContent: 'space-between',
  },
  results__column: {
    backgroundColor: colors.WHITE,
    padding: spacing.M4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
  results__marginHorizontal:{
    marginHorizontal: spacing.M4,
  },
  results__columnWide: {
    width: '70%',
  },
  results__columnNarrow: {
    width: '25%',
  },
  results__title: {
    ...getFontStyle('titleBody', 'large', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  suggestion__item: {
    ...getFontStyle('titleBody', 'mediumSmall', 'bold'),
    paddingVertical: spacing.M4,
    color: colors.GRAY,
  } as TextStyle,
  suggestion__itemHighlighted: {
    color: colors.BLACK,
    fontWeight: 'bold',
  } as TextStyle,
  recent__item: {
    ...getFontStyle('titleBody', 'mediumSmall', 'bold'),
    paddingVertical: spacing.M4,
    color: colors.BLACK,
  } as TextStyle,
});

export default SearchResults;
