import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextStyle, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, getFontStyle } from '../../../constants';
import { usePointSummary } from '../../../server/query/hooks/usePoint';
import { useQueryClient } from '@tanstack/react-query';

function PointSummaryScreen() {
  const userId = 1; // 실제 사용시에는 로그인된 사용자 ID를 사용
  const queryClient = useQueryClient();
  
  const { 
    data: summary, 
    isLoading, 
    error 
  } = usePointSummary(userId);

  // 새로고침 핸들러
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ['pointSummary', userId] });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.GREEN} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>포인트 정보를 불러올 수 없습니다</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>포인트 현황</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>새로고침</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        {/* 총 포인트 */}
        <View style={styles.totalPointCard}>
          <Text style={styles.totalPointLabel}>총 포인트</Text>
          <Text style={styles.totalPointValue}>{summary?.totalPoints || 0}p</Text>
        </View>

        {/* 상세 정보 */}
        <View style={styles.detailContainer}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>적립 포인트</Text>
            <Text style={[styles.detailValue, { color: colors.GREEN }]}>
              +{summary?.earnedPoints || 0}p
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>사용 포인트</Text>
            <Text style={[styles.detailValue, { color: colors.RED }]}>
              -{summary?.usedPoints || 0}p
            </Text>
          </View>
        </View>

        {/* 포인트 사용 가이드 */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideTitle}>포인트 사용 방법</Text>
          <View style={styles.guideItem}>
            <Text style={styles.guideText}>• 음악 구매: 100p</Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideText}>• 플레이리스트 구매: 150p</Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideText}>• 단어장 구매: 200p</Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideText}>• 테마 구매: 300p</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  headerTitle: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  refreshButton: {
    padding: spacing.M8,
    backgroundColor: colors.GREEN,
    borderRadius: spacing.M8,
  },
  refreshButtonText: {
    ...getFontStyle('body', 'small', 'medium'),
    color: colors.WHITE,
  } as TextStyle,
  summaryContainer: {
    padding: spacing.M16,
  },
  totalPointCard: {
    backgroundColor: colors.GREEN,
    padding: spacing.M24,
    borderRadius: spacing.M16,
    alignItems: 'center',
    marginBottom: spacing.M24,
  },
  totalPointLabel: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.WHITE,
    marginBottom: spacing.M8,
  } as TextStyle,
  totalPointValue: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.WHITE,
    fontSize: 32,
  } as TextStyle,
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.M24,
  },
  detailCard: {
    flex: 1,
    backgroundColor: colors.LIGHT_GRAY,
    padding: spacing.M16,
    borderRadius: spacing.M12,
    alignItems: 'center',
    marginHorizontal: spacing.M4,
  },
  detailLabel: {
    ...getFontStyle('body', 'small', 'medium'),
    color: colors.BLACK,
    marginBottom: spacing.M8,
  } as TextStyle,
  detailValue: {
    ...getFontStyle('body', 'large', 'bold'),
  } as TextStyle,
  guideContainer: {
    backgroundColor: colors.LIGHT_GRAY,
    padding: spacing.M16,
    borderRadius: spacing.M12,
  },
  guideTitle: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M12,
  } as TextStyle,
  guideItem: {
    marginBottom: spacing.M4,
  },
  guideText: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.M24,
  },
  errorText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.RED,
    marginBottom: spacing.M16,
    textAlign: 'center',
  } as TextStyle,
  retryButton: {
    padding: spacing.M12,
    backgroundColor: colors.GREEN,
    borderRadius: spacing.M8,
  },
  retryButtonText: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.WHITE,
  } as TextStyle,
});

export default PointSummaryScreen; 