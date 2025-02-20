import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ListRenderItemInfo, TextStyle, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, getFontStyle, spacing } from '../../constants';
import CustomButton from '../../components/CustomButton';
import PlaylistLayout from '../../components/common/MusicListPlay/MusicListLayout';
import { PostStackParamList } from '../../navigations/stack/beforeLogin/PostStackNavigator';
import Margin from '../../components/division/Margin';
import { usePost } from '../../server/query/hooks/usePost';
import { Post } from '../../types/post';
import SearchBar from '../../components/searchbar/SearchBar';
import PostContentSearch from '../../components/post/PostContentSearch';

type PostScreenNavigationProp = StackNavigationProp<PostStackParamList>;

export const PostScreen = () => {
  const navigation = useNavigation<PostScreenNavigationProp>();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('post');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  
  const { data: postsData, isLoading } = usePost(activeCategory, searchQuery, page);

  const CategoryButtons = [
    { label: 'post', id: 'post' },
    { label: 'shop', id: 'shop' },
    { label: 'music', id: 'music' },
    { label: 'like', id: 'like' },
  ];

  const handlePostPress = (post: Post) => {
    navigation.navigate('PostDetail', { postId: post.id });
  };

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId.toString())) {
        newLikedPosts.delete(postId.toString());
      } else {
        newLikedPosts.add(postId.toString());
      }
      return newLikedPosts;
    });
  };

  const handlePlayAll = () => {
    console.log('Play all songs');
  };

  const handleShuffle = () => {
    console.log('Shuffle songs');
  };

  const handleMenu = () => {
    console.log('Open menu');
  };

  const handleItemPress = (id: number) => {
    console.log('Selected song:', id);
  };

  const renderPost = ({ item }: ListRenderItemInfo<Post>) => (
    <TouchableOpacity activeOpacity={1} onPress={() => handlePostPress(item)}>
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
          <Text style={styles.username}>{item.userName}</Text>
        </View>
        <Text style={styles.postContent}>{item.postContent}</Text>
        <Image source={{ uri: item.postImage }} style={styles.postImage} />
        <View style={styles.postFooter}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Text style={styles.actionButtonText}>
              {likedPosts.has(item.id.toString()) ? '❤️' : '🤍'} {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              💬 {item.comments?.length || 0}
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
            onPress={() => setActiveCategory(button.label)}
            style={styles.categoryButton}
          />
        ))}
      </View>
        
      <Margin size={'M12'} />
      <PostContentSearch category={activeCategory} />
      </View>
      <Margin size={'M8'} />
      {activeCategory === 'post' && (
        <FlatList
          data={postsData?.content || []}
          renderItem={renderPost}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.postContainer}
          onEndReached={() => {
            if (postsData && page < postsData.totalPages - 1) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
      
      {activeCategory === 'shop' && (
        <FlatList
          data={postsData?.content || []}
          renderItem={renderPost}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.postContainer}
          onEndReached={() => {
            if (postsData && page < postsData.totalPages - 1) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}

      {activeCategory === 'music' && (
           <FlatList
           data={postsData?.content || []}
           renderItem={renderPost}
           keyExtractor={item => item.id.toString()}
           contentContainerStyle={styles.postContainer}
           onEndReached={() => {
             if (postsData && page < postsData.totalPages - 1) {
               setPage(prev => prev + 1);
             }
           }}
           onEndReachedThreshold={0.5}
         />
      )}

      {activeCategory === 'like' && (
        <FlatList
          data={postsData?.content || []}
          renderItem={renderPost}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.postContainer}
          onEndReached={() => {
            if (postsData && page < postsData.totalPages - 1) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
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


