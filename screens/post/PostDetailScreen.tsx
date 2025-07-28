import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, TextStyle, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import CustomButton from '../../components/CustomButton';
import Margin from '../../components/division/Margin';
import BulletinBoard from '../../components/BulletinBoard';
import { colors, getFontStyle, spacing } from '../../constants';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PostNavigations } from '../../constants';
import { PostStackParamList } from '../../navigations/stack/beforeLogin/PostStackNavigator';
import PostMenu from '../../components/PostMenu';
import { useSharedPost, useCommentsByPost, useCreateComment, useLikePost, useLikeStatus } from '../../server/query/hooks/usePost';
import { Comment } from '../../types/post';

type PostDetailScreenNavigationProp = StackNavigationProp<PostStackParamList>;

export const PostDetailScreen = () => {
  const [activeButton, setActiveButton] = useState('상품정보');
  const route = useRoute<RouteProp<PostStackParamList, 'PostDetail'>>();
  const { postId } = route.params;
  const navigation = useNavigation<PostDetailScreenNavigationProp>();

  const { data: post, isLoading } = useSharedPost(postId.toString());
  const { data: commentsData, isLoading: commentsLoading } = useCommentsByPost(postId);
  const createCommentMutation = useCreateComment();
  
  // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
  const currentUserId = 1;
  const { data: likeStatus } = useLikeStatus(postId, currentUserId);
  const likePostMutation = useLikePost();
  
  const CategoryButtons = [
    { label: '상품정보', id: 'product-info' },
    { label: '구매평', id: 'reviews' },
    { label: '반품교환', id: 'returns' },
    { label: 'QA', id: 'questions' },
  ];

  const qa_content = useMemo(
    () => [
      { 
        id: 1, 
        title: '배송 관련 문의',
        content: '구매 후 다운로드는 언제 가능한가요?',
        userName: '김구매',
        createdAt: '2024-03-15',
        isAnswered: true,
        answer: {
          content: '결제 완료 즉시 다운로드 가능합니다.',
          createdAt: '2024-03-15',
          adminName: '고객센터'
        }
      },
      { 
        id: 2, 
        title: '환불 문의',
        content: '실수로 구매했는데 환불 가능할까요?',
        userName: '이환불',
        createdAt: '2024-03-14',
        isAnswered: true,
        answer: {
          content: '다운로드 이력이 없다면 환불 가능합니다.',
          createdAt: '2024-03-14',
          adminName: '고객센터'
        }
      },
    ],
    []
  );

  const comments = commentsData?.content || [];

  const navigateToContent = (Index: number) => {
    console.log(Index);
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>로딩중...</Text>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    if (!post) return null;

    switch (post.type) {
      case 'music':
      case 'voca':
        return (
          <View style={styles.section}>
            <Text style={styles.section__title}>상품 정보</Text>
            <Margin size={'M4'} />
            <View style={styles.voca__info}>
              <BulletinBoard data={post.items} onItemPress={navigateToContent} />
            </View>
          </View>
        );
      case 'normal':
        return (
          <View style={styles.section}>
            <Text style={styles.section__title}>상품 정보</Text>
            <Margin size={'M4'} />
            <Text style={styles.section__text}>{post.postContent}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <SafeAreaView style={styles.container}>
          <View style={styles.product__container}>
            <View style={styles.product__header}>
              <Image source={{ uri: post.postImage }} style={styles.product__image} />
              <View style={styles.product__info}>
                  <Text style={styles.product__owner}>{post.title}</Text>
                <TouchableOpacity onPress={() => navigation.navigate(PostNavigations.POSTAVATAR, { userId: post.userId })}>
                  <Text style={styles.product__username}>{post.userName}</Text>
                </TouchableOpacity>
                <Text style={styles.product__price}>{post.price} point</Text>
                <View style={styles.product__actions}>
                  <CustomButton 
                    color="BLACK" 
                    shape="rounded" 
                    size="text_size" 
                    label={`${likeStatus?.isLiked ? '❤️' : '🤍'} 좋아요 ${post.likes}`}
                    onPress={() => likePostMutation.mutate({ postId: post.id, userId: currentUserId })}
                    disabled={likePostMutation.isPending}
                  />
                  <CustomButton color="BLACK" shape="rounded" size="text_size" label="장바구니" />
                </View>
              </View>
            </View>
            <Margin size={'M12'} />
            <CustomButton color="BLACK" size="large" label="구매하기" />
          </View>

          <View style={styles.navigation}>
            {CategoryButtons.map((button) => (
              <PostMenu
                key={button.id}
                label={button.label}
                color={activeButton === button.label ? 'BLACK' : 'WHITE'}
                onPress={() => setActiveButton(button.label)}
              />
            ))}
          </View>

          <View style={styles.content__container}>
            {renderContent()}

            {/* 구매평 섹션 수정 */}
            <View style={styles.section}>
              <Text style={styles.section__title}>구매평</Text>
              <Margin size={'M4'} />
              {commentsLoading ? (
                <Text>댓글 로딩중...</Text>
              ) : (
                <BulletinBoard 
                  data={comments.map(comment => ({
                    id: comment.id,
                    title: comment.userName,
                    content: comment.content
                  }))} 
                  onItemPress={navigateToContent} 
                />
              )}
              <Margin size={'M8'} />
              <TextInput 
                placeholder="구매평을 남기기 위해 댓글을 작성 하세요" 
                style={styles.section__input} 
              />
              <Margin size={'M4'} />
              <CustomButton 
                size="large" 
                label="구매평 남기기" 
                onPress={() => {
                  // 댓글 작성 로직 추가 예정
                  console.log('댓글 작성');
                }}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.section__title}>반품/교환 안내</Text>
              <Margin size={'M4'} />
              <View style={styles.return__info}>
                <Text style={styles.section__text}>• 다운로드 전에는 반품이 가능합니다.</Text>
                <Text style={styles.section__text}>• 결제 후 20일 이후에는 반품이 불가능합니다.</Text>
                <Text style={styles.section__text}>• 반품된 금액은 포인트로 환급됩니다.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.section__title}>Q&A</Text>
              <Margin size={'M4'} />
              <BulletinBoard data={qa_content} onItemPress={navigateToContent} />
            </View>
          </View>
        </SafeAreaView>
      }
      keyExtractor={() => 'header'}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  product__container: {
    margin: spacing.M16,
  },
  product__header: {
    flexDirection: 'row',
  },
  product__image: {
    width: 164,
    height: 262,
    borderRadius: 10,
    marginRight: spacing.M12,
  },
  product__info: {
    flex: 1,
  },
  product__title: {
    ...getFontStyle('title', 'large', 'bold'),
    marginTop: spacing.M12,
  } as TextStyle,
  product__owner: {
    ...getFontStyle('title', 'medium', 'medium'),
    marginTop: spacing.M12,
  } as TextStyle,
  product__username: {
    ...getFontStyle('body', 'medium', 'medium'),
    marginTop: spacing.M12,
    textDecorationLine: 'underline',
  } as TextStyle,
  product__price: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.BLACK,
    marginTop: spacing.M12,
  } as TextStyle,
  product__actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.M12,
    marginTop: spacing.M12,
  },
  navigation: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left:"40%"
  },
  content__container: {
    paddingHorizontal: spacing.M16,
  },
  section: {
    padding: spacing.M16,
  },
  section__title: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  section__text: {
    ...getFontStyle('body', 'medium', 'medium'),
  } as TextStyle,
  music__info: {
    marginTop: spacing.M12,
  },
  return__info: {
    paddingVertical: spacing.M8,
  },
  comment__container: {
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    marginBottom: spacing.M16,
  },
  comment__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.M12,
  },
  comment__header__title: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  comment__list: {
    marginTop: spacing.M8,
  },
  comment__list__title: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.BLACK,
    marginBottom: spacing.M8,
  } as TextStyle,
  section__input: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 5,
    padding: spacing.M12,
  },
  voca__info: {
    marginTop: spacing.M12,
  },
});