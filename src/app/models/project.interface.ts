import { User } from './user.interface';
export interface Project {
    name: string;
    client: string;
    description: string;
    type: string;
    startDate: Date;
    endDate: Date;
    status?: string;
    ownerId: string;
    teamId?: string;
    id?: string;
    createdAt?: any;
    progress?: number;
    delegates?: User[];
}
