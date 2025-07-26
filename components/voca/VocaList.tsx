import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useInfiniteVoca } from '../../server/query/hooks/useVoca';
import { useSearchStore } from '../../store/useSearchStore';
import { Voca } from '../../types/voca';
import { useQueryClient } from '@tanstack/react-query';

interface VocaListProps {
  userId: number;
  navigateToVocaGame: (vocaIndex: number) => void;
  onLongPress: (id: number, vocaTitle: string) => void;
}

const VocaList: React.FC<VocaListProps> = ({ userId, navigateToVocaGame, onLongPress }) => {
  const searchText = useSearchStore(state => state.searchText);
  const queryClient = useQueryClient();
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteVoca(userId!, searchText);

  // 새로고침 핸들러
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ['vocas', userId] });
    queryClient.invalidateQueries({ queryKey: ['words'] });
    await refetch();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <>
      <FlatList
        data={data?.pages.flatMap(page => page.content) || []}
        renderItem={({ item }) => <VocaItem item={item} onPress={navigateToVocaGame} onLongPress={onLongPress} />}
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
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.GREEN]}
            tintColor={colors.GREEN}
            title="당겨서 새로고침"
            titleColor={colors.LIGHT_BLACK}
          />
        }
      />
    </>
  );
};

const VocaItem = ({ item, onPress, onLongPress }: { item: Voca; onPress: (id: number) => void; onLongPress: (id: number, vocaTitle: string) => void }) => (
  <TouchableOpacity
    style={styles.list__item}
    onPress={() => onPress(item.id)}
    onLongPress={() => onLongPress(item.id, item.vocaTitle)}>
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
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  search: {
    paddingHorizontal: spacing.M20,
    width: '100%',
    alignItems: 'center',
  },
});

export default VocaList; 