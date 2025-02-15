import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';

interface PostAd {
  id: number;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
}

function PostAdsScreen() {
  const [postAds, setPostAds] = useState<PostAd[]>([
    { id: 1, title: '새해 이벤트 광고', status: true, startDate: '2024.01.01', endDate: '2024.01.31' },
    { id: 2, title: '봄맞이 할인', status: false, startDate: '2024.03.01', endDate: '2024.03.31' },
    { id: 3, title: '여름 특별전', status: true, startDate: '2024.06.01', endDate: '2024.06.30' },
  ]);

  const toggleAdStatus = (id: number) => {
    setPostAds(prevAds =>
      prevAds.map(ad =>
        ad.id === id ? { ...ad, status: !ad.status } : ad
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>포스트 광고 관리</Text>
        <Text style={styles.header__subtitle}>광고 상태를 관리하세요</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['이벤트', '할인', '특별전']} 
        />
      </View>
      
      <FlatList
        data={postAds}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.list__item}>
            <View style={styles.list__content}>
              <View style={styles.list__mainInfo}>
                <Text style={styles.list__title}>{item.title}</Text>
                <Text style={styles.list__date}>
                  {item.startDate} ~ {item.endDate}
                </Text>
              </View>
              <View style={styles.list__statusContainer}>
                <Text style={styles.list__statusText}>
                  {item.status ? '진행중' : '중지'}
                </Text>
                <Switch
                  value={item.status}
                  onValueChange={() => toggleAdStatus(item.id)}
                  trackColor={{ false: colors.GRAY, true: colors.YELLOW }}
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
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    marginBottom: spacing.M4,
  } as TextStyle,
  list__date: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list__statusText: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
    marginRight: spacing.M8,
  } as TextStyle,
});

export default PostAdsScreen;
