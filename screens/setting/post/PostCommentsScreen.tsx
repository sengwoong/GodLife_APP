import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextStyle, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing,PostNavigations, drawerNavigations } from '../../../constants';
import SearchBar from '../../../components/searchbar/SearchBar';
import Margin from '../../../components/division/Margin';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMyComments } from '../../../server/query/hooks/usePost';
import { formatDate } from '../../../utils/dateUtils';
import { PostStackParamList } from '../../../navigations/stack/beforeLogin/PostStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../../navigations/drawer/MainDrawerNavigator';
import { SettingStackParamList } from '../../../navigations/stack/beforeLogin/SettingStackNavigator';

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<SettingStackParamList>,
  CompositeNavigationProp<
    DrawerNavigationProp<MainDrawerParamList>,
    StackNavigationProp<PostStackParamList>
  >
>;

function PostCommentsScreen() {
  const userId = 1; 
  const { data: commentsData, isLoading } = useMyComments(userId);
  const navigation = useNavigation<NavigationProp>();
  if (isLoading) {
    return <ActivityIndicator />;
  }

  const handlePostPress = (postId: number, postTitle: string) => {
    Alert.alert(
      '포스트로 이동',
      `${postTitle} 포스트로 이동하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '이동',
          onPress: () => {
            navigation.navigate(drawerNavigations.POST, { screen: PostNavigations.POSTDETAIL, params: { postId } });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M2'} />
      <View style={styles.header}>
        <Text style={styles.header__title}>댓글 관리</Text>
        <Text style={styles.header__subtitle}>내가 작성한 댓글을 관리하세요</Text>
      </View>
      <Margin size={'M16'} />
      <View style={styles.search}>
        <SearchBar 
          initialSuggestions={['학습', '영단어', '시험']} 
        />
      </View>
      
      <FlatList
        data={commentsData?.content || []}
        renderItem={({ item }) => (
          <View style={styles.list__item}>
            <TouchableOpacity 
              style={styles.list__content}
              onPress={() => handlePostPress(item.postId, item.postTitle)}
            >
              <View style={styles.list__mainInfo}>
                <View style={styles.list__titleContainer}>
                  <Text style={styles.list__postTitle}>{item.postTitle}</Text>
                  <Icon name="chevron-right" size={20} color={colors.GRAY} />
                </View>
                <Text style={styles.list__comment}>{item.content}</Text>
                <View style={styles.list__footer}>
                  <Text style={styles.list__date}>{formatDate(item.createdAt)}</Text>
                  <Text style={styles.list__likes}>좋아요 {item.likes}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
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
  },
  list__mainInfo: {
    flex: 1,
  },
  list__titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.M4,
  },
  list__postTitle: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'bold'),
    flex: 1,
  } as TextStyle,
  list__comment: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
    marginBottom: spacing.M8,
  } as TextStyle,
  list__footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list__date: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
  list__likes: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
});

export default PostCommentsScreen;
