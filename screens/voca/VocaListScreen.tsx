import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';

interface Vocabulary {
  id: number;
  name: string;
  wordCount: number;
}

const VocaListScreen = () => {
  const navigation = useNavigation();
  const [vocabularies] = useState<Vocabulary[]>([
    { id: 1, name: '기초 영어 단어', wordCount: 50 },
    { id: 2, name: '음식 관련 단어', wordCount: 30 },
    { id: 3, name: '여행 관련 단어', wordCount: 25 },
    { id: 4, name: '비즈니스 영어', wordCount: 40 }
  ]);

  const renderVocabulary = ({ item }: { item: Vocabulary }) => (
    <TouchableOpacity 
      style={styles.vocabCard}
      onPress={() => navigation.navigate('VocaContent', { vocaId: item.id, vocaName: item.name })}
    >
      <View style={styles.vocabHeader}>
        <Text style={styles.vocabName}>{item.name}</Text>
        <Text style={styles.wordCount}>{item.wordCount}개</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>단어장 목록</Text>
      </View>
      <FlatList
        data={vocabularies}
        renderItem={renderVocabulary}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    padding: 20,
    backgroundColor: colors.BLUE,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  listContainer: {
    padding: 20,
  },
  vocabCard: {
    backgroundColor: colors.WHITE,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY,
    marginBottom: 15,
  },
  vocabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vocabName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  wordCount: {
    fontSize: 14,
    color: colors.BLUE,
    fontWeight: '600',
  },
});

export default VocaListScreen; 