import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../searchbar/SearchBar';
import { useInfinitePosts } from '../../server/query/hooks/usePost';
import { useSearchStore } from '../../store/useSearchStore';

interface PostContentSearchProps {
  category: string;
}

const PostContentSearch: React.FC<PostContentSearchProps> = ({ category }) => {
  const searchText = useSearchStore(state => state.searchText);
  
  const {
    data,
  } = useInfinitePosts(searchText,category);
  console.log("PostContentSearch");
  console.log("data");
  console.log(data);
  const postSuggestions = data?.pages.flatMap(page => page.content.map(item => item.postContent)) || [];
  console.log("postSuggestions");
  console.log(postSuggestions);
  return (
    <View style={styles.search}>
      <SearchBar initialSuggestions={postSuggestions} />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    alignItems: 'center',
  },
});

export default PostContentSearch; 