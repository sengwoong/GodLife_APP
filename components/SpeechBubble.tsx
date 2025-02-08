import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, getFontStyle } from '../constants';

interface SpeechBubbleProps {
  title: string | null;
  subtitle: string | null;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.speechBubble}>
        {/* title이 있을 경우에만 렌더링 */}
        {title && <Text style={styles.title}>{title}</Text>}
        
        {/* subtitle이 있을 경우에만 렌더링 */}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.triangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  speechBubble: {
    position: 'relative',
    padding: 10,
    borderColor: colors.BLACK,
    backgroundColor: colors.LIGHT_WHITE,
    borderWidth: 0.2,
    width: '80%',
  },
  title: {
    ...getFontStyle('titleBody', 'large', 'regular'),
    fontWeight: 'bold',
    color: colors.BLACK,  // title 텍스트 색상을 빨간색으로 변경
  } as TextStyle,
  subtitle: {
    ...getFontStyle('body', 'large', 'regular'),
    textAlign: 'center',
    color: colors.BLACK,  // subtitle 텍스트 색상을 회색으로 변경
  } as TextStyle,
  triangle: {

    marginLeft: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.LIGHT_WHITE,
    transform: [{ rotate: '180deg' }],
  },
});

export default SpeechBubble;
