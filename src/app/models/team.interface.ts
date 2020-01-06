import { User } from './user.interface';

export interface Team {
    manager?: string;
    delegates?: User[];
    id?: string;
}
