import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextStyle, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, getFontStyle } from '../../../constants';
import { useInfinitePointHistory } from '../../../server/query/hooks/usePoint';
import { Point } from '../../../types/point';
import { formatDate } from '../../../utils/dateUtils';
import { PullToRefresh } from '../../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

function PointUsageScreen() {
  const userId = 1; // 실제 사용시에는 로그인된 사용자 ID를 사용
  const queryClient = useQueryClient();
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading,
    isFetchingNextPage 
  } = useInfinitePointHistory(userId, 'use');

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 포인트 사용 내역 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['pointHistory', userId, 'use'] });
    queryClient.invalidateQueries({ queryKey: ['points'] });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const renderItem = ({ item }: { item: Point }) => (
    <View style={styles.historyItem}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={[styles.points, { color: colors.RED }]}>
        -{item.points}p
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
          keyExtractor={(item, index) => `usage-${item.id}-${index}`}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator /> : null
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
  title: {
    ...getFontStyle('body', 'medium', 'medium'),
    marginBottom: spacing.M4,
  } as TextStyle,
  date: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  points: {
    ...getFontStyle('body', 'medium', 'medium'),
  } as TextStyle,
});

export default PointUsageScreen; 