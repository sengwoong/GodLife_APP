import React, { useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TextStyle } from 'react-native';
import SearchResults from '../searchbar/SearchResults';
import { colors, getFontStyle, spacing } from '../../constants';

import { useSearchStore } from '../../store/useSearchStore';

// SearchBar 컴포넌트의 props 인터페이스
interface SearchBarProps {
  initialSuggestions: string[] | undefined;
}

// SearchBar 컴포넌트는 검색 입력과 결과를 표시합니다.
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

  console.log('initialSuggestions', initialSuggestions);

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
  } as TextStyle,
});

export default SearchBar;
