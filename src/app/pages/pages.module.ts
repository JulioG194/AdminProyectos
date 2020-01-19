import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../design/angular-material.module';
import { MyTeamComponent } from './my-team/my-team.component';
import { ChatComponent } from './chat/chat.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ProjectsComponent, NewProjectModalComponent } from './projects/projects.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import localeEsAr from '@angular/common/locales/es-AR';
import { ActivitiesComponent, TaskComponent  } from './activities/activities.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartsModule } from 'ng2-charts';
import { KanbanComponent } from './kanban/kanban.component';
import { ProjectComponent, TaskComponent1 } from './project/project.component';
import { TasksComponent } from './tasks/tasks.component';


registerLocaleData(localeEs);

@NgModule({
  declarations: [DashboardComponent, MyTeamComponent, ChatComponent, ScheduleComponent, ProjectsComponent, NewProjectModalComponent, UserProfileComponent, ActivitiesComponent,TaskComponent, KanbanComponent, ProjectComponent, TasksComponent, TaskComponent1],
  imports: [
    CommonModule,
    PAGES_ROUTES,
    SharedModule,
    AngularMaterialModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    DragDropModule,
    ChartsModule
  ],
  exports: [
    DashboardComponent,
    FormsModule,
    NgbModalModule,
    FlatpickrModule,
    CalendarModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'es-Ar' } ],
  entryComponents: [ProjectsComponent, NewProjectModalComponent, TaskComponent, TaskComponent1]
})
export class PagesModule { }
