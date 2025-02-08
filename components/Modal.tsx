import {PropsWithChildren, ReactNode, createContext, useContext} from 'react';
import {
  GestureResponderEvent,
  Modal,
  ModalProps,
  Pressable,
  PressableProps,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors,colorHex, getFontStyle, spacing } from '../constants/index';  

interface OptionContextValue {
  onClickOutSide?: (event: GestureResponderEvent) => void;
}

const OptionContext = createContext<OptionContextValue | undefined>(undefined);

interface OptionMainProps extends ModalProps {
  children: ReactNode;
  isVisible: boolean;
  hideOption: () => void;
  animationType?: ModalProps['animationType'];
}

function OptionMain({
  children,
  isVisible,
  hideOption,
  animationType = 'none',
  ...props
}: OptionMainProps) {
  const onClickOutSide = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      hideOption();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType={animationType}
      onRequestClose={hideOption}
      {...props}>
      <OptionContext.Provider value={{onClickOutSide}}>
        {children}
      </OptionContext.Provider>
    </Modal>
  );
}

function Background({children}: PropsWithChildren) {
  const optionContext = useContext(OptionContext);

  const styles = styling();

  return (
    <SafeAreaView
      style={styles.optionBackground}
      onTouchEnd={optionContext?.onClickOutSide}>
      {children}
    </SafeAreaView>
  );
}

type ContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle; 
};


function Container({ children, style }: ContainerProps) {
  const styles = styling();
  return <View style={[styles.optionContainer, style]}>{children}</View>;
}

export default Container;
interface ButtonProps extends PressableProps {
  children: ReactNode;
  isDanger?: boolean;
  isChecked?: boolean;
  CheckMessage?: string;
}

function Button({
  children,
  isDanger = false,
  isChecked = false,
  CheckMessage = '선택',
  ...props
}: ButtonProps) {

  const styles = styling();

  return (
    <Pressable
      style={({pressed}) => [
        pressed && styles.optionButtonPressed,
        styles.optionButton,
      ]}
      {...props}>
      <Text style={[styles.optionText, isDanger && styles.dangerText]}>
        {children}
      </Text>
      {isChecked && (
      <Text>{CheckMessage}</Text>
      )}
    </Pressable>
  );
}

function Title({children}: PropsWithChildren) {

  const styles = styling();

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{children}</Text>
    </View>
  );
}

function Divider() {

  const styles = styling();

  return <View style={styles.border} />;
}
interface CheckBoxProps extends PressableProps {
    children: ReactNode;
    CheckIcon: ReactNode; 
    UnCheckIcon: ReactNode; 
    isChecked?: boolean; 
  }
  
  function CheckBox({
    children,
    CheckIcon,
    UnCheckIcon,
    isChecked = false,
    ...props
  }: CheckBoxProps) {
  
    const styles = styling();
  
    return (
      <Pressable
        style={({pressed}) => [
          pressed && styles.optionButtonPressed, 
          styles.checkBoxContainer,
        ]}
        {...props}>
        {isChecked ? CheckIcon : UnCheckIcon}
        <Text style={styles.checkBoxText}>{children}</Text>
      </Pressable>
    );
  }
  

interface FilterProps extends PressableProps {
  children: ReactNode;
  isSelected?: boolean;
}

function Filter({children, isSelected, ...props}: FilterProps) {

  const styles = styling();

  return (
    <Pressable style={styles.filterContainer} {...props}>
      <Text
        style={[isSelected ? styles.filterSelectedText : styles.filterText]}>
        {children}
      </Text>
    </Pressable>
  );
}

export const CompoundOption = Object.assign(OptionMain, {
  Container,
  Background,
  Button,
  Title,
  Divider,
  CheckBox,
  Filter,
});

const styling = () =>
  StyleSheet.create({
    optionBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0 0 0 / 0.5)',
    },
    optionContainer: {
      borderRadius: 15,
      marginHorizontal: 10,
      marginBottom: 10,
      backgroundColor: colors.GRAY,
      overflow: 'hidden',
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      height: 50,
      gap: 5,
    },
    optionButtonPressed: {
      backgroundColor: colorHex.LIGHT_GRAY,
    },
    optionText: {
      ... getFontStyle('titleBody', 'small', 'medium'),
      color: colors.BLACK,
    } as TextStyle,
    dangerText: {
      color: colors.RED,
    },
    titleContainer: {
      alignItems: 'center',
      padding: spacing.M16,
    },
    titleText: {
      ... getFontStyle('titleBody', 'large', 'bold'),
      color: colors.BLACK,
    } as TextStyle,
    border: {
      borderBottomColor: colors.BLACK,
      borderBottomWidth: 1,
    },
    checkBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.M12,
      paddingHorizontal: spacing.M32,
      gap: 10,
    },
    checkBoxText: {
      color: colors.BLACK,
      ... getFontStyle('titleBody', 'small', 'medium'),
    } as TextStyle,
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.M12,
      gap: 5,
    },
    filterText: {
      color: colors.BLACK,
      ... getFontStyle('titleBody', 'small', 'medium'),
    } as TextStyle,
    filterSelectedText: {
      color: colors.GREEN,
      ... getFontStyle('titleBody', 'small', 'medium'),
    } as TextStyle,
  });
