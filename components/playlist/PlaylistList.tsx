import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useSearchStore } from '../../store/useSearchStore';
import { Playlist } from '../../types/playlist';
import { useUserPlaylist } from '../../server/query/hooks/usePlayList';
import { useQueryClient } from '@tanstack/react-query';

interface PlaylistListProps {
  navigateToMusic: (playlistId: number, playlistTitle: string) => void;
  onLongPress: (playlistId: number, playlistTitle: string) => void;
}

const PlaylistItem = ({ 
  item, 
  onPress, 
  onLongPress 
}: { 
  item: Playlist; 
  onPress: (playlistId: number, playlistTitle: string) => void;
  onLongPress: (playlistId: number, playlistTitle: string) => void;
}) => (
  <TouchableOpacity
    style={styles.list__item}
    onPress={() => onPress(item.id, item.playlistTitle)}
    onLongPress={() => onLongPress(item.id, item.playlistTitle)}>
    <View style={styles.list__content}>
      <Text style={styles.list__title}>{item.playlistTitle}</Text>
      <Text style={styles.list__count}>0곡</Text>
    </View>
  </TouchableOpacity>
);

const PlaylistList: React.FC<PlaylistListProps> = ({ 
  navigateToMusic,
  onLongPress
}) => {
  const searchText = useSearchStore(state => state.searchText);
  const queryClient = useQueryClient();
  
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  } = useUserPlaylist({ userId: '1', searchText });

  // 새로고침 핸들러
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ['playlists', '1'] });
    queryClient.invalidateQueries({ queryKey: ['playlist'] });
    await refetch();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.content) || []}
      renderItem={({ item }) => (
        <PlaylistItem 
          item={item} 
          onPress={navigateToMusic}
          onLongPress={onLongPress}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={colors.GREEN} /> : null}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          colors={[colors.GREEN]}
          tintColor={colors.GREEN}
          title="당겨서 새로고침"
          titleColor={colors.LIGHT_BLACK}
        />
      }
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
  list__count: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
});

export default PlaylistList; 