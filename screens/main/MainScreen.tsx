import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Image, TextStyle } from 'react-native';
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

const GRADIENT_SIZE = 54;
const AVATAR_SIZE = 50;
const MUSIC_PLAYER_WIDTH = "80%";

function MainScreen() {
  const [activeButton, setActiveButton] = useState('전체보기');
  
  const musicData: Music[] = [
    {
      id: '1',
      title: 'Blizzards',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
      audioUrl: 1,
    },
    {
      id: '2',
      title: 'Calm',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing.',
      audioUrl: 2,
    },
  ];

  const CategoryButtons = [
    { label: '전체보기', id: 'all' },
    { label: '단어장', id: 'vocabulary' },
    { label: '재생목록', id: 'playlist' },
    { label: '일정표', id: 'schedule' },
  ];

  const popularAvatars = [
    { id: 1, image: 'https://example.com/avatar1.png', name: 'Avatar 1', flower: 23 },
    { id: 2, image: 'https://example.com/avatar2.png', name: 'Avatar 2', flower: 33 },
    { id: 3, image: 'https://example.com/avatar3.png', name: 'Avatar 3', flower: 53 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 99;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.header__title}></View>
          <CardSlider musicData={musicData} calendarItems={[]}/>
        </View>

        <View style={styles.content}>
          <Margin size={'M16'} />

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
            <Image source={{ uri: 'https://example.com/product1.png' }} style={styles.product__image} />
            <Image source={{ uri: 'https://example.com/product2.png' }} style={styles.product__image} />
            <Image source={{ uri: 'https://example.com/product3.png' }} style={styles.product__image} />
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
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
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
                  <Text style={styles.ranking__name}>{avatar.name}</Text> 
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
  container: {
    flex: 1,
  },
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

  // 플레이어 블록
  player: {
    flexDirection: 'row',
    backgroundColor: colors.BLACK,
    borderRadius: 100,
    width: MUSIC_PLAYER_WIDTH,
    padding: spacing.M8,
    alignSelf: 'center',
  },
  player__avatar: {
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

  // 상품 이미지
  product__image: {
    display: 'flex',
    width: 164,
    height: 262,
    borderRadius: 15,
    backgroundColor: colors.GRAY,
    marginRight: spacing.M4,
  },

  // 네비게이션
  nav: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: 160,
  },

  // 섹션 블록
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

  // 랭킹 블록
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
  },
  ranking__gradientPosition: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -90 / 2 }, { translateY: -90 / 2 }],
    zIndex: -1,
  },
  ranking__score: {
    borderRadius: 10,
    width: 30,
    height: 20,
    backgroundColor: colors.BLUE,
    alignSelf: 'center',
    top: -10,
  },
  ranking__scoreText: {
    textAlign: "center",
    ...getFontStyle("body", "large", "medium")
  } as TextStyle,
  ranking__name: {
    textAlign: "center",
    color: colors.WHITE,
    ...getFontStyle("body", "large", "medium")
  } as TextStyle,

  footer: {
    height: 300,
    zIndex: -1,
  },
});

export default MainScreen;
