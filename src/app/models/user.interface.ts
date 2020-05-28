export interface User {
        uid: string;
        email: string;
        password?: string;
        displayName: string;
        photoURL?: string;
        phoneNumber?: string;
        birthdate?: Date;
        employment?: string;
        description?: string;
        gender?: string;
        manager?: boolean;
        createdAt?: any;
}

