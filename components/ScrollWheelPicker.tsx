import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants';

interface ScrollWheelPickerProps {
  data: number[];
  onValueChange: (value: number) => void | null;
  selectedValue: number;
}

const ITEM_HEIGHT = 40;

const ScrollWheelPicker: React.FC<ScrollWheelPickerProps> = ({
  data,
  onValueChange,
  selectedValue,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(data.indexOf(selectedValue));
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const index = data.indexOf(selectedValue);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        animated: true,
        offset: index * ITEM_HEIGHT,
      });
      setCurrentIndex(index);
    }
  }, [selectedValue, data]);

  const getItemLayout = (_, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const handleScrollEndDrag = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setCurrentIndex(index);
    onValueChange?.(data[index]);
  };

  const formatNumber = (number: number) => number.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.toString()}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        bounces={false}
        extraData={currentIndex}
        onMomentumScrollEnd={handleScrollEndDrag}
        getItemLayout={getItemLayout}
        initialScrollIndex={currentIndex}
        initialNumToRender={data.length}
        maxToRenderPerBatch={data.length}
        windowSize={data.length}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              item === selectedValue ? styles.selectedItem : undefined,
            ]}
            onPress={() => {
              const index = data.indexOf(item);
              setCurrentIndex(index); 
              flatListRef.current?.scrollToOffset({
                animated: true,
                offset: index * ITEM_HEIGHT, 
              });
              onValueChange?.(item); 
            }}
          >
            <Text
              style={[
                styles.itemText,
                item === selectedValue && styles.selectedText,
              ]}
            >
              {formatNumber(item)}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.centerLine} />
    </View>
  );
};

export default React.memo(ScrollWheelPicker);

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * 4,
    overflow: 'hidden',
    flexGrow: 1,
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: ITEM_HEIGHT * 1.5,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 18,
    color: 'gray',
  },
  selectedText: {
    color: colors.GREEN,
    fontWeight: 'bold',
  },
  centerLine: {
    position: 'absolute',
    top: ITEM_HEIGHT * 1.5,
    width: '100%',
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor:colors.GREEN,
    pointerEvents: 'none',
  },
});
