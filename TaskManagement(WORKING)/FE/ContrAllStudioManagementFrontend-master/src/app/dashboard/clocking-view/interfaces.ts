export interface User {
    firstName: string;
    lastName: string;
    fullName: string;
    id: number;
    date: ClockingDate[];
}
export interface Clocking {
    clockingId: number;
    dateId: number;
    startTime: Date;
    endTime: Date;
    totalTime: string;
}

export interface ClockingDate {
    dateId: number;
    currentDate: Date;
    hours: number;
    minutes: number;
    seconds: number;
    userId: number;
    user: User;
    clockings: Clocking [];
    totalTime: string;
}

