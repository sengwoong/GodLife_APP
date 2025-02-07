import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { colors } from '../constants/index';

const { width: screenWidth } = Dimensions.get('window');
const sliderWidth = screenWidth - 64; // 32 * 2

interface ImageSliderProps {
  images: Array<{ uri: string } | number>; 
  interval?: number;
  dotSize?: number;
  activeDotWidth?: number;
  dotColor?: string;
  activeDotColor?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  interval = 3000,
  dotSize = 8,
  activeDotWidth = 30,
  dotColor = colors.GRAY,
  activeDotColor = colors.GREEN
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: currentIndex * sliderWidth,
      animated: true,
    });
  }, [currentIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / sliderWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      > 
        {images.map((image, index) => (
          <Image 
            key={index} 
            source={image} 
            style={[styles.image, { width: sliderWidth, height: sliderWidth }]}  
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { 
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                marginHorizontal: 4,
                backgroundColor: currentIndex === index ? activeDotColor : dotColor,
                ...(currentIndex === index && { width: activeDotWidth })
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {

  },
});

export default ImageSlider;
