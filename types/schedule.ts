export interface Schedule {
    id: number;
    scheduleTitle: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    userId: number;
    hasAlarm: boolean;
}
