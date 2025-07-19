import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useInfiniteWords } from '../../server/query/hooks/useWord';
import { useSearchStore } from '../../store/useSearchStore';
import { useRoute } from '@react-navigation/native';

interface Word {
  id: number;
  word: string;
  meaning: string;
  vocaId: number;
}

interface VocaContentListProps {
  vocaIndex: number;
  navigateToWordDetail: (wordId: number) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const WordItem = ({ item, onPress }: { item: Word; onPress: (id: number) => void }) => {
  console.log('WordItem - rendering item:', item);
  return (
    <TouchableOpacity
      style={styles.list__item}
      onPress={() => onPress(item.id)}>
      <View style={styles.list__content}>
        <Text style={styles.list__title}>{item.word}</Text>
        <Text style={styles.list__meaning}>{item.meaning}</Text>
      </View>
    </TouchableOpacity>
  );
};

const VocaContentList: React.FC<VocaContentListProps> = ({ vocaIndex, navigateToWordDetail, onRefresh, refreshing = false }) => {
  const searchText = useSearchStore(state => state.searchText);
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteWords(vocaIndex, searchText);

  console.log('VocaContentList - vocaIndex:', vocaIndex, 'searchText:', searchText);
  console.log('VocaContentList - isLoading:', isLoading, 'error:', error);
  console.log('VocaContentList - data:', data);
  console.log('VocaContentList - pages length:', data?.pages?.length);
  
  if (data?.pages) {
    data.pages.forEach((page, index) => {
      console.log(`VocaContentList - page ${index}:`, page);
      console.log(`VocaContentList - page ${index} content:`, page.content);
      console.log(`VocaContentList - page ${index} content length:`, page.content?.length);
    });
  }
  
  console.log('VocaContentList - flatMap result:', data?.pages.flatMap(page => page.content) || []);

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const words = data?.pages.flatMap(page => page.content) || [];
  console.log('VocaContentList - words array:', words);
  console.log('VocaContentList - words array length:', words.length);
  
  // 빈 배열인지 확인
  if (words.length === 0) {
    console.log('VocaContentList - words array is empty!');
    return <Text style={styles.emptyText}>단어장에 단어가 없습니다.</Text>;
  }

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={styles.flatListContent}
      data={words}
      renderItem={({ item }) => <WordItem item={item} onPress={navigateToWordDetail} />}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={colors.GREEN} /> : null}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.GREEN]}
          tintColor={colors.GREEN}
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
  list__meaning: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: spacing.M24,
    color: colors.GRAY,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
});

export default VocaContentList;
