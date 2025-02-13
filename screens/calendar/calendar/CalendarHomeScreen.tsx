import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextStyle } from 'react-native';
import { colors, getFontStyle, spacing } from '../../../constants/index';

interface CalendarProps {
  year: number;
  month: number;
  schedules: Array<{
    day: string;
    [key: string]: any;
  }>;
  onChangeMonth: (increment: number) => void;
  setDay: (date: number) => void;
}

interface DayProps {
  date: number;
  scheduleCount: number;
}

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  schedules,
  onChangeMonth,
  setDay,
}) => {
  const getDayColor = (scheduleCount: number) => {
    if (scheduleCount === 0) return colors.WHITE;
    if (scheduleCount === 1) return colors.GREEN;
    if (scheduleCount === 2) return colors.YELLOW;
    return colors.RED;
  };

  const renderCalendarDay = ({ date, scheduleCount }: DayProps) => {
    const backgroundColor = getDayColor(scheduleCount);
    
    return (
      <TouchableOpacity 
        style={[styles.day]}
        onPress={() => setDay(date)}
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
    const lastDate = new Date(year, month, 0).getDate();
    const firstDOW = new Date(year, month - 1, 1).getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDOW; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Add cells for each day of the month
    for (let date = 1; date <= lastDate; date++) {
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
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
        <Text style={styles.headerTitle}>{`${year}년 ${month}월`}</Text>
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
});

export default Calendar;