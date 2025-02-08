// Pagination.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { colors } from '../constants';
import CustomButton from './CustomButton';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  textColor?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const goToNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <View style={styles.pagination}>
      <CustomButton size='text_size' color='BLACK' label="Prev" onPress={goToPrevPage} inValid={currentPage === 1} />
      <Text style={styles.pageInfo}>
        {currentPage} / {totalPages}
      </Text>
      <CustomButton size='text_size' color='BLACK' label="Next" onPress={goToNextPage} inValid={currentPage === totalPages} />
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  pageInfo: {
    fontSize: 18,
  },
  blackText: {
    color: colors.BLACK,
  },
  whiteText: {
    color: colors.WHITE,
  },
});

export default Pagination;
