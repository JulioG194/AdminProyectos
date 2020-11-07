import { User } from './user.interface';

export interface Team {
    manager?: string;
    delegates?: User[];
    id?: string;
    email?: string;
    password?: string;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    employment?: string;
}
