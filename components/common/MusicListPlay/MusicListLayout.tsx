import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, FlatList, View, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import Margin from '../../division/Margin';
import PlaylistItemList from './MusiclistItemList';
import { Music } from '../../../types/music';
import SearchBar from '../../searchbar/SearchBar';

interface PlaylistItem {
  id: number;
  title: string;
  artist: string;
  color: string;
}

interface PlaylistLayoutProps {
  title: string;
  subtitle?: string;
  showTabs?: boolean;
  musicList?: Music[] | undefined;
  onPlayAll?: () => void;
  onShuffle?: () => void;
  onMenuPress?: () => void;
  onItemPress?: (id: string) => void;
}

function PlaylistLayout({
  title,
  subtitle,
  musicList,
  onPlayAll,
  onShuffle,
  onMenuPress,
  onItemPress,
}: PlaylistLayoutProps) {

  const topButtons = useMemo(() => (
    <View style={styles.topButtons}>
      <View style={styles.leftButtons}>
        <TouchableOpacity style={styles.playButton} onPress={onPlayAll}>
          <Icon name="playcircleo" size={16} color={colors.WHITE} />
          <Text style={styles.playButtonText}>전체 재생</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shuffleButton} onPress={onShuffle}>
          <Icon name="retweet" size={16} color={colors.WHITE} />
          <Text style={styles.shuffleButtonText}>셔플</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Icon name="bars" size={24} color={colors.BLACK} />
      </TouchableOpacity>
    </View>
  ), [onPlayAll, onShuffle, onMenuPress]);

  console.log('musicList', musicList)
  console.log('musicList', musicList)
  console.log('musicList', musicList)
  const header = useMemo(() => (
    <View style={styles.header}>
      <Margin size={'M16'} />
      <Text style={styles.header__title}>{title}</Text>
      {subtitle && (
        <Text style={styles.header__subtitle}>{subtitle}</Text>
      )}
      <Margin size={'M12'} />
    </View>
  ), [title, subtitle]);

  return (
    <SafeAreaView style={styles.container}>
      {topButtons}
      <SearchBar initialSuggestions={musicList?.map(item => item.musicTitle)} />
      {header}
      <Margin size={'M4'} />
      <PlaylistItemList musicList={musicList} onItemPress={onItemPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.M16,
    paddingVertical: spacing.M12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  leftButtons: {
    flexDirection: 'row',
    gap: spacing.M12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.M4,
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M16,
    backgroundColor: colors.BLACK,
    borderRadius: 8,
  },
  playButtonText: {
    color: colors.WHITE,
    ...getFontStyle('body', 'small', 'medium'),
  } as TextStyle,
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.M4,
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M16,
    backgroundColor: colors.BLACK,
    borderRadius: 8,
  },
  shuffleButtonText: {
    color: colors.WHITE,
    ...getFontStyle('body', 'small', 'medium'),
  } as TextStyle,
  menuButton: {
    padding: spacing.M8,
  },
  header: {
    paddingHorizontal: spacing.M16,
    backgroundColor: colors.WHITE,
  },
  header__title: {
    color: colors.BLACK,
    ...getFontStyle('title', 'large', 'bold'),
  } as TextStyle,
  header__subtitle: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
    marginBottom: spacing.M4,
  } as TextStyle,
  header__tabs: {
    flexDirection: 'row',
    gap: spacing.M4,
  },
  tab: {
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M12,
  },
  tab__active: {
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M16,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 20,
  },
  tab__text: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  tab__text_active: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  list: {
    paddingHorizontal: spacing.M12,
  },
  list__item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.M8,
    gap: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  list__thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  list__content: {
    flex: 1,
  },
  list__title: {
    color: colors.BLACK,
    ...getFontStyle('body', 'medium', 'regular'),
  } as TextStyle,
  list__artist: {
    color: colors.BLACK,
    ...getFontStyle('body', 'small', 'regular'),
  } as TextStyle,
});

export default PlaylistLayout; 