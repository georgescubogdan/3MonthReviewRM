import { Task } from './task';

export interface TaskState {
    taskStateID: number;
    name: string;
    orderNr: number;
    tasks: Task[];
}
