import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Music } from '../../types';
import { colors } from '../../constants';
import Margin from '../division/Margin';


interface MusicPlayerProps {
  musicData: Music[];
}

const MusicPlayer = ({ musicData }: MusicPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % musicData.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + musicData.length) % musicData.length);

  return (
    <View style={styles.container}>
      <View style={styles.playlistArt}>
        <View style={styles.dot} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.musicInfo}>
          <Text style={styles.songTitle}>{musicData[currentIndex].title}</Text>
          <Text style={styles.description}>{musicData[currentIndex].description}</Text>
        </View>
        <Margin size={'M12'} />
        <View style={styles.controls}>
    
          <TouchableOpacity onPress={handlePrev}>
            <Text style={styles.navText}>PREV</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
            <Text style={styles.playButtonText}>
              {isPlaying ? '∥' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.navText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    padding: 15,
    borderRadius: 10,
    height: 180,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistArt: {
    width: 130,
    height: 130,
    backgroundColor: colors.WHITE,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.BLACK,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
  },
  musicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    color: colors.GRAY,
    fontSize: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  playButton: {
    width: 24,
    height: 24,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: colors.BLACK,
    fontSize: 10,
    fontWeight: 'bold',
  },
  navText: {
    color: colors.WHITE,
    fontSize: 10,
  },
});

export default MusicPlayer; 