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
import { useUser, useUserAllPosts } from '../../server/query/hooks/useUser';
import { useUserVocas } from '../../server/query/hooks/useVoca';
import { useUserPlaylist } from '../../server/query/hooks/usePlayList';
import { useUserPosts } from '../../server/query/hooks/usePost';

const CATEGORY_BUTTONS = [
  { label: '전체보기', id: 'all' },
  { label: '단어장', id: 'vocabulary' },
  { label: '재생목록', id: 'playlist' },
  { label: '포스트', id: 'post' },
];

export const PostAvatarScreen = () => {
  const [activeCategory, setActiveCategory] = useState('전체보기');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { data: userData } = useUser('1');
  const { data: userAllPosts } = useUserAllPosts('1', currentPage, pageSize);
  const {data: userVocas} = useUserVocas({userId: '1', page: currentPage, size: pageSize});
  const {data: userPlaylists} = useUserPlaylist({userId: '1', page: currentPage, size: pageSize});
  const {data: userPosts} = useUserPosts({userId: '1', page: currentPage, size: pageSize});

  const renderItems = () => {
    switch (activeCategory) {
      case '전체보기':
        if (!userAllPosts?.allItems) {
          return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>데이터가 없습니다.</Text></View>;
        }
        return userAllPosts.allItems.map((item, index) => (
          <ItemCard 
            key={`all-${index}`}
            item={item}
            type={'all'}
          />
        ));
      
      case '단어장':
        if (!userVocas?.content) return null;
        return userVocas.content.map((voca, index) => (
          <ItemCard key={`voca-${index}`} item={voca} type="voca" />
        ));
      
      case '재생목록':
        if (!userPlaylists?.content) return null;
        return userPlaylists.content.map((playlist, index) => (
          <ItemCard key={`playlist-${index}`} item={playlist} type="playlist" />
        ));
      
      case '포스트':
        if (!userPosts?.content) return null;
        return userPosts.content.map((post, index) => (
          <ItemCard key={`post-${index}`} item={post} type="post" />
        ));
      
      default:
        return null;
    }
  };

  const getCurrentTotalPages = () => {
    switch (activeCategory) {
      case '전체보기':
        return userAllPosts?.totalPages || 0;
      case '단어장':
        return userVocas?.totalPages || 0;
      case '재생목록':
        return userPlaylists?.totalPages || 0;
      case '포스트':
        return userPosts?.totalPages || 0;
      default:
        return 0;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profile}>
          <Avatar
            uri={userData?.profileImage || 'https://via.placeholder.com/150/92c952'}
            size={80}
            showBadge={true}
            username={userData?.nickName || '사용자'}
          />
          <View style={styles.profile__stats}>
            <View style={styles.profile__stat}>
              <Text style={styles.profile__statNumber}>{userAllPosts?.posts.length || 0}</Text>
              <Text style={styles.profile__statLabel}>게시물</Text>
            </View>
            <View style={styles.profile__stat}>
              <Text style={styles.profile__statNumber}>{userData?.followers || 0}</Text>
              <Text style={styles.profile__statLabel}>팔로워</Text>
            </View>
            <View style={styles.profile__stat}>
              <Text style={styles.profile__statNumber}>{userData?.following || 0}</Text>
              <Text style={styles.profile__statLabel}>팔로잉</Text>
            </View>
          </View>
        </View>

        <View style={styles.profile__info}>
          <Text style={styles.profile__username}>{userData?.nickName || '사용자'}</Text>
          <Text style={styles.profile__level}>Level: {userData?.level || ''}</Text>
          <Text style={styles.profile__description}>{userData?.bio || ''}</Text>
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
              onPress={() => {
                setActiveCategory(button.label);
                setCurrentPage(0);
              }}
            />
          ))}
        </View>

        <View style={styles.content}>
          <Text style={styles.content__title}>
            {activeCategory === '전체보기' ? '최근 활동' : activeCategory}
          </Text>
          
          <View style={styles.content__list}>
            <View style={styles.content__grid}>
              {renderItems()}
            </View>

            <Pagination
              currentPage={currentPage + 1}
              totalPages={getCurrentTotalPages()}
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
    paddingHorizontal: spacing.M16,
    gap: spacing.M8,
  },
  content__list: {
    marginTop: spacing.M16,
  },
}); 