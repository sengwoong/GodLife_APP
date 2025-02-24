import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, getFontStyle } from '../../../constants';
import { useInfinitePointHistory } from '../../../server/query/hooks/usePoint';
import { Point } from '../../../types/point';
import { formatDate } from '../../../utils/dateUtils';

function PointHistoryScreen() {
  const userId = 1; // 실제 사용시에는 로그인된 사용자 ID를 사용
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading,
    isFetchingNextPage 
  } = useInfinitePointHistory(userId, 'earn');

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const renderItem = ({ item }: { item: Point }) => (
    <View style={styles.historyItem}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={[styles.points, { color: colors.BLUE }]}>
        +{item.points}p
      </Text>
    </View>
  );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.pages.flatMap(page => page.content) || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => `history-${item.id}-${index}`}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  title: {
    ...getFontStyle('body', 'medium', 'regular'),
    marginBottom: spacing.M4,
  }as TextStyle,
  date: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
  }as TextStyle,
  points: {
    ...getFontStyle('body', 'medium', 'medium'),
  }as TextStyle,
});

export default PointHistoryScreen; 