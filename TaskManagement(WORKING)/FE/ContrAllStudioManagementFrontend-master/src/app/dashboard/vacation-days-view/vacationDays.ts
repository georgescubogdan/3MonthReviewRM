import { VacationDay } from './vacation-days';

export const VACATIONDAYS: VacationDay[] = [

    {
        vacationDayID: 0,
        userId: 1,
        from: new Date('01/01/2020'),
        to: new Date('02/02/2024'),
        reason: 'blablabla',
        state: false,
        user: null,
    },
    {
        vacationDayID: 1,
        userId: 1,
        from: new Date('01/01/2074'),
        to: new Date('02/02/2080'),
        reason: 'abcabcabc',
        state: true,
        user: null,
    },
    {
        vacationDayID: 2,
        userId: 1,
        from: new Date('01/01/2110'),
        to: new Date('02/02/2200'),
        reason: 'qwertyuiop',
        state: false,
        user: null,
    }

];
