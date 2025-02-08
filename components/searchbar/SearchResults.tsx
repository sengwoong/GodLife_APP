import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { SEARCH_LAYOUT } from '../../constants/layout';
import { SEARCH_STRINGS } from '../../constants/i18n';

interface SearchResultsProps {
  searchText: string;
  filteredSuggestions: string[];
  recentSearches: string[];
  onSuggestionSelect: (suggestion: string) => void;
  locale?: keyof typeof SEARCH_STRINGS;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchText,
  filteredSuggestions,
  recentSearches,
  onSuggestionSelect,
  locale = 'ko'
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
        <Text style={styles.results__title}>{SEARCH_STRINGS[locale].SUGGESTED_WORDS}</Text>
        <FlatList
          data={filteredSuggestions}
          keyExtractor={(_, index) => `suggestion-${index}`}
          renderItem={renderSuggestionItem}
        />
      </View>

      <View style={[styles.results__column, styles.results__columnNarrow]}>
        <Text style={styles.results__title}>{SEARCH_STRINGS[locale].RECENT_SEARCHES}</Text>
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
    marginTop: spacing.M60,
    justifyContent: 'space-between',
  },
  results__column: {
    backgroundColor: colors.WHITE,
    padding: spacing.M12,
    borderRadius: SEARCH_LAYOUT.RESULTS_BORDER_RADIUS,
    elevation: 2,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  results__columnWide: {
    width: SEARCH_LAYOUT.COLUMN_WIDE,
  },
  results__columnNarrow: {
    width: SEARCH_LAYOUT.COLUMN_NARROW,
  },
  results__title: {
    ...getFontStyle('titleBody', 'large', 'bold'),
    marginBottom: spacing.M12,
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
