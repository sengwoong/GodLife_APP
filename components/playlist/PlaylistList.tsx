import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useSearchStore } from '../../store/useSearchStore';
import { Playlist } from '../../types/playlist';
import { useUserPlaylists } from '../../server/query/hooks/usePlayList';
import useUserId from '../../server/query/hooks/useUserId';



interface PlaylistListProps {
  navigateToPlayListContent: (playlistId: number) => void;
  onLongPress: (playlistId: number, playlistTitle: string) => void;
}

const PlaylistItem = ({ 
  item, 
  onPress,
  onLongPress 
}: { 
  item: Playlist; 
  onPress: (id: number) => void;
  onLongPress: (id: number, title: string) => void;
}) => (
  <TouchableOpacity
    style={styles.list__item}
    onPress={() => onPress(item.playlistId)}
    onLongPress={() => onLongPress(item.playlistId, item.playlistTitle)}
  >
    <View style={styles.list__content}>
      <Text style={styles.list__title}>{item.playlistTitle}</Text>
    </View>
  </TouchableOpacity>
);

const PlaylistList: React.FC<PlaylistListProps> = ({ 
  navigateToPlayListContent,
  onLongPress
}) => {

  const searchText = useSearchStore(state => state.searchText);
  const userId = useUserId();
  const { data, isLoading, error } = useUserPlaylists(userId || 1, searchText || '', 0, 10);

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data?.content || []}
      renderItem={({ item }) => (
        <PlaylistItem 
          item={item} 
          onPress={navigateToPlayListContent}
          onLongPress={onLongPress}
        />
      )}
      keyExtractor={(item) => item.playlistId.toString()}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  list__item: {
    paddingVertical: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  list__content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
});

export default PlaylistList; 