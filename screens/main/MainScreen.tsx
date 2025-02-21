import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Image, TextStyle, ImageStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
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
import { useBestUsers } from '../../server/query/hooks/useUser';

const GRADIENT_SIZE = 54;
const AVATAR_SIZE = 50;
const MUSIC_PLAYER_WIDTH = "80%";

function MainScreen() {
  const [activeButton, setActiveButton] = useState('전체보기');
  


  const CategoryButtons = [
    { label: '전체보기', id: 'all' },
    { label: '단어장', id: 'vocabulary' },
    { label: '재생목록', id: 'playlist' },
    { label: '일정표', id: 'schedule' },
  ];

  const { data: bestPosts, isLoading: isLoadingBestPosts } = useBestPosts();

  const { data: bestUsers, isLoading: isLoadingBestUsers } = useBestUsers();

  console.log("bestPosts", bestPosts);

  const popularAvatars = bestUsers?.users.slice(0, 3).map(user => ({
    id: user.id,
    image: user.profileImage,
    name: user.nickName,
    flower: user.level
  })) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 99;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const musicData: Music[] = [
    {
      id: '1',
      musicTitle: 'Blizzards',
      musicUrl: "https://example.com/com",
      color: colors.BLUE,
      imageUrl: 'https://example.com/avatar1.png',
    }
  ]  
   
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
                {bestPosts.posts.map((post, index) => (
                  <View key={index} style={styles.product__container}>
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
                ))}
              </>
            )}
            {isLoadingBestPosts && (
              <View style={[styles.product__image, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.BLACK }}>로딩중...</Text>
              </View>
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
              color={activeButton === button.label ? 'BLACK' : 'WHITE'}
              onPress={() => setActiveButton(button.label)}
            />
          ))}
        </View>

        <Margin size={'M16'} />

        <LinearGradient colors={[colors.BLACK, colors.GREEN]} style={styles.section}>
          <Text style={styles.section__title}>추천 상품</Text>
          <View style={styles.section__content}>
            {!isLoadingBestPosts && bestPosts?.posts && (
              <>
                {/* {bestPosts.posts.map((post) => (
                  <SquareItemCard
                    key={post.id}
                    item={post}
                  />
                ))} */}
              </>
            )}
            {isLoadingBestPosts && (
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
    marginRight: spacing.M12,
  },
  product__image: {
    width: 164,
    height: 262,
    borderRadius: 8,
    backgroundColor: colors.GRAY,
  } as ImageStyle,
  product__info: {
    padding: spacing.M8,
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
    overflow: 'visible', 
  },
  section__title: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.WHITE,
    marginBottom: spacing.M12,
  } as TextStyle,
  section__content: {
    width: "100%",
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
});

export default MainScreen;
