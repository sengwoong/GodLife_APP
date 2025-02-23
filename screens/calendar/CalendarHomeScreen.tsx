import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TextStyle, TextInput, TouchableOpacity } from 'react-native';
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
import { useSchedules } from '../../server/query/hooks/useSchedule';
import Calendar from '../../components/calendar/Calendar';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<calendarStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

interface DayProps {
  date: number;
  scheduleCount: number;
}

interface Schedule {
  content: string;
  id: number;
  time: string;
  title: string;
  day: string;
}

interface EditableSchedule extends Schedule {
  isNew?: boolean;
}

function CalendarHomeScreen() {
  const { year: initialYear, month: initialMonth, firstDOW: initialDay } = getMonthYearDetails();
  const navigation = useNavigation<Navigation>();

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);
  const [selectedDate, setSelectedDate] = useState(initialDay);
  const [editedSchedule, setEditedSchedule] = useState<EditableSchedule | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { data: scheduleData, isLoading } = useSchedules(1, year, month, day);



  const hideOption = () => {
    setIsVisible(false);
    setEditedSchedule(null);
  };

  const showOption = () => {
    setEditedSchedule({
      id: Date.now(),
      content: '',
      time: '',
      title: '',
      day: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      isNew: true
    });
    setIsVisible(true);
  };

  function handleSave() {
    if (editedSchedule) {


      setEditedSchedule(null);
      setIsVisible(false);
    }
  }

  const monthYear = useMemo(() => {
    const lastDate = new Date(year, month, 0).getDate();
    const firstDOW = new Date(year, month - 1, 1).getDay();
    const startDate = new Date(year, month - 1, 1); 
    return { year, month, lastDate, firstDOW, startDate };
  }, [year, month]);


  const onChangePressItem = (itemindex: number) => {
    navigation.navigate(CalendarNavigations.CALENDAREDIT, {calendaritemIndex: itemindex});
  };

  const moveToToday = () => {
    const { year, month, firstDOW } = getMonthYearDetails();
    setYear(year);
    setMonth(month);
    setSelectedDate(firstDOW);
  };

  const handleDateChange = (newYear: number, newMonth: number, newDate: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(newDate);
    setDay(newDate);
  };


  return (
    <SafeAreaView>
      {isLoading ? (
        <Text>로딩 중...</Text>
      ) : (
        <>
          <Calendar 
            year={year}
            month={month}
            day={selectedDate}
            schedules={scheduleData?.content || []}
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

          <EventList posts={scheduleData?.content || []} onChangePressItem={onChangePressItem} />
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
                  onValueChange={setYear}
                  selectedValue={year}
                />
                <ScrollWheelPicker
                  data={Array.from({ length: 12 }, (_, i) => i + 1)}
                  onValueChange={setMonth}
                  selectedValue={month}
                />
                <ScrollWheelPicker
                  data={Array.from({ length: 31 }, (_, i) => i + 1)}
                  onValueChange={setDay}
                  selectedValue={day}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="제목"
                value={editedSchedule?.title || ''}
                onChangeText={(text) => setEditedSchedule(prev => prev ? { ...prev, title: text } : null)}
              />
              <TextInput
                style={styles.input}
                placeholder="내용"
                value={editedSchedule?.content || ''}
                onChangeText={(text) => setEditedSchedule(prev => prev ? { ...prev, content: text } : null)}
              />

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
});


export default CalendarHomeScreen;