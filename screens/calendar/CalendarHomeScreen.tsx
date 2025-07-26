import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TextStyle, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../server/common/types/constants';
import { getMonthYearDetails } from '../../utils/date';
import EventList from '../../components/EventList';
import CustomButton from '../../components/CustomButton';
import { CalendarNavigations, colors, getFontStyle, spacing } from '../../constants/index';  
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { calendarStackParamList } from '../../navigations/stack/beforeLogin/CalendarStackNavigator';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/drawer/MainDrawerNavigator';
import { CompoundOption } from '../../components/Modal';
import ScrollWheelPicker from '../../components/ScrollWheelPicker';
import { useSchedules, useSchedulesByDay, useCreateSchedule } from '../../server/query/hooks/useSchedule';
import { Schedule } from '../../types';
import Calendar from '../../components/calendar/Calendar';
import { PullToRefresh } from '../../components/common/PullToRefresh';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<calendarStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

interface DayProps {
  date: number;
  scheduleCount: number;
}

interface EditableSchedule extends Schedule {
  isNew?: boolean;
}

function CalendarHomeScreen() {
  const { year: initialYear, month: initialMonth, firstDOW: initialDay } = getMonthYearDetails();
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);
  const [selectedDate, setSelectedDate] = useState(initialDay);
  const [editedSchedule, setEditedSchedule] = useState<EditableSchedule | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  const { data: monthScheduleData, isLoading: monthLoading } = useSchedules(1, year, month);
  const { data: dayScheduleData, isLoading: dayLoading } = useSchedulesByDay(1, year, month, selectedDate);
  const { mutate: createSchedule } = useCreateSchedule();

  const hideOption = () => {
    setIsVisible(false);
    setEditedSchedule(null);
  };

  const showOption = () => {
    const timeString = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    const selectedDayString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setEditedSchedule({
      id: Date.now(),
      userId: 1,
      content: '',
      time: timeString,
      title: '',
      day: selectedDayString,
      hasAlarm: false,
      isNew: true
    });
    setIsVisible(true);
  };

  function handleSave() {
    if (editedSchedule && editedSchedule.title && editedSchedule.title.trim()) {
      // 시간과 날짜 설정
      const timeString = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      const dayString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      createSchedule({
        userId: 1,
        scheduleData: {
          scheduleTitle: editedSchedule.title.trim(),
          content: editedSchedule.content || '',
          startTime: timeString,
          endTime: timeString,
          day: dayString,
          hasAlarm: alarmEnabled
        }
      });
      
      hideOption();
    } else {
      Alert.alert('오류', '제목을 입력해주세요.');
    }
  }

  const onChangePressItem = (itemindex: number) => {
    console.log('Selected item:', itemindex);
  };

  const moveToToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
    setSelectedDate(today.getDate());
    setDay(today.getDate());
  };

  const handleDateChange = (newYear: number, newMonth: number, newDate: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(newDate);
    setDay(newDate);
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 일정 관련 쿼리들을 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['schedules', 1, year, month] });
    queryClient.invalidateQueries({ queryKey: ['schedulesByDay', 1, year, month, selectedDate] });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <SafeAreaView>
        {monthLoading ? (
          <Text>로딩 중...</Text>
        ) : (
          <>
            <Calendar 
              year={year}
              month={month}
              day={selectedDate}
              schedules={monthScheduleData?.content || []}
              onDateChange={handleDateChange}
            />

            <View style={styles.rowContainer}>
              <Text style={styles.SelectDayText}>{selectedDate}일 할일</Text>
              <CustomButton 
                size='text_size' 
                label='생성하기' 
                color='BLACK' 
                shape='rounded' 
                style={{ flexWrap: 'nowrap' }} 
                onPress={showOption}
              />
            </View>

            <EventList posts={dayScheduleData?.content || []} onChangePressItem={onChangePressItem} />
          </>
        )}

        {isVisible && (
          <CompoundOption isVisible={isVisible} hideOption={hideOption}>
            <CompoundOption.Background>
              <CompoundOption.Container style={styles.editContainer}>
                <Text style={styles.header}>새 일정 생성</Text>
                <View style={styles.pickerContainer}>
                  <ScrollWheelPicker
                    data={Array.from({ length: 14 }, (_, i) => 2020 + i)}
                    onValueChange={(newYear) => {
                      setYear(newYear);
                      if (editedSchedule) {
                        const newDayString = `${newYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setEditedSchedule(prev => prev ? { ...prev, day: newDayString } : null);
                      }
                    }}
                    selectedValue={year}
                  />
                  <ScrollWheelPicker
                    data={Array.from({ length: 12 }, (_, i) => i + 1)}
                    onValueChange={(newMonth) => {
                      setMonth(newMonth);
                      if (editedSchedule) {
                        const newDayString = `${year}-${String(newMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setEditedSchedule(prev => prev ? { ...prev, day: newDayString } : null);
                      }
                    }}
                    selectedValue={month}
                  />
                  <ScrollWheelPicker
                    data={Array.from({ length: 31 }, (_, i) => i + 1)}
                    onValueChange={(newDay) => {
                      setDay(newDay);
                      if (editedSchedule) {
                        const newDayString = `${year}-${String(month).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
                        setEditedSchedule(prev => prev ? { ...prev, day: newDayString } : null);
                      }
                    }}
                    selectedValue={day}
                  />
                </View>
                
                <Text style={styles.timeLabel}>시간</Text>
                <View style={styles.timePickerContainer}>
                  <ScrollWheelPicker
                    data={Array.from({ length: 24 }, (_, i) => i)}
                    onValueChange={(hour) => {
                      setSelectedHour(hour);
                      const timeString = `${String(hour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
                      setEditedSchedule(prev => prev ? { ...prev, time: timeString } : null);
                    }}
                    selectedValue={selectedHour}
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <ScrollWheelPicker
                    data={Array.from({ length: 6 }, (_, i) => i * 10)}
                    onValueChange={(minute) => {
                      setSelectedMinute(minute);
                      const timeString = `${String(selectedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                      setEditedSchedule(prev => prev ? { ...prev, time: timeString } : null);
                    }}
                    selectedValue={selectedMinute}
                  />
                </View>
                
                <TextInput
                  style={styles.input}
                  placeholder="제목"
                  value={editedSchedule?.title || ''}
                  onChangeText={(text) => setEditedSchedule(prev => prev ? { ...prev, title: text || '' } : null)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="내용"
                  value={editedSchedule?.content || ''}
                  onChangeText={(text) => setEditedSchedule(prev => prev ? { ...prev, content: text || '' } : null)}
                />

                {/* 알람 설정 */}
                <View style={styles.alarmContainer}>
                  <TouchableOpacity 
                    style={styles.alarmToggle}
                    onPress={() => setAlarmEnabled(!alarmEnabled)}
                  >
                    <Text style={styles.alarmLabel}>알람 설정</Text>
                    <Text style={styles.alarmToggleText}>{alarmEnabled ? 'ON' : 'OFF'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                  <CompoundOption.Button onPress={handleSave}>
                    저장
                  </CompoundOption.Button>
                  <CompoundOption.Button onPress={hideOption} isDanger>
                    취소
                  </CompoundOption.Button>
                </View>
              </CompoundOption.Container>
            </CompoundOption.Background>
          </CompoundOption>
        )}
      </SafeAreaView>
    </PullToRefresh>
  );
}

const styles = StyleSheet.create({
  SelectDayText: {
    ... getFontStyle('display', 'small', 'bold'),
    color: colors.BLACK,
    margin: 10,
  } as TextStyle,
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.M12,
  },
  editContainer: {
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    marginTop: spacing.M12,
    justifyContent: 'space-between',
  },
  editHeader: {
    ...getFontStyle('titleBody', 'large', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M12,
  }as TextStyle ,
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.M12,
    paddingHorizontal: spacing.M16,
  },
  timeLabel: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M12,
    marginTop: spacing.M16,
  } as TextStyle,
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.M20,
    paddingHorizontal: spacing.M16,
    paddingVertical: spacing.M8,
  },
  timeSeparator: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
    marginHorizontal: spacing.M12,
  } as TextStyle,
  header: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M12,
  } as TextStyle ,

  input: {
    ...getFontStyle('body', 'medium', 'medium'),
    height: 40,
    borderColor: colors.BLACK,
    borderWidth: 0.5,
    borderRadius: 4,
    marginBottom: spacing.M4,
    paddingHorizontal: spacing.M8,
  } as TextStyle  ,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.M16,
  },
  modal: {
    ...getFontStyle('body', 'medium', 'medium'),
    borderColor: colors.BLACK,
    borderWidth: 1,
    margin: spacing.M12,
    padding: spacing.M8,
  },
  gutter:{
    padding: spacing.M12,
  },
  calendar: {
    marginBottom: spacing.M16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.M16,
  },
  headerButton: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  headerTitle: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.M8,
  },
  weekDayText: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.BLACK,
    width: 40,
    textAlign: 'center',
  } as TextStyle,
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    height: "50%",
    margin: spacing.M4,
  },
  selectedDayCell: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  dayText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
    width: "100%",
    textAlign: 'center',
  } as TextStyle,
  scheduleIndicatorContainer:{
    width: "100%",
    height: "100%",
    display: 'flex',
    marginTop: 4,
    alignItems: 'center',
  },
  scheduleIndicator: {
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleCount: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  } as TextStyle,
  day: {
    width: "100%",
    height: "100%",
  } as TextStyle,
  calendarContainer: {
    marginBottom: spacing.M16,
  },
  alarmContainer: {
    marginTop: spacing.M16,
    marginBottom: spacing.M12,
  },
  alarmToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.M8,
    paddingHorizontal: spacing.M12,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 8,
  },
  alarmLabel: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  alarmToggleText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.GREEN,
  } as TextStyle,

});


export default CalendarHomeScreen;