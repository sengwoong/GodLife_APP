import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../constants/index';
import { CompoundOption } from '../../components/Modal';
import ScrollWheelPicker from '../../components/ScrollWheelPicker';

interface CalendarProps {
  year: number;
  month: number;
  day?: number;
  schedules: Array<{
    day: string;
    [key: string]: any;
  }>;
  onDateChange: (year: number, month: number, date: number) => void;
}

interface DayProps {
  date: number;
  scheduleCount: number;
}

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  day,
  schedules,
  onDateChange,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);

  const onChangeMonthYear = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    // onDateChange(year, month, 1);
  };

  const onChangeMonth = (increment: number) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    onChangeMonthYear(newYear, newMonth);
  };

  const handleDateSelect = () => {
    onDateChange(selectedYear, selectedMonth, 1);
    setDatePickerVisible(false);
  };

  const getDayColor = (scheduleCount: number) => {
    if (scheduleCount === 0) return colors.WHITE;
    if (scheduleCount === 1) return colors.GREEN;
    if (scheduleCount === 2) return colors.YELLOW;
    return colors.RED;
  };

  const renderCalendarDay = ({ date, scheduleCount }: DayProps) => {
    const backgroundColor = getDayColor(scheduleCount);
    const isSelected = day === date && 
                      year === selectedYear && 
                      month === selectedMonth;
    
    return (
      <TouchableOpacity 
        style={[
          styles.day,
          isSelected && { backgroundColor: colors.LIGHT_GRAY }
        ]}
        onPress={() => {
          onDateChange(selectedYear, selectedMonth, date);
        }}
      >
        <Text style={styles.dayText}>{date > 0 ? date : ''}</Text>
        {scheduleCount > 0 && (
          <View style={styles.scheduleIndicatorContainer}>
            <View style={[styles.scheduleIndicator, { backgroundColor }]}>
              <Text style={styles.scheduleCount}>
                {scheduleCount > 9 ? '9+' : scheduleCount}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const days = [];
    const lastDate = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDOW = new Date(selectedYear, selectedMonth - 1, 1).getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDOW; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Add cells for each day of the month
    for (let date = 1; date <= lastDate; date++) {
      const dateString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const scheduleCount = schedules.filter(s => s.day === dateString).length;

      days.push(
        <View key={date} style={styles.dayCell}>
          {renderCalendarDay({ date, scheduleCount })}
        </View>
      );
    }

    return days;
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => onChangeMonth(-1)}>
          <Text style={styles.headerButton}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
          <Text style={styles.headerTitle}>{`${selectedYear}년 ${selectedMonth}월`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChangeMonth(1)}>
          <Text style={styles.headerButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <View>
        <View style={styles.weekDays}>
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {renderCalendar()}
        </View>
      </View>

      {isDatePickerVisible && (
        <CompoundOption 
          isVisible={isDatePickerVisible} 
          hideOption={() => setDatePickerVisible(false)}
        >
          <CompoundOption.Background>
            <CompoundOption.Container style={styles.datePickerContainer}>
              <Text style={styles.datePickerTitle}>날짜 선택</Text>
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
              </View>
              <View style={styles.buttonContainer}>
                <CompoundOption.Button onPress={handleDateSelect}>
                  선택
                </CompoundOption.Button>
                <CompoundOption.Button 
                  onPress={() => setDatePickerVisible(false)} 
                  isDanger
                >
                  취소
                </CompoundOption.Button>
              </View>
            </CompoundOption.Container>
          </CompoundOption.Background>
        </CompoundOption>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  datePickerContainer: {
    padding: spacing.M16,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    width: '80%',
    alignSelf: 'center',
  },
  datePickerTitle: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: spacing.M16,
  } as TextStyle,
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.M16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.M16,
  },
});

export default Calendar;