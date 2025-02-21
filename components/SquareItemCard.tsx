import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../constants';
import { BasePost } from '../types/post';
import { Voca } from '../types/voca';
import { Playlist } from '../types/playlist';
import { Music } from '../types/music';

interface SquareItemCardProps {
  item: BasePost | Voca | Playlist | Music;
  type?: 'post' | 'voca' | 'playlist' | 'music';
}

export default function SquareItemCard({ item, type }: SquareItemCardProps) {
  const getImageUrl = () => {
    if ('postImage' in item) {
      return item.postImage;
    } else if ('imageUrl' in item) {
      return item.imageUrl;
    }
    return 'https://via.placeholder.com/164';
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: getImageUrl() }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 164,
    height: 164,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.LIGHT_GRAY,
  }
}); 