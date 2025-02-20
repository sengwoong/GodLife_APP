import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, getFontStyle } from '../constants';


interface PostMenuProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color: 'BLACK' | 'WHITE';
  onPress?: () => void;
} 

const PostMenu: React.FC<PostMenuProps> = ({
  label,
  style = undefined,
  textStyle = null,
  color,
}) => {
  const backgroundColorStyle = color === 'BLACK' ? styles.BLACK : styles.WHITE;
  const textColorStyle = color === 'BLACK' ? styles.text_color_WHITE : styles.text_color_BLACK;

  return (
    <View
      style={[
        styles.container,
        backgroundColorStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          textColorStyle,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width:"90%",
  } as ViewStyle,

  BLACK: {
    backgroundColor: colors.BLACK,
  } as ViewStyle,

  WHITE: {
    backgroundColor: colors.WHITE,
  } as ViewStyle,

  text: {
    ...getFontStyle('body', 'medium', 'medium'),
  } as TextStyle,
  text_color_WHITE: {
    color: colors.WHITE,
  } as TextStyle,
  text_color_BLACK: {
    color: colors.BLACK,
  } as TextStyle,
});

export default PostMenu;
