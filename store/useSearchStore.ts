import { create } from 'zustand';

/** 
 * 검색 상태를 관리하는 인터페이스
 */
interface SearchState {
  suggestions: string[]; // 제안 목록
  filteredSuggestions: string[]; // 필터링된 제안 목록
  isSearchFocused: boolean; // 검색창 포커스 여부
  searchText: string; // 검색 텍스트
  setSuggestions: (suggestions: string[]) => void; // 제안 목록 설정 함수
  setIsSearchFocused: (focused: boolean) => void; // 검색창 포커스 설정 함수
  handleSearchChange: (text: string) => void; // 검색 텍스트 변경 핸들러
}

/** 
 * 검색 상태를 관리하는 zustand 스토어 생성
 */
export const useSearchStore = create<SearchState>((set, get) => ({
  suggestions: [], // 초기 제안 목록
  recentSearches: [], // 최근 검색 목록
  filteredSuggestions: [], // 초기 필터링된 제안 목록
  isSearchFocused: false, // 초기 검색창 포커스 상태
  searchText: '', // 초기 검색 텍스트

  /** 
   * 검색창의 포커스 상태를 설정하는 함수
   * @param focused - 포커스 여부
   */
  setIsSearchFocused: (focused) => set({ isSearchFocused: focused }),

  /** 
   * 제안 목록을 설정하는 함수
   * @param suggestions - 새로운 제안 목록
   */
  setSuggestions: (suggestions) => set({ suggestions }),

  /** 
   * 검색 텍스트가 변경될 때 호출되는 함수
   * @param text - 새로운 검색 텍스트
   */
  handleSearchChange: (text) => {
    const initialSuggestions = get().suggestions; // 현재 제안 목록 가져오기

    // 검색 텍스트를 포함하는 제안 목록 필터링
    const filtered = initialSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(text.toLowerCase())
    );
    
    // 검색 텍스트와 필터링된 제안 목록을 상태에 설정
    set({ searchText: text, filteredSuggestions: filtered });
  }
})); 