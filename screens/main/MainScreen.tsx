import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Image, TextStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, getFontStyle, spacing, MainNavigations } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import ItemCard from '../../components/ItemCard';
import CustomButton from '../../components/CustomButton';
import SpeechBubble from '../../components/SpeechBubble';
import Line from '../../components/division/Line';
import GoldenIcon from '../../components/Icon/GoldenIcont';
import Pagination from '../../components/Pagination';
import Margin from '../../components/division/Margin';
import CardSlider from '../../components/mainscreen/CardSlider';
import { Music } from '../../types';
import SquareItemCard from '../../components/SquareItemCard';
import { useBestPosts } from '../../server/query/hooks/usePost';
// import { useBestUsers, useUserRecommend } from '../../server/query/hooks/useUser';
import { BasePost } from '../../types/post';

const GRADIENT_SIZE = 54;
const AVATAR_SIZE = 50;
const MUSIC_PLAYER_WIDTH = "80%";

type mainStackParamList = {
  [MainNavigations.MAIN]: undefined;
  [MainNavigations.POST_DETAIL]: { postId: number };
};

type NavigationProp = NativeStackNavigationProp<mainStackParamList>;

function MainScreen() {
  const navigation = useNavigation<NavigationProp>();

  const CategoryButtons = [
    { label: '전체보기', id: 'post' },
    { label: '단어장', id: 'voca' },
    { label: '재생목록', id: 'playlist' },
    { label: '음악', id: 'music' },
  ];

  const [activeButton, setActiveButton] = useState<{
    label: string;
    id: string;
  }>(CategoryButtons[0]);


  const { data: bestPosts, isLoading: isLoadingBestPosts } = useBestPosts();

  // 임시로 빈 값 반환
  const { data: bestUsers, isLoading: isLoadingBestUsers } = { data: null, isLoading: false } as any;

  // 임시로 빈 값 반환
  const { data: recommendContent, isLoading: isLoadingRecommend } = { data: null, isLoading: false } as any;

  console.log("bestPosts", bestPosts);

  const popularAvatars = (bestUsers?.users?.slice(0, 3).map((user: any) => ({
    id: user.id,
    image: user.profileImage,
    name: user.nickName,
    flower: user.level
  })) || []) as any[];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 99;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (label: string, id: string) => {
    setActiveButton({ label, id });
  };



  const musicData: any[] = [
    {
      id: '1',
      musicTitle: 'Blizzards',
      musicUrl: "https://example.com/com",
      color: colors.BLUE,
      imageUrl: 'https://example.com/avatar1.png',
      musicLike: false
    }
  ]  
   
  const getContentByType = () => {
    if (!recommendContent) return [];
    
    switch (activeButton.id) {
      case 'post':
        return recommendContent.posts || [];
      case 'voca':
        return recommendContent.vocas || [];
      case 'playlist':
        return recommendContent.playlists || [];
      case 'music':
        return recommendContent.musics || [];
      default:
        return recommendContent.allItems || [];
    }
  };

  const handlePostPress = (postId: number) => {
    console.log('Navigating to post:', postId);
    navigation.navigate(MainNavigations.POST_DETAIL, {
      postId: postId
    });
  };

  return (
    <SafeAreaView >
      <ScrollView>

        <View>
          <CardSlider musicData={musicData} calendarItems={[]}/>
        </View>

        <Margin size={'M16'} />

        <View style={styles.content}>

          <View style={styles.player}>
            <View style={styles.player__avatar}>
              <Image 
                source={{ uri: 'https://example.com/avatar.png' }} 
                style={styles.player__avatarImage} 
              />
              <LinearGradient
                style={[styles.player__gradient, styles.player__gradientPosition]}
                colors={[colors.BLUE, colors.GREEN]}
              />
            </View>
            
            <View style={styles.player__text}>
              <Text style={styles.player__title}>저번주 들던 명상 곡</Text>
              <Text style={styles.player__subtitle}>마음을 달래주는 선율</Text>
            </View>
          </View>

          <Margin size={'M12'} />
          <Text style={styles.content__title}>다양한 컨텐츠를 즐겨 보아요</Text>
          <Margin size={'M8'} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {!isLoadingBestPosts && bestPosts?.posts && (
              <>
                {(bestPosts.posts as any[]).map((post: any, index: number) => (
                  <TouchableOpacity 
                    key={post.id}
                    onPress={() => {
                      console.log('Pressing post:', post.id);
                      handlePostPress(post.id);
                    }}
                    activeOpacity={0.8}
                    style={{ width: 164, marginRight: spacing.M2 }}
                  >
                    <View style={styles.product__container}>
                      <Image 
                        source={{ uri: post.postImage }} 
                        style={styles.product__image as ImageStyle} 
                      />
                      <View style={styles.product__info}>
                        <Text style={styles.product__category}>{post.userName}</Text>
                        <Text 
                          style={styles.product__description} 
                          numberOfLines={2} 
                          ellipsizeMode="clip" 
                        >
                          {post.title}
                        </Text>
                        <View style={styles.product__priceContainer}>
                          {post.sale && (
                            <Text style={styles.product__price}>
                              {post.price} 포인트
                            </Text>
                          )}
                        </View>
                        <View style={styles.product__ratingContainer}>
                          <Text style={styles.product__tag}>#{post.type}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {isLoadingBestPosts && (
              <>
                {[...Array(5)].map((_, index) => (
                  <View key={index} style={styles.product__container}>
                    <View style={[styles.product__image, styles.skeleton]}/>
                    <View style={styles.product__info}>
                      <View style={[styles.skeleton, { width: '40%', height: 16, marginBottom: 8 }]} />
                      <View style={[styles.skeleton, { width: '80%', height: 14, marginBottom: 4 }]} />
                      <View style={[styles.skeleton, { width: '60%', height: 14 }]} />
                    </View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>

        <Margin size={'M70'} />
        <Line />
        <Margin size={'M12'} />

        <SpeechBubble title={null} subtitle="다양한 컨텐츠가 있어요  😀" />
        
        <View style={styles.nav}>
          {CategoryButtons.map((button) => (
            <CustomButton
              key={button.id}
              label={button.label}
              color={activeButton.label === button.label ? 'BLACK' : 'WHITE'}
              onPress={() => handleCategoryChange(button.label, button.id)}
            />
          ))}
        </View>

        <Margin size={'M16'} />

        <LinearGradient colors={[colors.BLACK, colors.GREEN]} style={[styles.section, { position: 'relative' }]}>
          <Text style={styles.section__title}>추천 상품</Text>
          <Margin size={'M8'} />
          <View style={[styles.section__content, { position: 'relative' }]}>
            {!isLoadingRecommend && recommendContent && (
              <>
                {getContentByType().map((item: any, index: number) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{ 
                      width: '100%',
                      position: 'relative',
                      zIndex: 1000,
                    }}
                    onPress={() => {
                      console.log('Pressing recommended item:', item.id);
                      handlePostPress(Number(item.id));
                    }}
                    activeOpacity={0.8}
                  >
                    <SquareItemCard
                      key={item.id}
                      item={item as BasePost}
                      type={activeButton.id as 'post' | 'voca' | 'playlist' | 'music'}
                    />
                  </TouchableOpacity>
                ))}
                {getContentByType().length === 0 && (
                  <Text style={[styles.section__title, { color: colors.WHITE }]}>
                    해당 카테고리의 항목이 없습니다
                  </Text>
                )}
              </>
            )}
            {isLoadingRecommend && (
              <Text style={[styles.section__title, { color: colors.WHITE }]}>
                로딩중...
              </Text>
            )}
          </View>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <View style={styles.section__bubble}>
            <SpeechBubble title={null} subtitle="다양한 컨텐츠가 있어요  😀" />
            <GoldenIcon />
          </View>

          <Margin size={'M16'} />
          <Text style={styles.ranking__title}>TOP3 재생목록</Text>
          <Margin size={'M16'} />

          <View style={styles.ranking__list}>
            {popularAvatars.map((avatar) => (
              <View style={styles.ranking__item} key={avatar.id}>
                <View>
                  <Image source={{ uri: avatar.image }} style={styles.ranking__avatar} />
                  <LinearGradient
                    style={[styles.ranking__gradient, styles.ranking__gradientPosition]}
                    colors={[colors.BLUE, colors.RED]}
                  />
                </View>
                <View style={styles.ranking__score}>
                  <Text style={styles.ranking__scoreText}>{avatar.flower}</Text> 
                </View>
                <View>
                  <Text numberOfLines={1} ellipsizeMode="clip" style={styles.ranking__name}>{avatar.name}</Text> 
                </View>
                <CustomButton 
                  size='text_size' 
                  label='follow' 
                  shape='rounded' 
                  variant='outlined'
                />
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.M16,
  },
  header__title: {
    marginBottom: spacing.M16,
  },
  content__title: {
    ...getFontStyle('title', 'medium', 'bold'),
    textAlign: 'center',
    color: colors.BLACK,
  } as TextStyle,
  player: {
    flexDirection: 'row',
    backgroundColor: colors.BLACK,
    borderRadius: 100,
    width: MUSIC_PLAYER_WIDTH,
    padding: spacing.M8,
    alignSelf: 'center',
  },
  player__avatar: {
    position: 'relative',
  },
  player__avatarImage: {
    backgroundColor: colors.BLACK,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  player__gradient: {
    width: GRADIENT_SIZE,
    height: GRADIENT_SIZE,
    borderRadius: GRADIENT_SIZE / 2,
  },
  player__gradientPosition: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -GRADIENT_SIZE / 2 }, { translateY: -GRADIENT_SIZE / 2 }],
    zIndex: -1,
  },
  player__text: {
    flex: 1,
    marginLeft: spacing.M8,
    justifyContent: 'center',
  },
  player__title: {
    ...getFontStyle('titleBody', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  player__subtitle: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.WHITE,
  } as TextStyle,

  product__container: {
    width: 164,
    marginRight: spacing.M2,
  },
  product__image: {
    width: 164,
    height: 262,
    borderRadius: 8,
    backgroundColor: colors.GRAY,
  } as ImageStyle,
  product__info: {
    padding: spacing.M2,
  },
  product__category: {
    ...getFontStyle('title', 'small', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  product__description: {
    ...getFontStyle('body', 'mediumSmall', 'regular'),
    color: colors.BLACK,
    flexWrap: 'nowrap',
    marginTop: 2,
    
  } as TextStyle,
  product__priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  product__price: {
    ...getFontStyle('body', 'small', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  product__ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  product__rating: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  product__tag: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,

  nav: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: 160,
  },

  section: {
    flex: 1,
    backgroundColor: colors.BLACK,
    height: 1240,
    borderRadius: 15,
    paddingHorizontal: spacing.M16,
    paddingVertical: spacing.M32,
    position: 'relative',
    overflow: 'visible',
  },
  section__title: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.WHITE,
    marginBottom: spacing.M12,
    position: 'relative',
    zIndex: 1,
  } as TextStyle,
  section__content: {
    width: "100%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.M16,
    position: 'relative',
    zIndex: 2,
  },
  section__bubble: {
    height: 320,
  },

  ranking__title: {
    color: colors.WHITE,
    textAlign: "center",
    ...getFontStyle("display", "small", "medium")
  } as TextStyle,
  ranking__list: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  ranking__item: {
    alignItems: 'center',
    width: 90,
    gap: 4,
  },
  ranking__avatar: {
    backgroundColor: colors.BLACK,
    width: 85,
    height: 85,
    borderRadius: 85 / 2,
  },
  ranking__gradient: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    position: 'absolute',
    zIndex: -1,
  },
  ranking__gradientPosition: {
    position: 'absolute',
    top: '50%',
    left: '47%',
    transform: [{ translateX: -90 / 2 }, { translateY: -90 / 2 }],
    zIndex: -1,
  },
  ranking__score: {
    borderRadius: 10,
    width: 30,
    height: 20,
    backgroundColor: colors.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  ranking__scoreText: {
    color: colors.BLACK,
    ...getFontStyle("body", "small", "medium")
  } as TextStyle,
  ranking__name: {
    color: colors.WHITE,
    ...getFontStyle("titleBody", "small", "bold"),
  } as TextStyle,

  footer: {
    height: 300,
    zIndex: -1,
  },
  skeleton: {
    backgroundColor: colors.GRAY,
    overflow: 'hidden',
    position: 'relative',
  },

});

export default MainScreen;
