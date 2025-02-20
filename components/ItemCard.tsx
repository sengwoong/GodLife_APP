import { View, Text, StyleSheet, TextStyle, Image } from 'react-native'
import React from 'react'
import { colors, getFontStyle, spacing } from '../constants'
import { BasePost } from '../types/post'
import { Voca } from '../types/voca'
import { Playlist } from '../types/playlist'

interface ItemCardProps {
  item: BasePost | Voca | Playlist;
  type: 'all' | 'post' | 'voca' | 'playlist';
}

export default function ItemCard({ item, type }: ItemCardProps) {
  // 고유한 키 생성을 위한 함수
  const getUniqueKey = (item: BasePost | Voca | Playlist, type: string) => {
    return `${type}-${item.id}-${Date.now()}`;
  };

  const renderContent = () => {
    switch (type) {
      case 'all':
        // 아이템 타입에 따라 다른 렌더링
        if ('vocaTitle' in item) {
          const voca = item as Voca;
          return (
            <>
              <Image
                source={{ uri: 'https://via.placeholder.com/109x109' }}
                style={styles.itemImage}
              />
              <View style={styles.itemDescriptionWrapper}>
                <Text numberOfLines={1} style={styles.itemName}>{voca.vocaTitle}</Text>
                <Text numberOfLines={1} style={styles.itemDescription}>{voca.languages}</Text>
              </View>
            </>
          );
        } else if ('playlistTitle' in item) {
          const playlist = item as Playlist;
          return (
            <>
              <Image
                source={{ uri: 'https://via.placeholder.com/109x109' }}
                style={styles.itemImage}
              />
              <View style={styles.itemDescriptionWrapper}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/24x24' }}
                  style={styles.iconImage} 
                />
                <Text numberOfLines={1} style={styles.itemName}>
                  {playlist.playlistTitle}
                </Text>
              </View>
            </>
          );
        } else if ('title' in item) {
          // Post 타입
          return (
            <>
              <Image
                source={{ uri: 'https://via.placeholder.com/109x109' }}
                style={styles.itemImage}
              />
              <View style={styles.itemDescriptionWrapper}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.title}
                </Text>
              </View>
            </>
          );
        }
        return null;

      case 'post':
        const post = item as BasePost;
        return (
          <>
            <Image
              source={{ uri: post.postImage || 'https://via.placeholder.com/109x109' }}
              style={styles.itemImage}
            />
            <View style={styles.itemDescriptionWrapper}>
              <Text numberOfLines={1} style={styles.itemName}>
                {post.title || '제목 없음'}
              </Text>
              <Text numberOfLines={2} style={styles.itemDescription}>
                {post.postContent || '내용 없음'}
              </Text>
            </View>
          </>
        );
      
      case 'voca':
        const voca = item as Voca;
        return (
          <>
            <Image
              source={{ uri: 'https://via.placeholder.com/109x109' }}
              style={styles.itemImage}
            />
            <View style={styles.itemDescriptionWrapper}>
              <Text numberOfLines={1} style={styles.itemName}>{voca.vocaTitle}</Text>
              <Text numberOfLines={1} style={styles.itemDescription}>{voca.languages}</Text>
            </View>
          </>
        );

      case 'playlist':
        const playlist = item as Playlist;
        return (
          <>
            <Image
              source={{ uri: 'https://via.placeholder.com/109x109' }}
              style={styles.itemImage}
            />
            <View style={styles.itemDescriptionWrapper}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/24x24' }}
                style={styles.iconImage} 
              />
              <Text numberOfLines={1} style={styles.itemName}>
                {playlist.playlistTitle}
              </Text>
            </View>
          </>
        );
    }
  };

  return (
    <View style={styles.itemCard}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    width: '48%',
    borderRadius: 10,
    height: 180,
    marginBottom: spacing.M16,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.LIGHT_GRAY,
  },
  itemDescriptionWrapper: {
    padding: spacing.M8,
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M4,
  } as TextStyle,
  itemDescription: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
    lineHeight: 18,
  } as TextStyle,
  iconImage: {
    width: 24,
    height: 24,
    marginBottom: spacing.M4,
  },
});