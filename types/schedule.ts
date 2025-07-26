export interface Schedule {
    id: number;
    title: string;
    content: string;
    time: string;
    day: string;
    userId: number;
    hasAlarm: boolean;
}

export interface CreateScheduleData {
    scheduleTitle: string;
    content: string;
    startTime: string;
    endTime: string;
    day: string;
    hasAlarm: boolean;
}
