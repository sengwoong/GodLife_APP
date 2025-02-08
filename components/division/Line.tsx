import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants';
const Line = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 0.5,
    backgroundColor: colors.GRAY,
    width: '100%'
  },
});

export default Line;
