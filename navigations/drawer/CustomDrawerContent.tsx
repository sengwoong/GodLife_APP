import React, { useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { colors, spacing } from '../../constants';


function CustomDrawerContent(props: DrawerContentComponentProps) {
  const [mode, setMode] = useState('Play Mode');
  const [bgColor] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(bgColor, {
      toValue: mode === 'Play Mode' ? 0 : mode === 'Setting Mode' ? 1 : 2,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['black', 'green', 'white'],
  });

  const handleModeSwitch = () => {
    setMode((prevMode) => {
      switch (prevMode) {
        case 'Play Mode':
          return 'Setting Mode';
        case 'Setting Mode':
          return 'Lecture Mode';
        case 'Lecture Mode':
          return 'Play Mode';
        default:
          return 'Play Mode';
      }
    });
  };

  const handleLogout = () => {
  
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.modeButton, { backgroundColor }]}>
        <Pressable onPress={handleModeSwitch}>
          <Text style={[styles.modeButtonText, { color: mode === 'Play Mode' ? 'white' : 'black' }]}>{mode}</Text>
        </Pressable>
      </Animated.View>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <Pressable style={styles.userImageContainer}>
        
          </Pressable>

          <Text style={styles.nameText}>GodLife</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Pressable
        onPress={handleLogout}
        style={{
          alignItems: 'flex-end',
          padding: spacing.M12,
        }}>
        <Text>로그아웃</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: colors.WHITE,
  },
  nameText: {
    color: colors.BLACK,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: spacing.M16,
    marginBottom: spacing.M32,
    marginHorizontal: spacing.M16,
  },
  userImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: spacing.M12,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  modeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modeButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
