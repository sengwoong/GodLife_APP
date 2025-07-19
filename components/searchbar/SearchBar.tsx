import React, { useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TextStyle } from 'react-native';
import SearchResults from '../searchbar/SearchResults';
import { colors, getFontStyle, spacing } from '../../constants';

import { useSearchStore } from '../../store/useSearchStore';

interface SearchBarProps {
  initialSuggestions: string[] | undefined;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialSuggestions,
}) => {
  const {
    searchText,
    filteredSuggestions,
    isSearchFocused,
    setIsSearchFocused,
    handleSearchChange,
    setSuggestions,
  } = useSearchStore();


  useEffect(() => {
    if (initialSuggestions) {
      setSuggestions(initialSuggestions);
    }
  }, [initialSuggestions]);

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
        placeholderTextColor={colors.BLACK}
        value={searchText}
        onChangeText={handleSearchChange}
        onBlur={handleBlur}
        onFocus={() => setIsSearchFocused(true)}
      />
      {shouldShowResults && (
        <SearchResults
          searchText={searchText}
          filteredSuggestions={filteredSuggestions}
        />
      )}
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  search: {
    zIndex: 1,
    width: '100%',
    alignContent: 'center',
  },
  search__input: {
    ...getFontStyle('titleBody', 'small', 'medium'),
    backgroundColor: colors.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 10,
    padding: spacing.M12,
    color: colors.BLACK,
  } as TextStyle,
});

export default SearchBar;
