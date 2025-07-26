import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle, RefreshControl } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useInfiniteWords } from '../../server/query/hooks/useWord';
import { useSearchStore } from '../../store/useSearchStore';
import { useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

interface Word {
  id: number;
  word: string;
  meaning: string;
  vocaId: number;
}

interface VocaContentListProps {
  navigateToWordDetail: (wordId: number) => void;
}

const WordItem = ({ item, onPress }: { item: Word; onPress: (id: number) => void }) => (
  <TouchableOpacity
    style={styles.list__item}
    onPress={() => onPress(item.id)}>
    <View style={styles.list__content}>
      <Text style={styles.list__title}>{item.word}</Text>
      <Text style={styles.list__meaning}>{item.meaning}</Text>
    </View>
  </TouchableOpacity>
);

const VocaContentList: React.FC<VocaContentListProps> = ({ navigateToWordDetail }) => {
  const searchText = useSearchStore(state => state.searchText);
  const queryClient = useQueryClient();
  
  const route = useRoute();
  const { vocaIndex } = route.params as { vocaIndex: number };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteWords(vocaIndex, searchText);

  // 새로고침 핸들러
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ['words', vocaIndex] });
    queryClient.invalidateQueries({ queryKey: ['vocas'] });
    await refetch();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.GREEN} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.content) || []}
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
          refreshing={isLoading}
          onRefresh={handleRefresh}
          colors={[colors.GREEN]}
          tintColor={colors.GREEN}
          title="당겨서 새로고침"
          titleColor={colors.LIGHT_BLACK}
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
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
});

export default VocaContentList;
