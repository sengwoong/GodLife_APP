import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  onSearch: (query: string) => void;
}

const VocaContentSearch: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="단어를 검색하세요"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>검색</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.BLUE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VocaContentSearch; 