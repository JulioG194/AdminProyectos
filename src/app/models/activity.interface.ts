import { User } from 'firebase';
import { Task } from './task.interface';

export interface Activity {
    name: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    activity_time?: number;
    progress?: number;
    id?: string;
    createdAt?: any;
    tasks?: Task[];
    projectId?: string;
    description?: string;
    delegates?: User[];
}
