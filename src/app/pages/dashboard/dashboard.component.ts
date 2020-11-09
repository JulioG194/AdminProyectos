import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';
import { ProjectService } from '../../services/project.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.interface';
import { Project } from 'src/app/models/project.interface';
import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../projects/projects.component';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { untilDestroyed } from '@orchestrator/ngx-until-destroyed';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  post = true;
  show = false;
  userGugo: User;

  project: Project;
  activity: Activity;
  projectId: string;
  projectResult: Project;
  projectsApp: Project[] = [];
  activitiesProjectsApp: Activity[] = [];
  tasksActivitiesApp: Task[] = [];
  projectsNumber = 0;
  activitiesNumber = 0;
  tasksNumber = 0;

  activitiesStatistics: Activity[] = [];
  tasksStatistics: Task[] = [];

  dataProjects: number[] = [];
  dataActivities: number[] = [];
  dataTasks: number[] = [];

  barData: number[] = [];
  barDataTask: number[] = [];

  subscriptionGetProjects: Subscription;
  subscriptionGetActivities: Subscription;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  /* Projects */
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: () => {
          return '';
        },
      },
    },
  };

  public pieChartLabels: Label[] = [
    'Sin realizar',
    'Completados',
    'En proceso',
  ];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.8)',
        'rgba(0,255,0,0.8)',
        'rgba(0,0,255,0.8)',
      ],
    },
  ];
  /* Projects */

  /* Activities */
  public pieChartOptionsAct: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: () => {
          return '';
        },
      },
    },
  };

  public pieChartLabelsAct: Label[] = [
    'Sin realizar',
    'Completados',
    'En proceso',
  ];
  public pieChartDataAct: number[] = [];
  public pieChartTypeAct: ChartType = 'pie';
  public pieChartLegendAct = true;
  public pieChartPluginsAct = [pluginDataLabels];
  public pieChartColorsAct = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.8)',
        'rgba(0,255,0,0.8)',
        'rgba(0,0,255,0.8)',
      ],
    },
  ];
  /* Activities */

  /* Tasks */
  public pieChartOptionsTsk: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: () => {
          return '';
        },
      },
    },
  };

  public pieChartLabelsTsk: Label[] = [
    'Sin realizar',
    'Completados',
    'En proceso',
  ];
  public pieChartDataTsk: number[] = [];
  public pieChartTypeTsk: ChartType = 'pie';
  public pieChartLegendTsk = true;
  public pieChartPluginsTsk = [pluginDataLabels];
  public pieChartColorsTsk = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.8)',
        'rgba(0,255,0,0.8)',
        'rgba(0,0,255,0.8)',
      ],
    },
  ];
  /* Tasks */

  /*chart Activities*/
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            fontSize: 12,
            fontFamily: "'Roboto', sans-serif",
            fontColor: '#ffffff',
            fontStyle: '500',
            beginAtZero: true,
            max: 100,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 12,
            fontFamily: "'Roboto', sans-serif",
            fontColor: '#ffffff',
            fontStyle: '500',
            beginAtZero: true,
            max: 100,
          },
        },
      ],
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [{ data: this.barData }];

  public barChartColors: Color[] = [
    {
      backgroundColor: [
        'yellow', 'purple', 'grey', 'black', 'blue', 'green', 'red', 'magenta',
        'blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black', 'magenta',
      ],
    },
  ];
  /*chart Activities*/


  /*chart Tasks*/
  public barChartOptionsTask: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            fontSize: 12,
            fontFamily: "'Roboto', sans-serif",
            fontColor: '#ffffff',
            fontStyle: '500',
            beginAtZero: true,
            max: 100,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 12,
            fontFamily: "'Roboto', sans-serif",
            fontColor: '#ffffff',
            fontStyle: '500',
            beginAtZero: true,
            max: 100,
          },
        },
      ],
    },
  };
  public barChartLabelsTask: Label[] = [];
  public barChartTypeTask: ChartType = 'horizontalBar';
  public barChartLegendTask = false;

  public barChartDataTask: ChartDataSets[] = [{ data: this.barDataTask }];

  public barChartColorsTask: Color[] = [
    {
      backgroundColor: [
        'yellow', 'purple', 'grey', 'black', 'blue', 'green', 'red', 'magenta',
        'blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black', 'magenta',
      ],
    },
  ];
  /*chart Tasks*/

   getProjects() {
    this.userGugo = this.authService.userAuth;
    this.subscriptionGetProjects = this.projectService.getProjectByOwner(this.userGugo).pipe(untilDestroyed(this))
                        .subscribe(projects => {
                          projects.map(project => {
                            project.startDate = new Date(project.startDate['seconds'] * 1000);
                            project.endDate = new Date(project.endDate['seconds'] * 1000);
                          });
                          this.projectsApp = projects;
                          this.dataProjects = [];
                          this.activitiesNumber = 0;
                          this.tasksNumber = 0;
                          let tasksInprogress = 0;
                          let tasksOut = 0;
                          let tasksCompleted = 0;
                          this.activitiesStatistics = [];
                          let activitiesInprogress = 0;
                          let activitiesOut = 0;
                          let activitiesCompleted = 0;
                          let projectsInprogress = 0;
                          let projectsOut = 0;
                          let projectsCompleted = 0;
                          for (let index = 0; index < this.projectsApp.length; index++) {
                          if (this.projectsApp[index].progress === 100) {
                              projectsCompleted++;
                          } else if (
                              this.projectsApp[index].progress > 0 &&
                              this.projectsApp[index].progress < 100
                          ) {
                              projectsInprogress++;
                          } else if (this.projectsApp[index].progress === 0) {
                              projectsOut++;
                          }
                        }
                          this.dataProjects.push(projectsOut);
                          this.dataProjects.push(projectsCompleted);
                          this.dataProjects.push(projectsInprogress);
                          this.pieChartData = this.dataProjects;
                          this.isLoading = false;

                          this.projectsApp.map(proj => {
                            this.subscriptionGetActivities = this.projectService.getActivities(proj.id).pipe(untilDestroyed(this)).subscribe(acts => {
                              this.activitiesNumber += acts.length;
                              acts.map(act => {
                                this.activitiesStatistics.push(act);
                                if (act.progress === 100) {
                                        activitiesCompleted++;
                                      } else if (
                                    act.progress > 0 &&
                                    act.progress < 100
                                    ) {
                                    activitiesInprogress++;
                                    } else if (act.progress === 0) {
                                    activitiesOut++;
                                    }
                                this.projectService.getTasks(proj.id, act.id).pipe(untilDestroyed(this)).subscribe(tsks => {
                                  this.tasksNumber += tsks.length;
                                  tsks.map(tsk => {
                                    this.tasksStatistics.push(tsk);
                                    if (tsk.progress === 100) {
                                        tasksCompleted++;
                                      } else if (
                                      tsk.progress > 0 &&
                                      tsk.progress < 100
                                      ) {
                                      tasksInprogress++;
                                      } else if (tsk.progress === 0) {
                                      tasksOut++;
                                      }
                                  });
                                  this.dataTasks.push(tasksOut);
                                  this.dataTasks.push(tasksCompleted);
                                  this.dataTasks.push(tasksInprogress);
                                  this.pieChartDataTsk = _.takeRight(this.dataTasks, 3);
                                });
                              });
                              this.dataActivities.push(activitiesOut);
                              this.dataActivities.push(activitiesCompleted);
                              this.dataActivities.push(activitiesInprogress);
                              this.pieChartDataAct = _.takeRight(this.dataActivities, 3);
                            });
                          });
                        });
  }

  projectsChangeAction(project: string) {
    this.projectId = project;
    this.getActivities(project);
    this.barChartDataTask[0].data = [];
    this.barChartLabelsTask = [];
  }

  activitiesChangeAction(activity: string) {
    this.getTasks(this.projectId, activity);
  }

  getActivities(projectId: string) {
  this.projectService.getActivities(projectId).pipe(untilDestroyed(this)).subscribe(activities => {
                          activities.map(activity => {
                            activity.startDate = new Date(activity.startDate['seconds'] * 1000);
                            activity.endDate = new Date(activity.endDate['seconds'] * 1000);
                          });
                          this.activitiesProjectsApp = activities;
                          this.barChartData[0].data = [];
                          this.barChartLabels = [];
                          this.activitiesProjectsApp.forEach((act) => {
                            this.barChartData[0].data.push(act.progress);
                            this.barChartLabels.push(act.name);
                          });
                          // this.isLoading = false;
                        });
  }


  getTasks(projectId: string, activityId: string) {
  this.projectService.getTasks(projectId, activityId).pipe(untilDestroyed(this)).subscribe(tasks => {
                          tasks.map(task => {
                            task.startDate = new Date(task.startDate['seconds'] * 1000);
                            task.endDate = new Date(task.endDate['seconds'] * 1000);
                          });
                          this.tasksActivitiesApp = tasks;
                          this.barChartDataTask[0].data = [];
                          this.barChartLabelsTask = [];
                          this.tasksActivitiesApp.forEach((tsk) => {
                            this.barChartDataTask[0].data.push(tsk.progress);
                            this.barChartLabelsTask.push(tsk.name);
                          });
                          // this.isLoading = false;
                        });
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy() {
      // this.subscriptionGetProjects.unsubscribe();
      // this.subscriptionGetActivities.unsubscribe();
  }


  openUserGuide(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(UserGuideModalComponent, {
      width: '1300px',
      data: {},
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'userGuide-modal',
  templateUrl: './userGuide-modal.component.html',
  styleUrls: ['./userGuide-modal.component.css'],
})
export class UserGuideModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UserGuideModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {}
}
