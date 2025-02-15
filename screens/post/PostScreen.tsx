import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ListRenderItemInfo, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, getFontStyle, spacing } from '../../constants';
import CustomButton from '../../components/CustomButton';
import PlaylistLayout from '../../components/playlist/PlaylistLayout';
import { PostStackParamList } from '../../navigations/stack/beforeLogin/PostStackNavigator';
import Margin from '../../components/division/Margin';
type PostScreenNavigationProp = StackNavigationProp<PostStackParamList>;

interface Post {
  id: string;
  userName: string;
  profileImage: string;
  postContent: string;
  postImage: string;
  likes: number;
  comments: number;
}

interface PlaylistItem {
  id: number;
  title: string;
  artist: string;
  color: string;
}

const data: Post[] = [
  {
    id: '1',
    userName: '홍길동',
    profileImage: 'https://placekitten.com/100/100', // 예시 이미지 URL
    postContent: '오늘은 좋은 날이에요! 😊',
    postImage: 'https://placekitten.com/600/400', // 예시 게시물 이미지 URL
    likes: 15,
    comments: 5
  },
  {
    id: '2',
    userName: '김철수',
    profileImage: 'https://placekitten.com/101/101',
    postContent: 'React Native 포스트 디자인 테스트중!',
    postImage: 'https://placekitten.com/600/401',
    likes: 10,
    comments: 3
  },
  {
    id: '3',
    userName: '김철수',
    profileImage: 'https://placekitten.com/101/101',
    postContent: 'React Native 포스트 디자인 테스트중!',
    postImage: 'https://placekitten.com/600/401',
    likes: 8,
    comments: 2
  },
  {
    id: '4',
    userName: '김철수',
    profileImage: 'https://placekitten.com/101/101',
    postContent: 'React Native 포스트 디자인 테스트중!',
    postImage: 'https://placekitten.com/600/401',
    likes: 12,
    comments: 4
  },
  {
    id: '5',
    userName: '김철수',
    profileImage: 'https://placekitten.com/101/101',
    postContent: 'React Native 포스트 디자인 테스트중!',
    postImage: 'https://placekitten.com/600/401',
    likes: 10,
    comments: 3
  },
];

const songList: PlaylistItem[] = [
  {
    id: 1,
    title: '노래 제목 1',
    artist: '아티스트 1',
    color: '#FFFFFF',
  },
  {
    id: 2,
    title: '노래 제목 2',
    artist: '아티스트 2',
    color: '#FFFFFF',
  },
];

export const PostScreen = () => {
  const navigation = useNavigation<PostScreenNavigationProp>();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('post');

  const CategoryButtons = [
    { label: 'post', id: 'post' },
    { label: 'shop', id: 'shop' },
    { label: 'music', id: 'music' },
    { label: 'like', id: 'like' },
  ];

  const handlePostPress = (post: Post) => {
    navigation.navigate('PostDetail', { post });
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
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
    const selectedSong = songList.find(song => song.id === id);
    if (selectedSong) {
      console.log('Selected song:', selectedSong.title);
    }
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
              {likedPosts.has(item.id) ? '❤️' : '🤍'} {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💬 {item.comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
      {activeCategory === 'post' && (
        <FlatList
          data={data}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.postContainer}
        />
      )}
      
      {activeCategory === 'shop' && (
      <FlatList
          data={data}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.postContainer}
        />
      )}

      {activeCategory === 'music' && (
       <PlaylistLayout
       title="플레이리스트 제목"
       data={songList}
       showTabs={false}
       onPlayAll={handlePlayAll}
       onShuffle={handleShuffle}
       onMenuPress={handleMenu}
       onItemPress={handleItemPress}
     />
      )}

      {activeCategory === 'like' && (
      <FlatList
        data={data}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postContainer}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.M12,
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
});

export default PostScreen;


