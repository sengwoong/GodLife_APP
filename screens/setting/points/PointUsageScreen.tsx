import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function PointUsageScreen() {
  const usageData = [
    { id: 1, title: '단어 구매', date: '2024.01.20', points: '-150p' },
    { id: 2, title: '플레이리스트 구매', date: '2024.01.19', points: '-100p' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {usageData.map((item) => (
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
    color: '#f00',
  },
});

export default PointUsageScreen; 