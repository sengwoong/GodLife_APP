import { useState } from 'react';

export const useSearch = (initialSuggestions: string[]) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(initialSuggestions);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (text: string): void => {
    setSearchText(text);
    const filtered = initialSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSuggestionSelect = (suggestion: string): void => {
    setSearchText('');
    setRecentSearches(prev => {
      const newSearches = prev.filter(item => item !== suggestion);
      return [suggestion, ...newSearches].slice(0, 10);
    });
    setFilteredSuggestions(initialSuggestions);
  };

  return {
    searchText,
    setSearchText,
    recentSearches,
    filteredSuggestions,
    isSearchFocused,
    setIsSearchFocused,
    handleSearchChange,
    handleSuggestionSelect,
  };
}; 