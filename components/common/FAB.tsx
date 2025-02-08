import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants';

interface FABProps {
  onPress: () => void;
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.fab}
      onPress={onPress}>
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.M24,
    right: spacing.M24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    color: colors.WHITE,
    marginTop: -2,
    ...getFontStyle('display', 'medium', 'regular'),
    bottom:5,
  }as TextStyle,
});

export default FAB; 