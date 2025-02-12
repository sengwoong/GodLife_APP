import React from 'react';
import { View, TextInput, StyleSheet, Keyboard, TextStyle } from 'react-native';
import SearchResults from '../searchbar/SearchResults';
import { colors, getFontStyle, spacing } from '../../constants';

import { useSearch } from '../../hooks/useSearch';

interface SearchBarProps {
  initialSuggestions: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialSuggestions,
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
        placeholder="검색어를 입력해주세요."
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
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    zIndex: 1,
    width: '100%',
    alignContent: 'center',
  },
  search__input: {
    ...getFontStyle('titleBody', 'small', 'medium'),
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    paddingHorizontal: spacing.M16,
    height: 40,
    marginBottom: spacing.M12,
    elevation: 3,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  } as TextStyle,
});

export default SearchBar;
