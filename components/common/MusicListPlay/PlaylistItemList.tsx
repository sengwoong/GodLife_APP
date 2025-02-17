import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Music } from '../../../types/music';

interface PlaylistItemListProps {
  musicList?: Music[];
  onItemPress?: (id: string) => void;
}

const PlaylistItemList: React.FC<PlaylistItemListProps> = ({ musicList, onItemPress }) => {
  const renderItem = ({ item }: { item: Music }) => (
    <TouchableOpacity onPress={() => onItemPress && onItemPress(item.id)}>
      <View>
        <Text>{item.musicTitle}</Text>
        <Text>{item.musicUrl}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={musicList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default React.memo(PlaylistItemList); 