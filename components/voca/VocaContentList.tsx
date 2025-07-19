import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useInfiniteWords, Word } from '../../server/query/hooks/useWord';
import { useSearchStore } from '../../store/useSearchStore';

interface WordResponse {
  content: Word[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface VocaContentListProps {
  vocaIndex: number;
  navigateToWordDetail: (wordId: number) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const WordItem = ({ item, onPress }: { item: Word; onPress: (id: number) => void }) => {
  return (
    <TouchableOpacity
      style={styles.list__item}
      onPress={() => onPress(item.wordId)}>
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

  // 데이터가 변경될 때마다 로그 출력
  React.useEffect(() => {
    if ((data as any)?.pages) {
      const totalWords = (data as any).pages.flatMap((page: any) => page.content).length;
      console.log('📝 단어 목록 업데이트:', totalWords, '개');
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.GREEN} />
        <Text style={styles.loadingText}>단어를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {(error as any).message}</Text>
        <Text style={styles.errorSubText}>아래로 당겨서 다시 시도해보세요</Text>
      </View>
    );
  }

  const words = (data as any)?.pages?.flatMap((page: any) => page.content) || [];
  console.log('VocaContentList - words array:', words);
  console.log('VocaContentList - words array length:', words.length);
  
  // 빈 배열인지 확인
  if (words.length === 0) {
    console.log('VocaContentList - words array is empty!');
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>단어장에 단어가 없습니다.</Text>
        <Text style={styles.emptySubText}>새 단어를 추가해보세요!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={styles.flatListContent}
      data={words}
      renderItem={({ item }) => <WordItem item={item} onPress={navigateToWordDetail} />}
      keyExtractor={(item, index) => `${item.wordId}-${index}`}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.M24,
  },
  loadingText: {
    marginTop: spacing.M16,
    color: colors.GRAY,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.M24,
  },
  errorText: {
    color: colors.RED,
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
  errorSubText: {
    marginTop: spacing.M16,
    color: colors.GRAY,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.M24,
  },
  emptySubText: {
    marginTop: spacing.M16,
    color: colors.GRAY,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
});

export default VocaContentList;
