import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { ProjectsComponent } from './projects/projects.component';
import { ChatComponent } from './chat/chat.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ActivitiesComponent } from './activities/activities.component';


const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' }
    },
    {
        path: 'my-team',
        component: MyTeamComponent,
        data: { titulo: 'MyTeam' }
    },
    {
        path: 'projects',
        component: ProjectsComponent,
        data: { titulo: 'Projects' }
    },
    {
        path: 'schedule',
        component: ScheduleComponent,
        data: { titulo: 'Schedule' }
    },
    {
        path: 'chat',
        component: ChatComponent,
        data: { titulo: 'Chat' }
    },
    {
        path: 'user-profile',
        component: UserProfileComponent,
        data: { titulo: 'UserProfile'}
    },
    {
        path: 'activities',
        component: ActivitiesComponent,
        data: { titulo: 'Activities'}
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
