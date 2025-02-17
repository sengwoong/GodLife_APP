import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../searchbar/SearchBar';
import { useInfinitePlayList } from '../../server/query/hooks/usePlayList';
import { useSearchStore } from '../../store/useSearchStore';
import { Playlist } from '../../types/playlist';



const PlaylistSearch: React.FC = () => {
  const searchText = useSearchStore(state => state.searchText);
  const { data } = useInfinitePlayList(searchText);
  const playlistSuggestions = data?.pages.flatMap(page => page.content.map(item => item.playlistTitle)) || [];


  return (
    <View style={styles.search}>
      <SearchBar
        initialSuggestions={playlistSuggestions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    width: '100%',
    alignItems: 'center',
  },
});

export default PlaylistSearch; 