import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextStyle, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, getFontStyle } from '../../../constants';
import { useInfiniteReceiptHistory, useReceiptStats } from '../../../server/query/hooks/usePoint';
import { Receipt } from '../../../types/point';
import { formatDate } from '../../../utils/dateUtils';
import { PullToRefresh } from '../../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

function ReceiptHistoryScreen() {
  const userId = 1; // 실제 사용시에는 로그인된 사용자 ID를 사용
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<Receipt['status'] | null>(null);
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading,
    isFetchingNextPage 
  } = useInfiniteReceiptHistory(userId, selectedStatus || undefined);

  const { data: stats } = useReceiptStats(userId);

  // 새로고침 핸들러
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ['receipts', userId, selectedStatus] });
    queryClient.invalidateQueries({ queryKey: ['receiptStats', userId] });
  };

  const getStatusColor = (status: Receipt['status']) => {
    switch (status) {
      case 'COMPLETED':
        return colors.GREEN;
      case 'PENDING':
        return colors.YELLOW;
      case 'CANCELLED':
        return colors.RED;
      case 'REFUNDED':
        return colors.BLUE;
      default:
        return colors.GRAY;
    }
  };

  const getStatusText = (status: Receipt['status']) => {
    switch (status) {
      case 'COMPLETED':
        return '완료';
      case 'PENDING':
        return '대기중';
      case 'CANCELLED':
        return '취소됨';
      case 'REFUNDED':
        return '환불됨';
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: Receipt }) => (
    <View style={styles.receiptItem}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemType}>{item.itemType}</Text>
        <Text style={styles.date}>{formatDate(item.purchaseDate)}</Text>
        <Text style={styles.transactionId}>거래번호: {item.transactionId}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.quantity}>수량: {item.quantity}</Text>
        <Text style={styles.price}>단가: {item.price}p</Text>
        <Text style={styles.totalAmount}>총액: {item.totalAmount}p</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </View>
  );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity 
        style={[styles.filterButton, selectedStatus === null && styles.filterButtonActive]}
        onPress={() => setSelectedStatus(null)}
      >
        <Text style={[styles.filterButtonText, selectedStatus === null && styles.filterButtonTextActive]}>
          전체
        </Text>
      </TouchableOpacity>
      {(['COMPLETED', 'PENDING', 'CANCELLED', 'REFUNDED'] as const).map((status) => (
        <TouchableOpacity 
          key={status}
          style={[styles.filterButton, selectedStatus === status && styles.filterButtonActive]}
          onPress={() => setSelectedStatus(status)}
        >
          <Text style={[styles.filterButtonText, selectedStatus === status && styles.filterButtonTextActive]}>
            {getStatusText(status)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.GREEN} />
      </SafeAreaView>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} isFlatList={true}>
      <SafeAreaView style={styles.container}>
        {/* 통계 정보 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>총 구매액</Text>
            <Text style={styles.statValue}>{stats?.totalAmount || 0}p</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>완료된 거래</Text>
            <Text style={styles.statValue}>{stats?.count || 0}건</Text>
          </View>
        </View>

        {/* 필터 */}
        {renderStatusFilter()}

        <FlatList
          data={data?.pages.flatMap(page => page.content) || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => `receipt-${item.id}-${index}`}
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
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.M16,
    backgroundColor: colors.LIGHT_GRAY,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.M12,
  },
  statLabel: {
    ...getFontStyle('body', 'small', 'medium'),
    color: colors.BLACK,
    marginBottom: spacing.M4,
  } as TextStyle,
  statValue: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.GREEN,
  } as TextStyle,
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.M12,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  filterButton: {
    paddingHorizontal: spacing.M12,
    paddingVertical: spacing.M8,
    marginHorizontal: spacing.M4,
    borderRadius: spacing.M16,
    backgroundColor: colors.LIGHT_GRAY,
  },
  filterButtonActive: {
    backgroundColor: colors.GREEN,
  },
  filterButtonText: {
    ...getFontStyle('body', 'small', 'medium'),
    color: colors.BLACK,
  } as TextStyle,
  filterButtonTextActive: {
    color: colors.WHITE,
  } as TextStyle,
  receiptItem: {
    flexDirection: 'row',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  itemLeft: {
    flex: 1,
    marginRight: spacing.M12,
  },
  itemName: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M4,
  } as TextStyle,
  itemType: {
    ...getFontStyle('body', 'small', 'medium'),
    color: colors.GREEN,
    marginBottom: spacing.M4,
  } as TextStyle,
  date: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
    marginBottom: spacing.M4,
  } as TextStyle,
  transactionId: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.LIGHT_BLACK,
  } as TextStyle,
  itemRight: {
    alignItems: 'flex-end',
  },
  quantity: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
    marginBottom: spacing.M2,
  } as TextStyle,
  price: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
    marginBottom: spacing.M2,
  } as TextStyle,
  totalAmount: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.GREEN,
    marginBottom: spacing.M8,
  } as TextStyle,
  statusBadge: {
    paddingHorizontal: spacing.M8,
    paddingVertical: spacing.M4,
    borderRadius: spacing.M12,
  },
  statusText: {
    ...getFontStyle('body', 'small', 'medium'),
    color: colors.WHITE,
  } as TextStyle,
});

export default ReceiptHistoryScreen; 