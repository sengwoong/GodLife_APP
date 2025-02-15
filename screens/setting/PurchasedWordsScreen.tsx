import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function PurchasedWordsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>구매한 단어</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PurchasedWordsScreen; 