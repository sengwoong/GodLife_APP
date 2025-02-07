import React, { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';

import { colors,getFontStyle } from '../constants/index';  

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'GREEN' | 'RED' | 'BLUE' | 'BLACK' | 'WHITE';
  size?: 'large' | 'medium' | 'text_size';
  shape?: 'rounded' | 'square';
  inValid?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
}

const deviceHeight = Dimensions.get('screen').height;

/**
 * 사용자 정의 버튼 컴포넌트.
 *
 * @param {string} label - 버튼 내부에 표시될 텍스트.
 * @param {'filled' | 'outlined'} [variant='filled'] - 버튼의 스타일 유형.
 * @param {'GREEN' | 'RED' | 'BLUE' | 'BLACK' | 'WHITE'} [color='GREEN'] - 버튼의 색상.
 * @param {'large' | 'medium'| 'text_size'} [size='large'] - 버튼 크기.
 * @param {'rounded' | 'square'} [shape='square'] - 버튼의 모양 (둥근 모서리 또는 사각형).
 * @param {boolean} [inValid=false] - 버튼 비활성화 여부. true일 경우 비활성화.
 * @param {StyleProp<ViewStyle>} [style] - 외부에서 전달받는 추가 스타일.
 * @param {StyleProp<TextStyle>} [textStyle] - 버튼 텍스트에 적용할 추가 스타일.
 * @param {ReactNode} [icon] - 버튼에 표시할 아이콘.
 * @param {PressableProps} props - 추가로 전달받는 Pressable 컴포넌트의 모든 속성.
 *
 * @returns {JSX.Element} - 커스텀 버튼 컴포넌트.
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  variant = 'filled',
  color = 'GREEN',
  size = 'large',
  shape = 'square',
  inValid = false,
  style = undefined,
  textStyle = null,
  icon = null,
  ...props
}) => {

  return (
    <Pressable
      disabled={inValid}
      style={({ pressed }) => [
        styles.container,
        styles[shape],
        inValid && styles.inValid,
        pressed ? [styles[`${variant}Pressed`], styles[`${variant}${color}`]] : styles[`${variant}${color}`],
        style, 
      ]}
      {...props}
    >
      <View style={styles[size]}>
        {icon}
        <Text style={[styles.text, color === 'BLACK' ? styles.text_color_WHITE : styles.text_color_BLACK, textStyle]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    transition: 'opacity 10s ease',
  } as ViewStyle,
  inValid: {
    opacity: 0.5,
  } as ViewStyle,

  rounded: {
    borderRadius: 25,
  } as ViewStyle,
  square: {
    borderRadius: 0,
  } as ViewStyle,

  filledGREEN: {
    backgroundColor: colors.GREEN,
  } as ViewStyle,
  filledRED: {
    backgroundColor: colors.RED,
  } as ViewStyle,
  filledBLUE: {
    backgroundColor: colors.BLUE,
  } as ViewStyle,
  filledBLACK: {
    backgroundColor: colors.BLACK,
  } as ViewStyle,
  filledWHITE: {
    backgroundColor: colors.WHITE,
  } as ViewStyle,

  outlinedGREEN: {
    backgroundColor: colors.WHITE,
    borderColor:colors.GREEN,
    borderWidth: 2,
  } as ViewStyle,
  outlinedRED: {
    backgroundColor: colors.WHITE,
    borderColor:colors.RED,
    borderWidth: 2,
  } as ViewStyle,
  outlinedBLUE: {
    backgroundColor: colors.WHITE,
    borderColor:colors.BLUE,
    borderWidth: 2,
  } as ViewStyle,
  outlinedBLACK: {
    backgroundColor: colors.WHITE,
    borderColor:colors.BLACK,
    borderWidth: 2,
  } as ViewStyle,
  outlinedWHITE: {
    backgroundColor: colors.BLACK,
    borderColor:colors.WHITE,
    borderWidth: 2,
  } as ViewStyle,

  filledPressed: {
    opacity: 0.8,
    backgroundColor: colors.BLACK,
  } as ViewStyle,
  outlinedPressed: {
    opacity: 0.8,

   } as ViewStyle,

  large: {
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  } as ViewStyle,
  medium: {
    width: '50%',
    paddingVertical: deviceHeight > 700 ? 12 : 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  } as ViewStyle,
  text_size: {
    width: 'auto', 
    padding:10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as TextStyle,

  text: {
   ... getFontStyle('body','medium','bold'), 
   color: "blue",

  } as TextStyle,
  text_color_WHITE:{
    color: colors.WHITE
  },
  text_color_BLACK:{
    color: colors.BLACK
  }
});

export default CustomButton;
