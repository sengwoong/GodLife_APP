import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { colors, spacing } from '../../constants';

import CustomButton from '../../components/CustomButton';
import ItemCard from '../../components/ItemCard';
import Pagination from '../../components/Pagination';
import Avatar from '../../components/common/Avatar';

const MOCK_USER = {
  id: '1',
  username: '영어마스터',
  avatar: 'https://via.placeholder.com/150/92c952',
  level: '고급',
  followers: 245,
  following: 123,
  posts: 15,
  description: '매일 영어 공부중! 🌟\n함께 공부해요~',
};

const CATEGORY_BUTTONS = [
  { label: '전체보기', id: 'all' },
  { label: '단어장', id: 'vocabulary' },
  { label: '재생목록', id: 'playlist' },
  { label: '일정표', id: 'schedule' },
];

export const FeedAvatarScreen = () => {
  const [activeCategory, setActiveCategory] = useState('전체보기');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const totalItems = 24;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profile}>
          <Avatar
            uri={MOCK_USER.avatar}
            size={80}
            showBadge={true}
            username={MOCK_USER.username}
          />
          <View style={styles.profile__stats}>
            <View style={styles.profile__stat}>
              <Text style={styles.profile__statNumber}>{MOCK_USER.posts}</Text>
              <Text style={styles.profile__statLabel}>게시물</Text>
            </View>
            <View style={styles.profile__stat}>
              <Text style={styles.profile__statNumber}>{MOCK_USER.followers}</Text>
              <Text style={styles.profile__statLabel}>팔로워</Text>
            </View>
            <View style={styles.profile__stat}>
              <Text style={styles.profile__statNumber}>{MOCK_USER.following}</Text>
              <Text style={styles.profile__statLabel}>팔로잉</Text>
            </View>
          </View>
        </View>

        <View style={styles.profile__info}>
          <Text style={styles.profile__username}>{MOCK_USER.username}</Text>
          <Text style={styles.profile__level}>Level: {MOCK_USER.level}</Text>
          <Text style={styles.profile__description}>{MOCK_USER.description}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actions__follow}>
            <Text style={styles.actions__followText}>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actions__message}>
            <Text style={styles.actions__messageText}>메시지</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.category}>
          {CATEGORY_BUTTONS.map((button) => (
            <CustomButton
              key={button.id}
              label={button.label}
              color={activeCategory === button.label ? 'BLACK' : 'WHITE'}
              onPress={() => setActiveCategory(button.label)}
            />
          ))}
        </View>

        <View style={styles.content}>
          <Text style={styles.content__title}>
            {activeCategory === '전체보기' ? '최근 활동' : activeCategory}
          </Text>
          
          <View style={styles.content__list}>
            <View style={styles.content__grid}>
              <ItemCard />
              <ItemCard />
              <ItemCard />
              <ItemCard />
            </View>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              textColor={'BLACK'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  profile: {
    padding: spacing.M16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  profile__stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: spacing.M16,
  },
  profile__stat: {
    alignItems: 'center',
  },
  profile__statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  profile__statLabel: {
    fontSize: 12,
    color: colors.GRAY,
  },
  profile__info: {
    padding: spacing.M16,
  },
  profile__username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: spacing.M4,
  },
  profile__level: {
    fontSize: 14,
    color: colors.GREEN,
    marginBottom: spacing.M8,
  },
  profile__description: {
    fontSize: 14,
    color: colors.BLACK,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.M16,
    justifyContent: 'space-between',
  },
  actions__follow: {
    flex: 1,
    backgroundColor: colors.GREEN,
    padding: spacing.M12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: spacing.M8,
  },
  actions__followText: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  actions__message: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: spacing.M12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: spacing.M8,
    borderWidth: 1,
    borderColor: colors.GREEN,
  },
  actions__messageText: {
    color: colors.GREEN,
    fontWeight: 'bold',
  },
  category: {
    flexDirection: 'row',
    width: '24%',
    paddingVertical: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  content: {
    padding: spacing.M16,
  },
  content__title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: spacing.M16,
  },
  content__grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.M16,
  },
  content__list: {
    marginTop: spacing.M16,
  },
}); 