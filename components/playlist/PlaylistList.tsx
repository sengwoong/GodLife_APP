import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useInfinitePlayList } from '../../server/query/hooks/usePlayList';
import { useSearchStore } from '../../store/useSearchStore';
import { Playlist } from '../../types/playlist';



interface PlaylistListProps {
  navigateToPlayListContent: (playlistId: number) => void;
}

const PlaylistItem = ({ item, onPress }: { item: Playlist; onPress: (id: number) => void }) => (
  <TouchableOpacity
    style={styles.list__item}
    onPress={() => onPress(item.id)}>
    <View style={styles.list__content}>
      <Text style={styles.list__title}>{item.playlistTitle}</Text>
    </View>
  </TouchableOpacity>
);

const PlaylistList: React.FC<PlaylistListProps> = ({  navigateToPlayListContent }) => {

  const searchText = useSearchStore(state => state.searchText);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePlayList(searchText);

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.content) || []}
      renderItem={({ item }) => <PlaylistItem item={item} onPress={navigateToPlayListContent} />}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={colors.GREEN} /> : null}
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