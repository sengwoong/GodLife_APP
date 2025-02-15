import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import { SettingStackParamList } from '../../navigations/stack/beforeLogin/SettingStackNavigator';
import { drawerNavigations, SettingNavigations } from '../../constants';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<SettingStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function SettingScreen() {
  const navigation = useNavigation<Navigation>();

  return (
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
            <Text style={styles.menuText}>포스트 친구에게 전송</Text>
          </TouchableOpacity>
        </View>

        {/* Playlist Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>플레이리스트</Text>
          <TouchableOpacity 
            style={styles.playlistItem}
            onPress={() => navigation.navigate(SettingNavigations.RECENTPLAYLIST)}
          >
            <Text style={styles.playlistText}>최근 재생목록</Text>
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
            <Text style={styles.playlistText}>찜하기 표시한 곡</Text>
            <Text style={styles.playlistCount}>24곡</Text>
          </TouchableOpacity>
        </View>

        {/* Word List Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>단어 리스트</Text>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate(SettingNavigations.STUDYWORDS)}
          >
            <Text style={styles.menuText}>공부할 단어</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate(SettingNavigations.PURCHASEDWORDS)}
          >
            <Text style={styles.menuText}>구매한 단어</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate(SettingNavigations.MYWORDS)}
          >
            <Text style={styles.menuText}>나의 단어</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  pointBox: {
    alignItems: 'center',
  },
  pointValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalPoints: {
    backgroundColor: '#000',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  totalPointsLabel: {
    color: '#fff',
    fontSize: 14,
  },
  totalPointsValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 16,
  },
  playlistText: {
    fontSize: 16,
  },
  playlistCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingScreen;