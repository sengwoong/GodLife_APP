import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextStyle, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, getFontStyle } from '../../../constants';
import { useInfinitePointHistory } from '../../../server/query/hooks/usePoint';
import { Point } from '../../../types/point';
import { formatDate } from '../../../utils/dateUtils';
import { PullToRefresh } from '../../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

function PointHistoryScreen() {
  const userId = 1; // 실제 사용시에는 로그인된 사용자 ID를 사용
  const queryClient = useQueryClient();
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading,
    isFetchingNextPage 
  } = useInfinitePointHistory(userId, 'EARN');

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 포인트 히스토리 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['points', userId, 'EARN'] });
    queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.GREEN} />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Point }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemLeft}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={[styles.points, { color: colors.GREEN }]}>
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
    <PullToRefresh onRefresh={handleRefresh} isFlatList={true}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data?.pages.flatMap(page => page.content) || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => `history-${item.id}-${index}`}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator color={colors.GREEN} /> : null
          }
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
      </SafeAreaView>
    </PullToRefresh>
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
  itemLeft: {
    flex: 1,
    marginRight: spacing.M12,
  },
  title: {
    ...getFontStyle('body', 'medium', 'medium'),
    marginBottom: spacing.M4,
    color: colors.BLACK,
  } as TextStyle,
  content: {
    ...getFontStyle('body', 'small', 'regular'),
    marginBottom: spacing.M4,
    color: colors.LIGHT_BLACK,
  } as TextStyle,
  date: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
  } as TextStyle,
  points: {
    ...getFontStyle('body', 'medium', 'bold'),
  } as TextStyle,
});

export default PointHistoryScreen; 