import { Task } from './task.interface';

export interface Activity {
    name: string;
    status: string;
    start_date?: Date;
    end_date?: Date;
    activity_time?: number;
    percentaje?: number;
    id?: string;
    createdAt?: any;
    tasks?: Task[];
    idProject?: string;
}
