import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TextStyle } from 'react-native';
import ScrollWheelPicker from '../../components/ScrollWheelPicker';
import { colors, getFontStyle, spacing } from '../../constants';
import { CompoundOption } from '../../components/Modal';
import CustomButton from '../../components/CustomButton';

export default function CalendarEditScreen() {
  interface Schedule {
    content: string;
    id: number;
    time: string;
    title: string;
    day: string;
  }

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      content: '프로젝트 마감',
      id: 1,
      time: '5:00 PM',
      title: '업무 일정',
      day: '2024-2-3',
    },
    {
      content: '친구 생일',
      id: 2,
      time: 'All Day',
      title: '생일 파티',
      day: '2024-5-20',
    },
    {
      content: '미팅qw[opfk',
      id: 3,
      time: '10:00 AM',
      title: '업무 미팅',
      day: '2024-12-30',
    },
  ]);

  const [editedSchedule, setEditedSchedule] = useState<Schedule | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(12);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const [isVisible, setIsVisible] = useState(false);

  const hideOption = () => {
    setIsVisible(false);  // 모달 숨기기
  };

  const showOption = () => {
    setIsVisible(true);  // 모달 보이기
  };

  const handleEdit = (schedule: Schedule) => {
    setEditedSchedule(schedule);
    const [year, month, day] = schedule.day.split('-').map(Number);
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
    showOption()
  };
  console.log(selectedDay)

  function handleSave() {
    if (editedSchedule) {
      const updatedDay = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === editedSchedule.id
            ? { ...editedSchedule, day: updatedDay }
            : schedule
        )
      );
      setEditedSchedule(null);
    }
  }

  return (
    <View style={styles.calendar}>
      <Text style={styles.calendar__header}>일정 수정</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.schedule}>
            <View style={styles.schedule__content}>
              <Text style={styles.schedule__time}>{item.day} | {item.time}</Text>
              <Text style={styles.schedule__title}>{item.title}</Text>
              <Text style={styles.schedule__description} numberOfLines={3}>{item.content}</Text>
            </View>
            <CustomButton size="text_size" label="수정" color={"BLACK"} onPress={() => handleEdit(item)} />
          </View>
        )}
      />
      
      {editedSchedule && (
        <CompoundOption isVisible={isVisible} hideOption={hideOption}>
          <CompoundOption.Background>
            <CompoundOption.Container style={{ padding: 20 }}>
              <Text style={styles.modal__header}>선택된 일정 수정</Text>
              <View style={styles.modal__datepicker}>
                <ScrollWheelPicker
                  data={Array.from({ length: 14 }, (_, i) => 2020 + i)}
                  onValueChange={setSelectedYear}
                  selectedValue={selectedYear}
                />
                <ScrollWheelPicker
                  data={Array.from({ length: 12 }, (_, i) => i + 1)}
                  onValueChange={setSelectedMonth}
                  selectedValue={selectedMonth}
                />
                <ScrollWheelPicker
                  data={Array.from({ length:30 }, (_, i) => i + 1)}
                  onValueChange={setSelectedDay}
                  selectedValue={selectedDay}
                />
              </View>
              <View style={styles.modal__spacer}></View>
              <TextInput
                style={styles.modal__input}
                placeholder="제목"
                value={editedSchedule.title}
                onChangeText={(text) => setEditedSchedule((prev) => (prev ? { ...prev, title: text } : null))}
              />
              <TextInput
                style={styles.modal__input}
                placeholder="내용"
                value={editedSchedule.content}
                onChangeText={(text) => setEditedSchedule((prev) => (prev ? { ...prev, content: text } : null))}
              />
              <View style={styles.modal__buttons}>
                <CompoundOption.Button onPress={handleSave}  >
                  저장
                </CompoundOption.Button>
                <CompoundOption.Button onPress={() => setEditedSchedule(null)} isDanger>
                  취소
                </CompoundOption.Button>
              </View>
            </CompoundOption.Container>
          </CompoundOption.Background>
        </CompoundOption>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
    padding: spacing.M16,
  },
  calendar__header: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M20,
  } as TextStyle,
  schedule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    marginBottom: spacing.M8,
    borderColor: colors.GRAY,
    borderWidth: 1,
  },
  schedule__content: {
    width: "80%",
  },
  schedule__time: {
    ...getFontStyle('body', 'small', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  schedule__title: {
    ...getFontStyle('titleBody', 'large', 'medium'),
    color: colors.BLACK,
  } as TextStyle,
  schedule__description: {
    ...getFontStyle('body', 'large', 'medium'),
    color: colors.BLACK,
  } as TextStyle,
  modal: {
    flex: 1,
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    marginTop: spacing.M20,
    justifyContent: 'space-between',
  },
  modal__header: {
    ...getFontStyle('titleBody', 'large', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M12,
  } as TextStyle,
  modal__datepicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.M12,
  },
  modal__input: {
    ...getFontStyle('body', 'medium', 'medium'),
    height: 40,
    borderColor: colors.BLACK,
    borderWidth: 0.5,
    borderRadius: 4,
    marginBottom: spacing.M12,
    paddingHorizontal: spacing.M8,
  } as TextStyle,
  modal__buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.M16,
  },
  modal__spacer: {
    padding: spacing.M12,
  }
});
