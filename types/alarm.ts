export interface Alarm {
    id: number;
    alarmTitle: string;
    alarmContent: string;
    createdAt: string;
    userId: number;
    scheduleId?: number;
}

export interface AlarmRequest {
    alarmTitle: string;
    alarmContent: string;
}

export interface AlarmResponse {
    id: number;
    alarmTitle: string;
    alarmContent: string;
    createdAt: string;
    userId: number;
    schedule?: any;
} 