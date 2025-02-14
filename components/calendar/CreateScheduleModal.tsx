import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { CompoundOption } from '../Modal';
import ScrollWheelPicker from '../ScrollWheelPicker';
import { colors, getFontStyle, spacing } from '../../constants';

interface CreateScheduleModalProps {
  isVisible: boolean;
  hideOption: () => void;
  selectedDate: {
    year: number;
    month: number;
    day: number;
  };
  onSave: (schedule: any) => void;
}

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isVisible,
  hideOption,
  selectedDate,
  onSave
}) => {
  return (
    <CompoundOption isVisible={isVisible} hideOption={hideOption}>
      <CompoundOption.Background>
        <CompoundOption.Container style={styles.editContainer}>
          <Text style={styles.header}>새 일정 생성</Text>
          <View style={styles.pickerContainer}>
            <ScrollWheelPicker
              data={Array.from({ length: 14 }, (_, i) => 2020 + i)}
              onValueChange={() => {}}
              selectedValue={selectedDate.year}
            />
            <ScrollWheelPicker
              data={Array.from({ length: 12 }, (_, i) => i + 1)}
              onValueChange={() => {}}
              selectedValue={selectedDate.month}
            />
            <ScrollWheelPicker
              data={Array.from({ length: 31 }, (_, i) => i + 1)}
              onValueChange={() => {}}
              selectedValue={selectedDate.day}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="제목"
          />
          <TextInput
            style={styles.input}
            placeholder="내용"
          />
          <View style={styles.buttonContainer}>
            <CompoundOption.Button onPress={onSave}>
              저장
            </CompoundOption.Button>
            <CompoundOption.Button onPress={hideOption} isDanger>
              취소
            </CompoundOption.Button>
          </View>
        </CompoundOption.Container>
      </CompoundOption.Background>
    </CompoundOption>
  );
};

const styles = StyleSheet.create({
  // ... 기존 스타일 유지
}); 