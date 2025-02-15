import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';

function PurchasedWordsScreen() {
  const [purchasedList] = useState([
    { id: 1, title: 'TOEIC 빈출 단어 1000', date: '2024.03.15', price: '2,000P' },
    { id: 2, title: '수능 필수 어휘 500', date: '2024.03.10', price: '1,500P' },
    { id: 3, title: '비즈니스 영어 단어', date: '2024.03.05', price: '3,000P' },
    { id: 4, title: '일상 회화 패턴', date: '2024.02.28', price: '1,800P' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>구매한 단어</Text>
        <Text style={styles.header__subtitle}>구매하신 단어 목록입니다</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['TOEIC', '수능', '회화', '비즈니스']} 
        />
      </View>
      
      <FlatList
        data={purchasedList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.list__item}>
            <View style={styles.list__content}>
              <View style={styles.list__mainInfo}>
                <Text style={styles.list__title}>{item.title}</Text>
                <Text style={styles.list__date}>{item.date}</Text>
              </View>
              <View style={styles.list__priceContainer}>
                <Text style={styles.list__price}>{item.price}</Text>
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
    borderBottomColor: colors.GRAY,
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
    color: colors.GRAY,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__priceContainer: {
    backgroundColor: colors.YELLOW,
    paddingHorizontal: spacing.M12,
    paddingVertical: spacing.M4,
    borderRadius: 12,
  },
  list__price: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'bold'),
  } as TextStyle,
});

export default PurchasedWordsScreen; 