import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useUserVocas } from '../../server/query/hooks/useVoca';
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
  
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUserVocas(userId, searchText, 0, 10);

  // 데이터가 변경될 때마다 로그 출력
  React.useEffect(() => {
    if (data) {
      console.log('📚 단어장 목록 업데이트:', data.content?.length, '개');
    }
  }, [data]);

  // refetch 함수를 개선
  const handleRefresh = React.useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('❌ 단어장 목록 refetch 실패:', error);
    }
  }, [refetch]);

  // onRefresh가 제공되면 그것을 사용, 아니면 내부 refetch 사용
  const refreshHandler = onRefresh || handleRefresh;

  if (isLoading) {
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
          refreshHandler ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshHandler}
              colors={[colors.GREEN]}
              tintColor={colors.GREEN}
            />
          ) : undefined
        }
      />
    );
  }

  if (error) {
    return (
      <FlatList
        style={styles.flatList}
        contentContainerStyle={[styles.flatListContent, styles.errorContainer]}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.errorView}>
            <Text style={styles.errorText}>Error: {(error as any).message}</Text>
            <Text style={styles.errorSubText}>아래로 당겨서 다시 시도해보세요</Text>
          </View>
        }
        refreshControl={
          refreshHandler ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshHandler}
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
        data={data?.content || []}
        renderItem={({ item }) => <VocaItem item={item} onPress={navigateToVocaContent} onLongPress={onLongPress} />}
        keyExtractor={(item, index) => `${item.vocaId}-${index}`}
        ListEmptyComponent={
          <View style={styles.errorView}>
            <Text style={styles.errorSubText}>단어장이 없습니다. 새 단어장을 만들어보세요!</Text>
          </View>
        }
        refreshControl={
          refreshHandler ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshHandler}
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
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
    textAlign: 'center',
  } as TextStyle,
});

export default VocaList; 