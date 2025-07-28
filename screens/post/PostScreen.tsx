import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ListRenderItemInfo, TextStyle, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, getFontStyle, PostNavigations, spacing } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { PostStackParamList } from '../../navigations/stack/beforeLogin/PostStackNavigator';
import Margin from '../../components/division/Margin';
import { useInfinitePosts, useLikePost, useLikeStatus } from '../../server/query/hooks/usePost';
import { Post } from '../../types/post';
import PostContentSearch from '../../components/post/PostContentSearch';

type PostScreenNavigationProp = StackNavigationProp<PostStackParamList>;

export const PostScreen = () => {
  const navigation = useNavigation<PostScreenNavigationProp>();
  const [activeCategory, setActiveCategory] = useState('POST');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  
  // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
  const currentUserId = 1;
  
  const { data: postsData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfinitePosts(searchQuery, activeCategory);
  const likePostMutation = useLikePost();

  const CategoryButtons = [
    { label: 'post', id: 'POST' },
    { label: 'shop', id: 'SHOP' },
    { label: 'music', id: 'MUSIC' },
    { label: 'voca', id: 'VOCA' },
  ];

  const handlePostPress = (post: Post) => {
    navigation.navigate(PostNavigations.POSTDETAIL, { postId: post.id });
  };

  const toggleLike = (postId: number) => {
    // 로컬 상태 먼저 업데이트 (즉시 UI 반영)
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      return newLikedPosts;
    });
    
    // API 호출
    likePostMutation.mutate({ postId, userId: currentUserId });
  };


  // 카테고리 변경 시 페이지 리셋
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const renderPost = ({ item }: ListRenderItemInfo<Post>) => (
    <TouchableOpacity activeOpacity={1} onPress={() => handlePostPress(item)}>
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.postImage }} style={styles.profileImage} />
          <Text style={styles.username}>{item.userName}</Text>
        </View>
        <Text style={styles.postContent}>{item.postContent}</Text>
        <Image source={{ uri: item.postImage }} style={styles.postImage} />
        <View style={styles.postFooter}>
                      <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleLike(item.id)}
              disabled={likePostMutation.isPending}
            >
              <Text style={styles.actionButtonText}>
                {likedPosts.has(item.id) ? '❤️' : '🤍'} {item.likes}
              </Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              💬 {typeof item.comments === 'number' ? item.comments : 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
      <View style={styles.nav}>
        {CategoryButtons.map((button) => (
          <CustomButton
            key={button.id}
            label={button.label}
            color={activeCategory === button.label ? 'BLACK' : 'WHITE'}
            onPress={() => handleCategoryChange(button.label)}
            style={styles.categoryButton}
          />
        ))}
      </View>
        
      <Margin size={'M12'} />
      <PostContentSearch category={activeCategory} />
      </View>
      <Margin size={'M8'} />
      
      {/* 모든 카테고리에 대해 동일한 FlatList 사용 */}
      <FlatList
        data={postsData?.pages.flatMap(page => page.content) || []}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.postContainer}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={() => {
          refetch();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  postContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: spacing.M12,
    marginBottom: spacing.M16,
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
  postHeader: {
    paddingHorizontal: spacing.M16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.M12,
  },
  username: {
    ...getFontStyle('titleBody', 'medium', 'bold'),
    color: colors.BLACK,
  }as TextStyle,
  postContent: {
    ...getFontStyle('body', 'medium', 'regular'),
    marginBottom: spacing.M12,
    color: colors.BLACK,
  } as TextStyle,
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: spacing.M8,
    marginBottom: spacing.M12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.M8,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M12,
  },
  actionButtonText: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.BLACK,
  }as TextStyle,
  nav: {
    width: "20%",
    marginTop: spacing.M12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: 160,
  },
  shopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  categoryButton: {
    paddingVertical: spacing.M4,
    paddingHorizontal: spacing.M16,
    minWidth: 80,
  },
  searchInput: {
    height: 40,
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: spacing.M8,
    paddingHorizontal: spacing.M12,
    marginHorizontal: spacing.M16,
  },
});

export default PostScreen;


