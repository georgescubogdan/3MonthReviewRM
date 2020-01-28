import { User } from '../users-view/user';

export interface VacationDay {
    vacationDayID: number;
    userId: number;
    user: User;
    from: Date;
    to: Date;
    reason: string;
    state: boolean;
}
