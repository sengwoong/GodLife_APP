import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  TextStyle,
} from 'react-native';

import { colors, getFontStyle, spacing } from '../constants';

interface SelectButtonProps {
  options: string[]; // 옵션 목록
  selectedOption?: string; // 선택된 값
  onSelect: (option: string) => void; // 선택 이벤트 콜백
  disabled?: boolean; // 비활성화 여부
}

const deviceHeight = Dimensions.get('screen').height;

const SelectButton: React.FC<SelectButtonProps> = ({
  options,
  selectedOption,
  onSelect,
  disabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = styling();

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsModalVisible(false);
  };

  return (
    <View>
      <Pressable
        style={[styles.button, disabled && styles.disabled]}
        onPress={() => !disabled && setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedOption || '선택하세요'}
        </Text>
      </Pressable>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styling = () =>
  StyleSheet.create({
    button: {
      borderWidth: 1,
      borderColor: colors.GRAY,
      padding: deviceHeight > 700 ? spacing.M12 : spacing.M8,
      backgroundColor: colors.WHITE,
    },
    buttonText: {
      ...getFontStyle('titleBody', 'small', 'medium'),
      color: colors.BLACK,
    } as TextStyle,
    disabled: {
      backgroundColor: colors.GRAY,
      color: colors.GRAY,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: colors.WHITE,
      borderRadius: 5,
      padding: 30,
    },
    option: {
      paddingVertical: 20,
    },
    optionText: {
      ...getFontStyle('body', 'large', 'medium'),
      color: colors.BLACK,
    } as TextStyle,
  });

export default SelectButton;
