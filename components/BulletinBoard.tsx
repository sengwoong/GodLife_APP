import React from 'react';
import { FlatList, View, Text, StyleSheet, TextStyle } from 'react-native';
import { getFontStyle, spacing } from '../constants';


type Schedule = {
  id: number;
  title: string;
  content: string;
};

type BulletinBoardProps = {
  data: Schedule[];
  onItemPress: (id: number) => void  | undefined;
};

const BulletinBoard: React.FC<BulletinBoardProps> = ({ data, onItemPress }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <View style={styles.row} onTouchEnd={() => onItemPress(item.id)}>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleText}>
                {item.title}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>
                {item.content}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  titleContainer: {
    width: '30%',
    backgroundColor: '#d3d3d3',
    padding: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    width: '70%',
    backgroundColor: '#ffffff',
    padding: 12,
  },
  titleText: {
    ...getFontStyle('titleBody', 'small', 'bold'),
    color: '#000',
  } as TextStyle,
  contentText: {
    ...getFontStyle('titleBody', 'small', 'medium'),
    color: '#333',
  } as TextStyle,
});

export default BulletinBoard;
