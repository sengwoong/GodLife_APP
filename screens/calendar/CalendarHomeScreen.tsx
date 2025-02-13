import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TextStyle, TextInput, TouchableOpacity } from 'react-native';
import { getMonthYearDetails } from '../../types/date';
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
import Calendar from './calendar/CalendarHomeScreen';


type Navigation = CompositeNavigationProp<
  StackNavigationProp<calendarStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

interface DayProps {
  date: number;
  scheduleCount: number;
}

function CalendarHomeScreen() {
  const { year: initialYear, month: initialMonth, firstDOW: initialDay } = getMonthYearDetails();
  const navigation = useNavigation<Navigation>();

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);

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
      day: '2025-02-03',
    },
    {
      content: '친구 생일',
      id: 2,
      time: 'All Day',
      title: '생일 파티',
      day: '2025-05-20',
    },
    {
      content: '미팅qw[opfk',
      id: 3,
      time: '10:00 AM',
      title: '업무 미팅',
      day: '2025-12-30',
    },
  ]);


    
  const [editedSchedule, setEditedSchedule] = useState<Schedule | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(12);
  const [selectedDay, setSelectedDay] = useState<number>(1);


  const [isVisible, setIsVisible] = useState(false);

  const hideOption = () => {
    setIsVisible(false);  // 모달 숨기기
    
  console.log(selectedDay)
  };

  const showOption = () => {
    setIsVisible(true);  // 모달 보이기
    
  console.log(selectedDay)
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


  const monthYear = useMemo(() => {
    // 유틸로빼빼
    const lastDate = new Date(year, month, 0).getDate();
    const firstDOW = new Date(year, month - 1, 1).getDay();
    const startDate = new Date(year, month - 1, 1); 
    return { year, month, lastDate, firstDOW, startDate };
  }, [year, month]);

  const onChangeMonth = (increment: number) => {
    let newMonth = month + increment;
    let newYear = year;

    // 유틸로빼빼
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  const onChangeYear = (selectYear: number) => {
    setYear(selectYear)
  };

  const onChangePressItem = (itemindex: number) => {
    navigation.navigate(CalendarNavigations.CALENDAREDIT, {calendaritemIndex: itemindex});
  };

  

  const moveToToday = () => {
    const { year, month, firstDOW } = getMonthYearDetails();
    setYear(year);
    setMonth(month);
    setDay(firstDOW);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar 
        year={year}
        month={month}
        schedules={schedules}
        onChangeMonth={onChangeMonth}
        setDay={setDay}
      />

      <View style={styles.rowContainer}>
        <Text style={styles.SelectDayText}>{day}일 할일</Text>
        <CustomButton 
          size='text_size' 
          label='생성하기' 
          color='BLACK' 
          shape='rounded' 
          style={{ flexWrap: 'nowrap'  }} 
          onPress={showOption}
        />
      </View>

      <EventList posts={schedules} onChangePressItem={onChangePressItem} />



      {isVisible && (
        <CompoundOption isVisible={isVisible} hideOption={hideOption}>
          <CompoundOption.Background>
            <CompoundOption.Container style={styles.editContainer}>
              <Text style={styles.header}>새 일정 생성</Text>
              <View style={styles.pickerContainer}>
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
              <TextInput
                style={styles.input}
                placeholder="제목"
                value={''}
                onChangeText={(text) => setEditedSchedule((prev) => (prev ? { ...prev, title: text } : null))}
              />
              <TextInput
                style={styles.input}
                placeholder="내용"
                value={''}
                onChangeText={(text) => setEditedSchedule((prev) => (prev ? { ...prev, content: text } : null))}
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
  container: {
    flex: 1,
  },
  SelectDayText: {
    ... getFontStyle('display', 'small', 'bold'),
    color: colors.BLACK,
    margin: 10,
  } as TextStyle,
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  editContainer: {
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    marginTop: spacing.M20,
    justifyContent: 'space-between',
  },
  editHeader: {
    ...getFontStyle('titleBody', 'large', 'bold'), // 편집 화면 제목 스타일
    color: colors.BLACK,
    marginBottom: spacing.M12,
  }as TextStyle ,
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.M12,
  },
  header: {
    ...getFontStyle('title', 'large', 'bold'), // 제목 스타일
    color: colors.BLACK,
    marginBottom: spacing.M20,
  } as TextStyle ,

  input: {
    ...getFontStyle('body', 'medium', 'medium'), // 입력 필드 텍스트 스타일
    height: 40,
    borderColor: colors.BLACK,
    borderWidth: 0.5,
    borderRadius: 4,
    marginBottom: spacing.M12,
    paddingHorizontal: spacing.M8,
  } as TextStyle  ,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.M16,
  },
  modal: {
    ...getFontStyle('body', 'medium', 'medium'), // 모달 텍스트 스타일
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
});


export default CalendarHomeScreen;
