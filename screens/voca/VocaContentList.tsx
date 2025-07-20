import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';

interface Word {
  id: number;
  word: string;
  meaning: string;
  isMemorized: boolean;
}

interface Props {
  words: Word[];
  onPressWord: (wordId: number) => void;
}

const VocaContentList: React.FC<Props> = ({ words, onPressWord }) => {
  const renderItem = ({ item }: { item: Word }) => (
    <TouchableOpacity style={styles.wordCard} onPress={() => onPressWord(item.id)}>
      <View style={styles.wordHeader}>
        <Text style={styles.wordText}>{item.word}</Text>
        <View style={[
          styles.memorizedBadge,
          item.isMemorized && styles.memorizedBadgeActive
        ]}>
          <Text style={[
            styles.memorizedText,
            item.isMemorized && styles.memorizedTextActive
          ]}>
            {item.isMemorized ? '암기완료' : '미암기'}
          </Text>
        </View>
      </View>
      <Text style={styles.meaningText}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={words}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  wordCard: {
    backgroundColor: colors.WHITE,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY,
    marginBottom: 15,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  memorizedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: colors.GRAY,
  },
  memorizedBadgeActive: {
    backgroundColor: colors.BLUE,
  },
  memorizedText: {
    fontSize: 12,
    color: colors.BLACK,
  },
  memorizedTextActive: {
    color: colors.WHITE,
  },
  meaningText: {
    fontSize: 16,
    color: colors.BLACK,
    marginBottom: 8,
  },
});

export default VocaContentList; 