import { create } from 'zustand';

interface SearchState {
  suggestions: string[];
  filteredSuggestions: string[];
  isSearchFocused: boolean;
  searchText: string;
  setSuggestions: (suggestions: string[]) => void;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearchChange: (text: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  suggestions: [],
  recentSearches: [],
  filteredSuggestions: [],
  isSearchFocused: false,
  searchText: '',
  setIsSearchFocused: (focused) => set({ isSearchFocused: focused }),
  setSuggestions: (suggestions) => set({ suggestions }),
  handleSearchChange: (text) => {
    const initialSuggestions = get().suggestions; 

    const filtered = initialSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(text.toLowerCase())
    );
    
    set({ searchText: text, filteredSuggestions: filtered });
  }
})); 