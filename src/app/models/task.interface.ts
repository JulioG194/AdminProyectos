import { User } from './user.interface';
export interface Task {
    name: string;
    status: string;
    delegate: User;
    start_date?: Date;
    end_date?: Date;
    progress?: number;
    id?: string;
    createdAt?: any;
    idActivity?: string;
    }
