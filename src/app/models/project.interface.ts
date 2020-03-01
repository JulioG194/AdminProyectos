export interface Project {
    name: string;
    client: string;
    description: string;
    type: string;
    start_date: Date;
    end_date: Date;
    status: string;
    ownerId: string;
    teamId?: string;
    id?: string;
    createdAt?: any;
    progress?: number;
}
