import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import { SettingStackParamList } from '../../navigations/stack/beforeLogin/SettingStackNavigator';
import { drawerNavigations, SettingNavigations } from '../../constants';
import { colors, spacing, getFontStyle } from '../../constants';
import { PullToRefresh } from '../../components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<SettingStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function SettingScreen() {
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 설정 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['points'] });
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>GODLIFE - 설정</Text>
          </View>

          {/* Points Section */}
          <View style={styles.pointsContainer}>
            <View style={styles.pointBox}>
              <Text style={styles.pointValue}>150p</Text>
              <Text style={styles.pointLabel}>매일 매뉴</Text>
            </View>
            <View style={styles.pointBox}>
              <Text style={styles.pointValue}>100p</Text>
              <Text style={styles.pointLabel}>서브 매뉴</Text>
            </View>
          </View>

          {/* Total Points */}
          <View style={styles.totalPoints}>
            <Text style={styles.totalPointsLabel}>전체 포인트</Text>
            <Text style={styles.totalPointsValue}>3,000p</Text>
          </View>

          {/* Menu Items */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate(SettingNavigations.POINTHISTORY)}
          >
            <Text style={styles.menuText}>포인트 적립 내역</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate(SettingNavigations.POINTUSAGE)}
          >
            <Text style={styles.menuText}>포인트 사용 내역</Text>
          </TouchableOpacity>

          {/* Post Management Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>포스트 관리</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate(SettingNavigations.POSTCOMMENTS)}
            >
              <Text style={styles.menuText}>댓글 관리</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate(SettingNavigations.POSTADS)}
            >
              <Text style={styles.menuText}>포스트 광고 관리</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate(SettingNavigations.POSTSHARE)}
            >
              <Text style={styles.menuText}>포스트 공유</Text>
            </TouchableOpacity>
          </View>

          {/* Playlist Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>플레이리스트</Text>
            <TouchableOpacity 
              style={styles.playlistItem}
              onPress={() => navigation.navigate(SettingNavigations.IMPORT)}
            >
              <Text style={styles.playlistText}>유튜브 재생목록 가져오기</Text>
              <Text style={styles.playlistCount}>12곡</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.playlistItem}
              onPress={() => navigation.navigate(SettingNavigations.MYPLAYLIST)}
            >
              <Text style={styles.playlistText}>내 플레이리스트</Text>
              <Text style={styles.playlistCount}>8곡</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.playlistItem}
              onPress={() => navigation.navigate(SettingNavigations.LIKEDPLAYLIST)}
            >
              <Text style={styles.playlistText}>좋아요한 플레이리스트</Text>
              <Text style={styles.playlistCount}>5곡</Text>
            </TouchableOpacity>
          </View>

          {/* Words Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>단어장</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate(SettingNavigations.MYWORDS)}
            >
              <Text style={styles.menuText}>내 단어장</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate(SettingNavigations.STUDYWORDS)}
            >
              <Text style={styles.menuText}>학습한 단어</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PullToRefresh>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    padding: spacing.M16,
  },
  headerTitle: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  }as TextStyle,
  pointsContainer: {
    flexDirection: 'row',
    padding: spacing.M16,
    justifyContent: 'space-around',
  },
  pointBox: {
    alignItems: 'center',
  },
  pointValue: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.BLACK,
  }as TextStyle,
  pointLabel: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
    marginTop: spacing.M4,
  }as TextStyle,
  totalPoints: {
    backgroundColor: colors.BLACK,
    padding: spacing.M16,
    marginHorizontal: spacing.M16,
    borderRadius: spacing.M8,
  },
  totalPointsLabel: {
    color: colors.WHITE,
    ...getFontStyle('body', 'small', 'regular'),
  }as TextStyle,
  totalPointsValue: {
    color: colors.WHITE,
    ...getFontStyle('title', 'large', 'bold'),
    marginTop: spacing.M4,
  }as TextStyle,
  menuItem: {
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
    marginHorizontal: spacing.M16,
  },
  menuText: {
    ...getFontStyle('body', 'medium', 'regular'),
  }as TextStyle,
  section: {
    marginTop: spacing.M24,
  },
  sectionTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
    marginLeft: spacing.M16,
    marginBottom: spacing.M8,
  }as TextStyle,
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.M16,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
    marginHorizontal: spacing.M16,
  },
  playlistText: {
    ...getFontStyle('body', 'medium', 'regular'),
  }as TextStyle,
  playlistCount: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.GRAY,
  }as TextStyle,
});

export default SettingScreen;