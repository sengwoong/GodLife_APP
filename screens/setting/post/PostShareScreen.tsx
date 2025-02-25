import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';
import { useSharedPosts } from '../../../server/query/hooks/usePost';
import { formatDate } from '../../../utils/dateUtils';

interface SharedPost {
  id: number;
  title: string;
  recipient: string;
  date: string;
  thumbnail: string | null;
}

function PostShareScreen() {
  const userId = 1; 
  const { data: sharedPostsData, isLoading } = useSharedPosts(userId);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>공유한 포스트</Text>
        <Text style={styles.header__subtitle}>친구에게 공유한 포스트 목록입니다</Text>
      </View>
      <Margin size={'M16'} />
  
      
      <FlatList
        data={sharedPostsData?.content || []}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.list__item}>
            <View style={styles.list__content}>
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              ) : (
                <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
              )}
              <View style={styles.list__mainInfo}>
                <Text style={styles.list__title}>{item.title}</Text>
                <Text style={styles.list__recipient}>공유 대상: {item.recipient}</Text>
                <Text style={styles.list__date}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    paddingHorizontal: spacing.M20,
    backgroundColor: colors.WHITE,
  },
  header__title: {
    color: colors.BLACK,
    ...getFontStyle('title', 'large', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  header__subtitle: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  search: {
    paddingHorizontal: spacing.M20,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.M16,
  },
  list: {
    paddingHorizontal: spacing.M20,
  },
  list__item: {
    paddingVertical: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  list__content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.M12,
  },
  thumbnailPlaceholder: {
    backgroundColor: colors.GRAY,
  },
  list__mainInfo: {
    flex: 1,
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  list__recipient: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
    marginBottom: spacing.M4,
  } as TextStyle,
  list__date: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
});

export default PostShareScreen;
