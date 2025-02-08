import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const GoldenIcon = () => {
  return (
    <View style={styles.container}>
        <Image
        source={require('../../assets/images/GoldBricks.png')} 
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default GoldenIcon;
