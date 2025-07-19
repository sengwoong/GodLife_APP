import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, TextStyle } from 'react-native';
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

const VocaContentList: React.FC<VocaContentListProps> = ({ vocaIndex, navigateToWordDetail }) => {
  const searchText = useSearchStore(state => state.searchText);
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteWords(vocaIndex, searchText);

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
});

export default VocaContentList;
