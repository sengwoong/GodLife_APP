import React, { useCallback } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../../constants';
import { Music } from '../../../types/music';

interface PlaylistItemListProps {
  musicList: Music[] | undefined;
  onItemPress?: (id: string) => void;
  onLoadMore?: () => void;
}

const PlaylistItemList: React.FC<PlaylistItemListProps> = ({ musicList, onItemPress, onLoadMore }) => {
  console.log('musicList', musicList?.map(item => item.color))

  const handleEndReached = useCallback(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  return (
    <FlatList
      data={musicList}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.list__item}
          onPress={() => onItemPress?.(item.id)}
        >
          <View 
            style={[
              styles.list__thumbnail, 
              { backgroundColor: item.color ? `${item.color}` : colors.BLACK }
            ]} 
          />
          <View style={styles.list__content}>
            <Text style={styles.list__title}>{item.musicTitle}</Text>
            <Text style={styles.list__artist}>{item.musicUrl}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.M12,
  },
  list__item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.M8,
    gap: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  list__thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  list__content: {
    flex: 1,
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  list__artist: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
});

export default PlaylistItemList; 