import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData, DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DashboardComponent, UserGuideModalComponent } from './dashboard/dashboard.component';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../design/angular-material.module';
import { MyTeamComponent } from './my-team/my-team.component';
import { ChatComponent } from './chat/chat.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ProjectsComponent, NewProjectModalComponent, ActivitiesModalComponent, EvidenceModalComponent } from './projects/projects.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import '../../styles.scss';
import localeEsAr from '@angular/common/locales/es-AR';
import { ActivitiesComponent, TaskComponent  } from './activities/activities.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'angular2-chartjs';
import { KanbanComponent } from './kanban/kanban.component';
import { ProjectComponent, TaskComponent1, ActivitiesModalComponent1, EvidenceModalComponent1 } from './project/project.component';
import { TasksComponent } from './tasks/tasks.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NotificationsComponent } from './notifications/notifications.component';
import { GraficoBarraHorizontalComponent } from '../components/grafico-barra-horizontal/grafico-barra-horizontal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GanttComponent } from './gantt/gantt.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { ProgressBarColor } from './schedule/progress-bar-color';




registerLocaleData(localeEs);

@NgModule({
  declarations: [ ProgressBarColor, DashboardComponent, MyTeamComponent, ChatComponent, ScheduleComponent, ProjectsComponent, NewProjectModalComponent, UserProfileComponent, ActivitiesComponent, TaskComponent, KanbanComponent, ProjectComponent, TasksComponent, TaskComponent1, ActivitiesModalComponent, NotificationsComponent, ActivitiesModalComponent1, GraficoBarraHorizontalComponent, EvidenceModalComponent, EvidenceModalComponent1, GanttComponent, UserGuideModalComponent],
  imports: [
    CommonModule,
    PAGES_ROUTES,
    SharedModule,
    AngularMaterialModule,
    FormsModule,
    NgbModalModule,
    NgxChartsModule,
    FlatpickrModule.forRoot(),
    MatCarouselModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    DragDropModule,
    ChartsModule,
    GoogleChartsModule,
    ChartModule
  ],
  exports: [
    DashboardComponent,
    FormsModule,
    NgbModalModule,
    FlatpickrModule,
    CalendarModule,
    NgxChartsModule,
    GoogleChartsModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'es-Ar' }, DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB'} ],
  entryComponents: [ProjectsComponent, NewProjectModalComponent, TaskComponent, TaskComponent1, EvidenceModalComponent1, ActivitiesModalComponent, ActivitiesModalComponent1, EvidenceModalComponent, UserGuideModalComponent]
})
export class PagesModule { }
