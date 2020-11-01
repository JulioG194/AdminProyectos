import { User } from './user.interface';
export interface Task {
    name: string;
    status: string;
    delegate: User;
    startDate?: Date;
    endDate?: Date;
    progress?: number;
    id?: string;
    createdAt?: any;
    idActivity?: string;
    }
