import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';
import { useUserVocas, useUpdateVocaShare } from '../../../server/query/hooks/useVoca';

function MyWordsScreen() {
  const { data: myWordsList, isLoading } = useUserVocas({ userId: 1, page: 0, size: 10, search: '' });
  const updateShare = useUpdateVocaShare();

  const toggleSharing = async (id: number, currentShared: boolean) => {
    try {
      await updateShare.mutateAsync({
        vocaId: id,
        userId: 1,
        isShared: !currentShared
      });
    } catch (error) {
      console.error('공유 상태 업데이트 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>나의 단어장</Text>
        <Text style={styles.header__subtitle}>직접 만든 단어장을 관리하세요</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar initialSuggestions={['자주', '시험', '회화', '오늘']} />
      </View>
      
      <FlatList
        data={myWordsList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.list__item}>
            <View style={styles.list__content}>
              <View style={styles.list__mainInfo}>
                <View style={styles.list__titleRow}>
                  <Text style={styles.list__title}>{item.vocaTitle}</Text>
                  <Text style={styles.list__count}>{item.wordCount}개의 단어</Text>
                </View>
                <Text style={styles.list__date}>마지막 수정: {new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
              </View>
              <View style={styles.list__shareContainer}>
                <Text style={styles.list__shareText}>
                  {item.isShared ? '공유중' : '비공개'}
                </Text>
                <Switch
                  value={item.isShared}
                  onValueChange={() => toggleSharing(item.id, item.isShared || false)}
                  trackColor={{ false: colors.BLACK, true: colors.BLACK }}
                  thumbColor={colors.WHITE}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  header: {
    paddingHorizontal: spacing.M20,
    backgroundColor: colors.WHITE,
  },
  header__title: {
    color: colors.BLACK,
    ...getFontStyle('title', 'large', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  header__subtitle: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  search: {
    paddingHorizontal: spacing.M20,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.M16,
  },
  list: {
    paddingHorizontal: spacing.M20,
  },
  list__item: {
    paddingVertical: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BLACK,
  },
  list__content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list__mainInfo: {
    flex: 1,
    marginRight: spacing.M12,
  },
  list__titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.M4,
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    marginRight: spacing.M8,
  } as TextStyle,
  list__count: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__date: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__shareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list__shareText: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
    marginRight: spacing.M8,
  } as TextStyle,
});

export default MyWordsScreen; 