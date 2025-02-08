import React from 'react';
import { View, TextInput, StyleSheet, Keyboard, TextStyle } from 'react-native';
import SearchResults from './SearchResults';
import { colors, getFontStyle, spacing } from '../../constants';
import { SEARCH_LAYOUT } from '../../constants/layout';
import { SEARCH_STRINGS } from '../../constants/i18n';
import { useSearch } from '../../hooks/useSearch';

interface SearchBarProps {
  initialSuggestions: string[];
  locale?: keyof typeof SEARCH_STRINGS;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialSuggestions,
  locale = 'ko'
}) => {
  const {
    searchText,
    recentSearches,
    filteredSuggestions,
    isSearchFocused,
    setIsSearchFocused,
    handleSearchChange,
    handleSuggestionSelect,
  } = useSearch(initialSuggestions);

  const handleBlur = () => {
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const shouldShowResults = searchText.trim() && isSearchFocused;

  return (
    <View style={styles.search}>
      <TextInput
        style={styles.search__input}
        placeholder={SEARCH_STRINGS[locale].PLACEHOLDER}
        value={searchText}
        onChangeText={handleSearchChange}
        onBlur={handleBlur}
        onFocus={() => setIsSearchFocused(true)}
      />
      {shouldShowResults && (
        <SearchResults
          searchText={searchText}
          filteredSuggestions={filteredSuggestions}
          recentSearches={recentSearches}
          onSuggestionSelect={handleSuggestionSelect}
          locale={locale}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    zIndex: 1,
    width: SEARCH_LAYOUT.SEARCH_WIDTH,
    alignContent: 'center',
  },
  search__input: {
    ...getFontStyle('titleBody', 'small', 'medium'),
    backgroundColor: colors.WHITE,
    borderRadius: SEARCH_LAYOUT.INPUT_BORDER_RADIUS,
    paddingHorizontal: spacing.M16,
    height: SEARCH_LAYOUT.INPUT_HEIGHT,
    marginBottom: spacing.M12,
    elevation: 3,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  } as TextStyle,
});

export default SearchBar;
