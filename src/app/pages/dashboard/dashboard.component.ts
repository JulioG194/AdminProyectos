import { Component, OnInit, Inject } from '@angular/core';
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
export interface State {
  name: string;
  count: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  statesT: State[] = [];

  stateTP: State = {
    name: 'Por Realizar',
    count: 0,
  };

  stateR: State = {
    name: 'Realizando',
    count: 0,
  };

  stateRD: State = {
    name: 'Realizado',
    count: 0,
  };

  stateV: State = {
    name: 'Por Verificar',
    count: 0,
  };

  post = true;
  show = false;
  userGugo: User = {
    displayName: '',
    email: '',
    password: '',
    uid: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photoURL: '',
    manager: false,
    phoneNumber: '',
  };
  projects: any[] = ['asdsd'];
  progressArray: number[] = [];
  teamAux: Team = {
    manager: '',
  };
  teamAux1: Team[] = [];

  projectsApp: Project[] = [];
  activitiesProjectsApp: Activity[] = [];
  tasksActivitiesApp: Task[] = [];
  results: any[] = [];

  dataProjects: number[] = [];

  view: any[] = [700, 400];
  barData: number[] = [];
  labelBar: string[] = [];
  barData1: number[] = [];
  labelBar1: string[] = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Porcentaje %';
  showYAxisLabel = true;
  yAxisLabel = 'Proyectos';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  isLoading = true;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private teamService: TeamService,
    public dialog: MatDialog
  ) {}

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
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
    'Proyectos sin realizar',
    'Proyectos completados',
    'Proyectos en proceso',
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
        'yellow',
        'purple',
        'grey',
        'black',
        'blue',
        'green',
        'red',
        'magenta',
        'blue',
        'green',
        'red',
        'yellow',
        'purple',
        'grey',
        'black',
        'magenta',
      ],
    },
  ];

  ngOnInit() {
    // const user = firebase.auth().currentUser;
    // console.log('******************************');
    // console.log(user);
    // console.log(this.authService.userAuth);
    this.authService.getUser(this.authService.userAuth).subscribe((user) => {
      this.userGugo = user;

      if (this.userGugo.manager === true) {
        this.teamService.getTeamByUser(this.userGugo).subscribe((team) => {
          this.teamAux1 = team;
          this.teamAux1.forEach((teamOnce) => {
            this.teamAux = teamOnce;
          });
        });
        this.projectService
          .getProjectByOwner(this.userGugo)
          .subscribe((projects) => {
            this.projectsApp = projects;
            this.isLoading = false;
            this.results = [];
            this.barChartLabels = [];
            this.barChartData[0].data = [];
            this.projectsApp.forEach((proj) => {
              const gp: any = {
                name: '',
                value: 0,
              };
              gp.name = proj.name;
              gp.value = proj.progress;
              this.results.push(gp);
              this.barChartData[0].data.push(gp.value);
              this.barChartLabels.push(gp.name);
            });
            this.dataProjects = [];
            let projectsInprogress = 0;
            let projectsOut = 0;
            let projectsCompleted = 0;
            let id: string;
            let aux9: number;
            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < this.projectsApp.length; index++) {
              // tslint:disable-next-line:no-unused-expression
              this.projectsApp[index].progress;
              this.activitiesProjectsApp = [];
              let numeroActs: number;
              let aux6: number;
              let aux7: number;
              let porcentajeActividad: number;
              let numeroTasks: number;
              let porcentajeTask: number;
              let aux3: number;
              let aux4: number;
              let aux1: number;
              let status: string;
              let idAuxiliar: string;
              let countRND = 0;
              let countRD = 0;
              let countPR = 0;
              let statusP: string;
              let countPRND = 0;
              let countPRD = 0;
              let countPPR = 0;
              this.projectService
                .getActivities(this.projectsApp[index])
                .subscribe((acts) => {
                  let aux8 = 0;
                  countPRND = 0;
                  countPRD = 0;
                  countPPR = 0;
                  this.activitiesProjectsApp = acts;
                  numeroActs = this.activitiesProjectsApp.length;
                  porcentajeActividad = 100 / numeroActs;
                  aux6 = 100 / numeroActs;
                  for (const activity of this.activitiesProjectsApp) {
                    if (activity.status === 'Por Verificar') {
                      statusP = 'Por Verificar';
                      break;
                    } else {
                      statusP = '';
                      if (activity.status === 'Realizando') {
                        countPRND++;
                      } else if (activity.status === 'Realizado') {
                        countPRD++;
                      } else if (activity.status === 'Por Realizar') {
                        countPPR++;
                      }
                    }
                  }

                  if (statusP !== 'Por Verificar') {
                    if (countPRND >= countPRD && countPRND >= countPPR) {
                      statusP = 'Realizando';
                    } else if (countPRD >= countPRND && countPRD >= countPPR) {
                      statusP = 'Realizado';
                    } else {
                      statusP = 'Por Realizar';
                    }
                  }
                  // tslint:disable-next-line:prefer-for-of
                  for (let j = 0; j < this.activitiesProjectsApp.length; j++) {
                    status = '';
                    idAuxiliar = '';
                    aux7 = this.activitiesProjectsApp[j].progress * aux6;
                    aux8 += aux7;
                    this.projectService
                      .getTasks(
                        this.activitiesProjectsApp[j].projectId,
                        this.activitiesProjectsApp[j].id
                      )
                      .subscribe((tasks) => {
                        let aux2 = 0;
                        countRND = 0;
                        countRD = 0;
                        countPR = 0;
                        this.tasksActivitiesApp = tasks;
                        if (this.tasksActivitiesApp.length === 0) {
                          try {
                            this.projectService.setActivityProgress(
                              this.projectsApp[index].id,
                              this.activitiesProjectsApp[j].id,
                              0
                            );
                          } catch {}
                        } else {
                          numeroTasks = this.tasksActivitiesApp.length;
                          porcentajeTask = 100 / numeroTasks;
                          // tslint:disable-next-line:prefer-for-of
                          for (
                            let k = 0;
                            k < this.tasksActivitiesApp.length;
                            k++
                          ) {
                            aux1 =
                              this.tasksActivitiesApp[k].progress *
                              porcentajeTask;
                            aux2 += aux1;
                            aux3 = aux2 / 100;
                            aux4 = +aux3.toFixed(2);
                            id = this.tasksActivitiesApp[k].idActivity;
                          }

                          for (const taskOf of this.tasksActivitiesApp) {
                            console.log(
                              `${taskOf.name} de la actividad ${taskOf.idActivity}`
                            );
                            if (taskOf.status === 'Por Verificar') {
                              status = 'Por Verificar';
                              break;
                            } else {
                              status = '';
                              if (taskOf.status === 'Realizando') {
                                countRND++;
                                console.log(countRND);
                              } else if (taskOf.status === 'Realizado') {
                                countRD++;
                                console.log(countRD);
                              } else if (taskOf.status === 'Por Realizar') {
                                countPR++;
                                console.log(countPR);
                                console.log(taskOf.name);
                              }
                            }
                          }

                          if (status !== 'Por Verificar') {
                            if (countRND >= countRD && countRND >= countPR) {
                              status = 'Realizando';
                            } else if (
                              countRD >= countRND &&
                              countRD >= countPR
                            ) {
                              status = 'Realizado';
                            } else {
                              status = 'Por Realizar';
                              console.log('si llegue aca');
                            }
                          }
                          console.log(status);
                          try {
                            this.projectService.setActivityProgress(
                              this.projectsApp[index].id,
                              id,
                              aux4
                            );
                            console.log(
                              `proyecto:${this.projectsApp[index].id} ${id} estado:${status}`
                            );
                            // this.projectService.setStatusActivity(this.projectsApp[index].id, id, status);
                          } catch {}
                        }
                      });
                  }
                  aux9 = +(aux8 / 100).toFixed(2);

                  try {
                    this.projectService.setProjectProgress(
                      this.projectsApp[index].id,
                      aux9
                    );
                    console.log(
                      `proyectoASubir:${this.projectsApp[index].id} estado:${statusP}`
                    );
                    // this.projectService.setStatusProject(this.projectsApp[index].id, statusP);
                  } catch {}
                });
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
          });
      }
    });
  }

  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  onSelect(event) {
    console.log(event);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
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
