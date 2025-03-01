import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { colors, spacing } from '../../constants';


function CustomDrawerContent(props: DrawerContentComponentProps) {

  const handleLogout = () => {
  
  };

  return (
    <SafeAreaView style={styles.container}>
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
});

export default CustomDrawerContent;
