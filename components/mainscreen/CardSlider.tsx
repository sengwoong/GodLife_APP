import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, TextStyle, FlatList } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';
import Line from '../division/Line';
import Margin from '../division/Margin';
import MusicPlayer from './MusicPlayer';
import { Music } from '../../types/music';

const { width } = Dimensions.get('window');

interface CardSliderProps {
  musicData: Music[];
  calendarItems: Array<{
    time: string;
    title: string;
    description: string;
  }>;
}

const CardSlider = ({ 
  musicData, 
  calendarItems 
}: CardSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const TOTAL_CARDS = 3;

  useEffect(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % TOTAL_CARDS);
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: currentIndex * width,
      animated: true,
    });
  }, [currentIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.cardWarrper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {/* 단어 학습 */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>영어 단어</Text>
            <Margin size={'M8'} />
            <Text style={styles.cardWordTitle}>단어</Text>
            <Text style={styles.cardDescription}>이 단어는 매우 중요합니다.</Text>

          </View>
          <View style={styles.cardIcons}>
            <Text style={styles.cardIcon}>◀</Text>
            <Text style={styles.cardIcon}>▶</Text>
          </View>
        </View>

        {/* 플레이리스트 */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>현재 플레이 중인 노래</Text>
            <Margin size={'M8'} />
            <MusicPlayer musicData={musicData} />
          </View>

        </View>

        {/* 캘린더 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘 할일</Text>
          <Margin size={'M8'} />
          <FlatList

            data={calendarItems}
            renderItem={({ item }) => (
              <View style={styles.cardContent}>
                <Text style={styles.cardCalenadrTime}
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {item.time}
                </Text>
                <View style={styles.CalenadrListCard}>
                  <Text style={styles.cardCalenadrTitle}
                    numberOfLines={1} 
                    ellipsizeMode="tail"
                  >
                    {item.title} - 
                  </Text>
                  <Text style={styles.cardCalenadrDescription} 
                    numberOfLines={1} 
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </View>
                <Line/>
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </ScrollView>
      <View style={styles.pagination}>
        {Array.from({ length: TOTAL_CARDS }).map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWarrper: {
    width: width,
  },
  card: {
    backgroundColor: colors.BLACK,
    padding: spacing.M20,
    width: width,
    height: 300,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',

  },
  cardDescriptionContainer: {
    marginBottom: spacing.M8,
  },
  cardDescription: {
    ...getFontStyle('titleBody', 'large', 'regular'),
    color: colors.LIGHT_GRAY,
    marginBottom: spacing.M16,
  } as TextStyle,
  cardContent: {
    flexGrow: 1,
  },
  cardTitle: {
    ...getFontStyle('display', 'small', 'bold'),
    color: colors.GREEN,
    marginBottom: spacing.M8,
  } as TextStyle,
  cardWordTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.WHITE,
    marginBottom: spacing.M8,
  } as TextStyle,
  cardIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.M8,
  },
  cardIcon: {
    ...getFontStyle('display', 'small', 'bold'),
    color: colors.GREEN,
  } as TextStyle,
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    top: spacing.M16,
    right: spacing.M16,
  },
  playListCard: {
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.M4,

  },
  cardplayTitle: {
    ...getFontStyle('title', 'small', 'bold'),
    color: colors.WHITE,
    marginBottom: spacing.M8,
    overflow:'hidden',
  } as TextStyle,
  activeDot: {
    backgroundColor: colors.GREEN,
    width: 30,
  },

  inactiveDot: {
    backgroundColor: colors.GRAY,
  },
  cardCalenadrTitle: {
    ...getFontStyle('title', 'small', 'bold'),
    color: colors.WHITE,
    marginBottom: spacing.M8,
    maxWidth:'40%'
  } as TextStyle,
  cardCalenadrDescription: {
    ...getFontStyle('title', 'medium', 'medium'),
    color: colors.WHITE,
    marginBottom: spacing.M8,
    marginRight: 1
  } as TextStyle,
  cardCalenadrTime: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.WHITE,
  } as TextStyle,
  CalenadrListCard: {
    alignItems:'center',
    flexDirection: 'row',
  },
});

export default CardSlider;
