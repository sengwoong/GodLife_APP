import React, {ForwardedRef, ReactNode, forwardRef, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  Text,
  Pressable,
  TextStyle,
} from 'react-native';

import { mergeRefs } from '../utils/common';
import { colors, getFontStyle, spacing } from '../constants/index';
import { INPUT_LAYOUT, INPUT_STRINGS } from '../constants/input';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  icon?: ReactNode;
  locale?: keyof typeof INPUT_STRINGS;
}

const InputField = forwardRef(
  (
    {
      disabled = false, 
      error, 
      touched, 
      icon = null, 
      locale = 'ko',
      ...props
    }: InputFieldProps,
    ref?: ForwardedRef<TextInput>,
  ) => {
    const styles = styling();
    const innerRef = useRef<TextInput | null>(null);
    const strings = INPUT_STRINGS[locale];

    const handlePressInput = () => {
      innerRef.current?.focus();
    };

    return (
      <Pressable onPress={handlePressInput}>
        <View
          style={[
            styles.container,
            disabled && styles.disabled,
            touched && Boolean(error) && styles.inputError,
          ]}>
          <View style={Boolean(icon) && styles.innerContainer}>
            {icon}
            <TextInput
              ref={ref ? mergeRefs(innerRef, ref) : innerRef}
              editable={!disabled}
              placeholderTextColor={colors.GRAY}
              style={[styles.input, disabled && styles.disabled]}
              autoCapitalize="none"
              spellCheck={false}
              autoCorrect={false}
              {...props}
            />
          </View>
          {touched && Boolean(error) && (
            <Text style={styles.error}>{error}</Text>
          )}
        </View>
      </Pressable>
    );
  },
);

const styling = () =>
  StyleSheet.create({
    container: {
      borderWidth: INPUT_LAYOUT.BORDER_WIDTH,
      borderColor: colors.GRAY,
      borderRadius: spacing.M4,
    },
    input: {
      ...getFontStyle('titleBody', 'small', 'medium'),
      paddingHorizontal: spacing.M12,
      paddingVertical: spacing.M8,
    } as TextStyle,
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.M8,
    },
    disabled: {
      backgroundColor: colors.GRAY,
      color: colors.GRAY,
    },
    inputError: {
      borderWidth: INPUT_LAYOUT.BORDER_WIDTH,
      borderColor: colors.RED,
    },
    error: {
      color: colors.RED,
      ...getFontStyle('body', 'small', 'medium'),
      padding: INPUT_LAYOUT.PADDING.ERROR,
    } as TextStyle,
  });

export default InputField;
