import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../searchbar/SearchBar';
import { useUserPlaylists } from '../../server/query/hooks/usePlayList';
import { useSearchStore } from '../../store/useSearchStore';
import { Playlist } from '../../types/playlist';
import useUserId from '../../server/query/hooks/useUserId';



const PlaylistSearch: React.FC = () => {
  const searchText = useSearchStore(state => state.searchText);
  const userId = useUserId();
  const { data } = useUserPlaylists(userId || 1, searchText || '', 0, 10);
  const playlistSuggestions = data?.content?.map(item => item.playlistTitle) || [];


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