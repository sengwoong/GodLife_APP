import { View, Image, StyleSheet, Text, Pressable, TextStyle } from 'react-native';
import React from 'react';
import { colors, getFontStyle, spacing } from '../constants';
import { BasePost } from '../types/post';
import { Voca } from '../types/voca';
import { Playlist } from '../types/playlist';
import { Music } from '../types/music';

interface SquareItemCardProps {
  item: BasePost;
  type?: 'post' | 'voca' | 'playlist' | 'music';
  onPress?: () => void;
}

export default function SquareItemCard({ item, type, onPress }: SquareItemCardProps) {
  const getImageUrl = () => {
    if ('postImage' in item) {
      return item.postImage;
    } 
    return 'https://via.placeholder.com/60';
  };

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.leftInfo}>
        <Image 
          source={{ uri: getImageUrl() }} 
          style={styles.thumbnail} 
        />
      </View>
      <View style={styles.rightInfo}>
        <Text style={styles.brand}>{item.type}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {'title' in item ? item.title : '상품명'}
        </Text>
        <Text style={styles.price}>
          {'price' in item ? `${item.price}원` : '가격정보 없음'}
        </Text>
        {'sale' in item && item.sale && (
          <View style={styles.saleTag}>
            <Text style={styles.saleText}>품절</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    marginBottom: spacing.M8,
  },
  leftInfo: {
    marginRight: spacing.M16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: colors.LIGHT_GRAY,
  },
  rightInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
    marginBottom: 2,
  } as TextStyle,
  title: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
    marginBottom: 4,
  } as TextStyle,
  price: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  saleTag: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.GRAY,
    paddingHorizontal: spacing.M8,
    paddingVertical: spacing.M4,
    borderRadius: 4,
  },
  saleText: {
    ...getFontStyle('body', 'small', 'bold'),
    color: colors.WHITE,
  }as TextStyle,
}); 