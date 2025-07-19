import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useInfiniteVoca } from '../../server/query/hooks/useVoca';
import { useSearchStore } from '../../store/useSearchStore';
import { Voca } from '../../types/voca';



interface VocaListProps {
  userId: number;
  navigateToVocaContent: (vocaIndex: number) => void;
  onLongPress: (id: number, vocaTitle: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}


const VocaList: React.FC<VocaListProps> = ({ userId, navigateToVocaContent, onLongPress, onRefresh, refreshing = false }) => {
  
  const searchText = useSearchStore(state => state.searchText);
  console.log('VocaList - userId:', userId, 'searchText:', searchText);
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVoca(userId!, searchText);
  
  console.log('VocaList - isLoading:', isLoading, 'error:', error, 'data:', data);

  if (isLoading) {
    console.log('VocaList - 로딩 중...');
    return (
      <FlatList
        style={styles.flatList}
        contentContainerStyle={[styles.flatListContent, styles.errorContainer]}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.errorView}>
            <ActivityIndicator size="large" color={colors.GREEN} />
            <Text style={styles.errorSubText}>단어장을 불러오는 중...</Text>
          </View>
        }
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.GREEN]}
              tintColor={colors.GREEN}
            />
          ) : undefined
        }
      />
    );
  }

  if (error) {
    console.log('VocaList - 에러 발생:', error.message);
    return (
      <FlatList
        style={styles.flatList}
        contentContainerStyle={[styles.flatListContent, styles.errorContainer]}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.errorView}>
            <Text style={styles.errorText}>Error: {error.message}</Text>
            <Text style={styles.errorSubText}>아래로 당겨서 다시 시도해보세요</Text>
          </View>
        }
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.GREEN]}
              tintColor={colors.GREEN}
            />
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={data?.pages.flatMap(page => page.content) || []}
        renderItem={({ item }) => <VocaItem item={item} onPress={navigateToVocaContent} onLongPress={onLongPress} />}
        keyExtractor={(item, index) => `${item.vocaId}-${index}`}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={colors.GREEN} /> : null}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.GREEN]}
              tintColor={colors.GREEN}
            />
          ) : undefined
        }
      />
    </>
  );
};

const VocaItem = ({ item, onPress, onLongPress }: { item: Voca; onPress: (id: number) => void; onLongPress: (id: number, vocaTitle: string) => void }) => (
  <TouchableOpacity
    style={styles.list__item}
    onPress={() => {
      console.log('VocaList - VOCACONTENT로 이동 vocaId:', item.vocaId);
      onPress(item.vocaId);
    }}
    onLongPress={() => onLongPress(item.vocaId, item.vocaTitle)}>
    <View style={styles.list__content}>
      <Text style={styles.list__title}>{item.vocaTitle}</Text>
      <Text style={styles.list__count}>{item.languages}</Text>
    </View>
  </TouchableOpacity>
);


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
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  search: {
    paddingHorizontal: spacing.M20,
    width: '100%',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorView: {
    alignItems: 'center',
    padding: spacing.M20,
  },
  errorText: {
    color: colors.RED,
    ...getFontStyle('body', 'medium', 'bold'),
    textAlign: 'center',
    marginBottom: spacing.M8,
  } as TextStyle,
  errorSubText: {
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
    textAlign: 'center',
  } as TextStyle,
});

export default VocaList; 