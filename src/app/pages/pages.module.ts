import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData, DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  DashboardComponent,
  UserGuideModalComponent,
} from './dashboard/dashboard.component';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../design/angular-material.module';
import { MyTeamComponent } from './my-team/my-team.component';
import { ChatComponent } from './chat/chat.component';
import { ScheduleComponent } from './schedule/schedule.component';
import {
  ProjectsComponent,
  // ActivitiesModalComponent,
  // EvidenceModalComponent,
} from './projects/projects.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import '../../styles.scss';
import localeEsAr from '@angular/common/locales/es-AR';
import {
  ActivitiesComponent,
  TaskComponent,
} from './activities/activities.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'angular2-chartjs';
import { KanbanComponent } from './kanban/kanban.component';
import {
  ProjectComponent,
  EvidenceModalComponent1,
} from './project/project.component';
import { TasksComponent } from './tasks/tasks.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NotificationsComponent } from './notifications/notifications.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GanttComponent } from './gantt/gantt.component';
import { GoogleChartsModule, ScriptLoaderService } from 'angular-google-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ProgressBarColor } from './schedule/progress-bar-color';
import { NewProjectModalComponent } from '../components/newProject/newProject-modal.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NewActivityModalComponent } from '../components/newActivity/newActivity-modal.component';
import { NewTaskModalComponent } from '../components/newTask/newTask-modal.component';
import { OpenEvidenceModalComponent } from '../components/openEvidence/openEvidence-modal.component';
import { EditProjectModalComponent } from '../components/editProject/editProject-modal.component';
import { EditActivityModalComponent } from '../components/editActivity/editActivity-modal.component';
import { EditTaskModalComponent } from '../components/editTask/editTask-modal.component';
import {OpenEvidenceDelegateModalComponent} from '../components/openEvidenceDelegate/openEvidenceDelegate-modal.component';
import {OpenResourceModalComponent} from '../components/openResource/openResource-modal.component'
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    ProgressBarColor,
    DashboardComponent,
    MyTeamComponent,
    ChatComponent,
    ScheduleComponent,
    ProjectsComponent,
    NewProjectModalComponent,
    EditProjectModalComponent,
    NewActivityModalComponent,
    EditActivityModalComponent,
    NewTaskModalComponent,
    EditTaskModalComponent,
    UserProfileComponent,
    ActivitiesComponent,
    TaskComponent,
    KanbanComponent,
    ProjectComponent,
    TasksComponent,
    // ActivitiesModalComponent,
    NotificationsComponent,
    // EvidenceModalComponent,
    EvidenceModalComponent1,
    GanttComponent,
    UserGuideModalComponent,
    OpenEvidenceModalComponent,
    OpenEvidenceDelegateModalComponent,
    OpenResourceModalComponent
  ],
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
      useFactory: adapterFactory,
    }),
    DragDropModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    ChartModule,
    FlexLayoutModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    })
  ],
  exports: [
    DashboardComponent,
    FormsModule,
    NgbModalModule,
    FlatpickrModule,
    CalendarModule,
    NgxChartsModule,
    Ng2GoogleChartsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ScriptLoaderService,
  ],
  entryComponents: [
    ProjectsComponent,
    NewProjectModalComponent,
    EditProjectModalComponent,
    TaskComponent,
    EvidenceModalComponent1,
    // ActivitiesModalComponent,
    // EvidenceModalComponent,
    UserGuideModalComponent,
    NewActivityModalComponent,
    EditActivityModalComponent,
    NewTaskModalComponent,
    EditTaskModalComponent,
    OpenEvidenceModalComponent,
    OpenEvidenceDelegateModalComponent,
    OpenResourceModalComponent
  ],
})
export class PagesModule {}
