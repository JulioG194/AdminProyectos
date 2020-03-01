export interface Task {
    name: string;
    status: string;
    delegate: string;
    start_date?: Date;
    end_date?: Date;
    progress?: number;
    id?: string;
    createdAt?: any;
    idActivity?: string;
    }
