import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View, 
  TextStyle,
  Alert
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { colors, getFontStyle, spacing } from '../../constants';
import { useSchedule, useUpdateSchedule, useDeleteSchedule, Schedule } from '../../server/query/hooks/useSchedule';
import Margin from '../../components/division/Margin';

type CalendarEditRouteProp = RouteProp<{
  CalendarEdit: { calendaritemIndex: number };
}, 'CalendarEdit'>;



const CalendarEditScreen = () => {
  const route = useRoute<CalendarEditRouteProp>();
  const navigation = useNavigation();
  const { calendaritemIndex } = route.params;

  const { data: scheduleData, isLoading } = useSchedule(calendaritemIndex, 1);
  const { mutate: updateSchedule } = useUpdateSchedule();
  const { mutate: deleteSchedule } = useDeleteSchedule();

  const [schedule, setSchedule] = useState<Schedule>({
    id: calendaritemIndex,
    title: '새로운 스케줄',
    content: '',
    time: '',
    day: new Date().toISOString().split('T')[0],
    hasAlarm: false
  });

  // 기존 스케줄 데이터 설정
  useEffect(() => {
    if (scheduleData) {
      setSchedule(scheduleData);
    }
  }, [scheduleData]);

  const handleSave = () => {
    if (!schedule.title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return;
    }
    updateSchedule({
      scheduleId: calendaritemIndex,
      userId: 1,
      scheduleData: {
        scheduleTitle: schedule.title,
        content: schedule.content,
        startTime: schedule.time,
        endTime: schedule.time,
        day: schedule.day,
        hasAlarm: schedule.hasAlarm,
      }
    }, {
      onSuccess: () => {
        Alert.alert('성공', '스케줄이 수정되었습니다.');
        navigation.goBack();
      },
      onError: (error) => {
        console.error('Schedule update failed:', error);
        Alert.alert('오류', '스케줄 수정에 실패했습니다.');
      }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 스케줄을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => {
          deleteSchedule({ scheduleId: calendaritemIndex, userId: 1 }, {
            onSuccess: () => {
              Alert.alert('성공', '스케줄이 삭제되었습니다.');
              navigation.goBack();
            },
            onError: (error: any) => {
              console.error('Schedule deletion failed:', error);
              Alert.alert('오류', '스케줄 삭제에 실패했습니다.');
            }
          });
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Margin size={'M16'} />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>스케줄 편집</Text>
        <View style={styles.headerRight} />
      </View>

      <Margin size={'M24'} />

      {/* 입력 폼 */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={schedule.title}
            onChangeText={(text) => setSchedule(prev => ({ ...prev, title: text }))}
            placeholder="스케줄 제목을 입력하세요"
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={schedule.content}
            onChangeText={(text) => setSchedule(prev => ({ ...prev, content: text }))}
            placeholder="스케줄 내용을 입력하세요"
            multiline
            numberOfLines={4}
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>시간</Text>
          <TextInput
            style={styles.input}
            value={schedule.time}
            onChangeText={(text) => setSchedule(prev => ({ ...prev, time: text }))}
            placeholder="예: 10:00 AM 또는 All Day"
          />
        </View>

        <Margin size={'M16'} />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>날짜</Text>
          <TextInput
            style={styles.input}
            value={schedule.day}
            onChangeText={(text) => setSchedule(prev => ({ ...prev, day: text }))}
            placeholder="YYYY-MM-DD 형식"
          />
        </View>

        {/* 알람 설정 */}
        <Margin size={'M16'} />
        <View style={styles.inputGroup}>
          <Text style={styles.label}>알람 설정</Text>
          <TouchableOpacity 
            style={styles.alarmToggle}
            onPress={() => {
              setSchedule(prev => ({ ...prev, hasAlarm: !prev.hasAlarm }));
            }}
          >
            <Text style={styles.alarmLabel}>
              {schedule.hasAlarm ? '알람 비활성화' : '알람 활성화'}
            </Text>
            <Text style={styles.alarmToggleText}>
              {schedule.hasAlarm ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Margin size={'M32'} />

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: spacing.M16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    color: colors.BLACK,
    fontWeight: 'bold',
  },
  headerTitle: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  headerRight: {
    width: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.M16,
  },
  label: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.BLACK,
    marginBottom: spacing.M8,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    padding: spacing.M12,
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.BLACK,
  } as TextStyle,
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.M12,
    marginBottom: spacing.M32,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.M16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.GREEN,
  },
  saveButtonText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  deleteButton: {
    backgroundColor: colors.RED,
  },
  deleteButtonText: {
    ...getFontStyle('body', 'medium', 'bold'),
    color: colors.WHITE,
  } as TextStyle,
  noAlarmText: {
    ...getFontStyle('body', 'medium', 'regular'),
    color: colors.GRAY,
    textAlign: 'center',
    padding: spacing.M16,
  } as TextStyle,
  alarmToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.M12,
    paddingHorizontal: spacing.M16,
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

export default CalendarEditScreen;
