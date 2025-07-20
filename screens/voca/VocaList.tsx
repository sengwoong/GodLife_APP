import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';

interface Vocabulary {
  id: number;
  name: string;
  wordCount: number;
}

interface Props {
  vocabularies: Vocabulary[];
  onPressVoca: (vocaId: number) => void;
}

const VocaList: React.FC<Props> = ({ vocabularies, onPressVoca }) => {
  const renderItem = ({ item }: { item: Vocabulary }) => (
    <TouchableOpacity style={styles.vocabCard} onPress={() => onPressVoca(item.id)}>
      <View style={styles.vocabHeader}>
        <Text style={styles.vocabName}>{item.name}</Text>
        <Text style={styles.wordCount}>{item.wordCount}개</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={vocabularies}
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

export default VocaList; 