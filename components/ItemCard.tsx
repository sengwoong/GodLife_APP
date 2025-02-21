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
    const renderCategoryLabel = (type: string) => (
      <View style={styles.categoryLabel}>
        <Text style={styles.categoryText}>
          {type === 'post' ? '포스트' : type === 'voca' ? '단어장' : '재생목록'}
        </Text>
      </View>
    );

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    switch (type) {
      case 'all':
        if ('vocaTitle' in item) {
          const voca = item as Voca;
          return (
            <>
              <Image
                source={{ uri: 'https://via.placeholder.com/109x109' }}
                style={styles.itemImage}
              />
              {renderCategoryLabel('voca')}
              <View style={styles.itemDescriptionWrapper}>
                <Text numberOfLines={1} style={styles.itemName}>{voca.vocaTitle}</Text>
                <Text numberOfLines={1} style={styles.itemDescription}>{voca.languages}</Text>
                <Text style={styles.dateText}>{formatDate(voca.createdAt)}</Text>
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
              {renderCategoryLabel('playlist')}
              <View style={styles.itemDescriptionWrapper}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {playlist.playlistTitle}
                </Text>
                <Text style={styles.dateText}>{formatDate(playlist.createdAt)}</Text>
              </View>
            </>
          );
        } else if ('title' in item) {
          return (
            <>
              <Image
                source={{ uri: 'https://via.placeholder.com/109x109' }}
                style={styles.itemImage}
              />
              {renderCategoryLabel('post')}
              <View style={styles.itemDescriptionWrapper}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.title}
                </Text>
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
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
            {renderCategoryLabel('post')}
            <View style={styles.itemDescriptionWrapper}>
              <Text numberOfLines={1} style={styles.itemName}>
                {post.title || '제목 없음'}
              </Text>
              <Text numberOfLines={2} style={styles.itemDescription}>
                {post.postContent || '내용 없음'}
              </Text>
              <Text style={styles.dateText}>{formatDate(post.createdAt)}</Text>
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
            {renderCategoryLabel('voca')}
            <View style={styles.itemDescriptionWrapper}>
              <Text numberOfLines={1} style={styles.itemName}>{voca.vocaTitle}</Text>
              <Text numberOfLines={1} style={styles.itemDescription}>{voca.languages}</Text>
              <Text style={styles.dateText}>{formatDate(voca.createdAt)}</Text>
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
            {renderCategoryLabel('playlist')}
            <View style={styles.itemDescriptionWrapper}>
              <Text numberOfLines={1} style={styles.itemName}>
                {playlist.playlistTitle}
              </Text>
              <Text style={styles.dateText}>{formatDate(playlist.createdAt)}</Text>
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
    width: 164,
    height: 262,
    backgroundColor: colors.WHITE,
    borderRadius: 0,
    shadowColor: colors.BLACK,
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.LIGHT_GRAY,
  },
  itemDescriptionWrapper: {
    padding: spacing.M12,
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    ...getFontStyle('title', 'medium', 'bold'),
    fontSize: 16,
    color: colors.BLACK,
    marginBottom: spacing.M4,
  } as TextStyle,
  itemDescription: {
    ...getFontStyle('body', 'small', 'regular'),
    fontSize: 14,
    color: colors.GRAY,
    lineHeight: 20,
  } as TextStyle,
  iconImage: {
    width: 28,
    height: 28,
    marginBottom: spacing.M8,
  },
  categoryLabel: {
    position: 'absolute',
    top: spacing.M8,
    left: spacing.M8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.M8,
    paddingVertical: spacing.M4,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: colors.GRAY,
    marginTop: spacing.M4,
  }
});