import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function PointHistoryScreen() {
  const historyData = [
    { id: 1, title: '매일 매뉴 이용', date: '2024.01.20', points: '+150p' },
    { id: 2, title: '서브 매뉴 이용', date: '2024.01.19', points: '+100p' },
    { id: 3, title: '출석체크', date: '2024.01.18', points: '+50p' },
    { id: 4, title: '매일 매뉴 이용', date: '2024.01.17', points: '+150p' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {historyData.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.points}>{item.points}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  points: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PointHistoryScreen; 