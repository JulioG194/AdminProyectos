import { Component, ViewChild, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';
import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import {GoogleChartInterface} from 'ng2-google-charts/ng2-google-charts';
import { untilDestroyed } from '@orchestrator/ngx-until-destroyed';
import Swal from 'sweetalert2';
declare let google: any;
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {

public orgChart: GoogleChartInterface = {
    chartType: 'Timeline',
    dataTable: [
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };
delegates: User[] = [];
tasksActivity: Task[][];
projectsApp: Project[] = [];
activitiesProject: Activity[] = [];
differenceTime: number;
differenceTime2: number;
differenceTime3: number;
differenceDays: number;
restDays: number;
delayedD: number;
difDyas: number[] = [];
post = false;
projects: Project[] = [];
    userApp: User = {
      displayName: '',
      email: '',
      password: '',
      uid: '',
      birthdate: new Date(),
      description: '',
      gender: '',
      photoURL: ''
  };
 tasksDelegate: Task[] = [];
 tskDelegates: any[] = [];
  projectApp: Project = {
      name: '',
      client: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      type: '',
      teamId: '',
      ownerId: '',
      status: 'To Do'
};
projectsAux: Project[];
idUser: string;
startD: Date;
endD: Date;
minDate = new Date();
activitiesProjectsApp: Activity[] = [];
tasksActivitiesApp: Task[] = [];
 isLoadingTeam = true;
information: any[];
dataC: any[] = [];
dataT: any[] = [];
chartType: any;
dataTable: any = [];
optionsC: any;
automaticClose = false;
data = [];
lables = [];
durations: number[] = [];
rests: number[] = [];
delayed: number[] = [];


    @ViewChild('chartDiv', { static: false }) pieChart: ElementRef;

    colNames: any[] = [];
    roles: { role: string; type: string; index: number; p: { html: boolean; }; }[];
    isLoading: boolean;

    constructor( private projectService: ProjectService,
                 private teamService: TeamService,
                 private authService: AuthService ) {}


  drawChart4 = () => {
    const data = google.visualization.arrayToDataTable(this.dataC);
    const options = {
     backgroundColor: '#ffd',
     hAxis: {
       format: 'dd/MM/yyyy',
       textStyle: { color: '#FFFFFF'}
      },
      height: 600,
    };
    const chart = new google.visualization.Timeline(this.pieChart.nativeElement);
    chart.draw(data, options);
  }

    ngOnInit() {
       this.userApp = this.authService.userAuth;
       this.isLoading = true;
       if (this.userApp.manager === true) {
        this.getProjects();
        this.getDelegates();
    }

       if (this.userApp.manager === false) {
        this.getTasksDelegate();
    }
    }
    getProjects() {
    const user = this.authService.userAuth;
    this.projectService.getProjectByOwnerDate(user)
                        .pipe(untilDestroyed(this))
                        .subscribe(projects => {
                          projects.map(project => {
                            project.startDate = new Date(project.startDate['seconds'] * 1000);
                            project.endDate = new Date(project.endDate['seconds'] * 1000);
                          });
                          this.projectsApp = projects;
                          this.durations = [];
                          this.rests = [];
                          this.projectsApp.map(prj => {
                            // prj.startDate = new Date(prj.startDate['seconds'] * 1000);
                            // prj.endDate = new Date(prj.endDate['seconds'] * 1000);
                            this.differenceTime = Math.abs(prj.endDate.getTime() - prj.startDate.getTime());
                            this.differenceTime2 = prj.endDate.getTime() - new Date().getTime();
                            this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                            this.restDays = Math.ceil(this.differenceTime2 / (1000 * 3600 * 24));
                            console.log(this.restDays);
                            if (this.restDays < 0) {
                                 const day = Math.abs(this.restDays);
                                 this.rests.push(0);
                                 this.delayed.push(day);
                            } else {
                               const day = Math.abs(this.restDays);
                               this.rests.push(day);
                               this.delayed.push(0);
                            }
                            this.durations.push(this.differenceDays);
                          });
                          this.isLoading = false;
                        });
  }

  getDelegates() {
    const {uid} = this.authService.userAuth;
    this.teamService.getDelegatesId(uid).pipe(untilDestroyed(this)).subscribe(delegates => {
      this.delegates = delegates;
      this.isLoadingTeam = false;
    });
  }

  getTasksDelegate() {
    const {uid} = this.authService.userAuth;
    this.projectService.getTasksDelegates(uid).pipe(untilDestroyed(this)).subscribe(resp => {
      this.tskDelegates = [];
      resp.map(r => {
         const {project, activity, taskId} = r;
         this.projectService.getTask(project.id, activity.id, taskId).subscribe(tsk => {
             tsk.startDate =  new Date(tsk.startDate['seconds'] * 1000);
             tsk.endDate =  new Date(tsk.endDate['seconds'] * 1000);
             const obj = {
              ...r,
              tsk
            };
             this.tskDelegates.push(obj);
         });
      });
      this.isLoading = false;
      }
      );
  }


    questioner(name: string, displayName: string, img: string, progress: number, startDate: Date, endDate: Date, status: string, employment: string) {
        const dateStartD = startDate.getDate();
        const monthStartD = startDate.getMonth() + 1;
        const yearStartD = startDate.getFullYear();
        const dateEndD = endDate.getDate();
        const monthEndD = endDate.getMonth() + 1;
        const yearEndD = endDate.getFullYear();
        const color = this.colorStatus(status);
        return `<p style="font-size:17px; text-transform: uppercase; text-align:center; color:#082330; font-weight: bold;">${name}</p>
                <div class="card2" style="width:250px;height:300px;padding:10px; border-radius: 10px;">
                <div style="display:flex; flex-direction: row; justify-content: space-between;">
                <img src="${img}" alt="John" style="width:50px; height: 50px;border-radius: 30px;align=”middle”;">
                <div style="display:flex; flex-direction: column">
                <h1 style="font-size:20px;text-align:center;">${displayName}</h1>
                <p class="title" style="font-size:15px;text-align:center">${employment}</p>
                </div>
                </div>
                <p style="font-size:15px;font-weight: bold;">Avance: ${progress} % </p>
                <p style="font-size:15px;text-align:center">Fecha de inicio: ${dateStartD}/${monthStartD}/${yearStartD}</p>
                <p style="font-size:15px;text-align:center">Fecha de fin: ${dateEndD}/${monthEndD}/${yearEndD}</p>
                <p style="font-size:15px;text-align:center" class="badge ${color}">Estado: ${status} </p>
                <a href="#"><i class="fa fa-dribbble"></i></a>
                <a href="#"><i class="fa fa-twitter"></i></a>
                <a href="#"><i class="fa fa-linkedin"></i></a>
                <a href="#"><i class="fa fa-facebook"></i></a>
              </div>`;
    }

    colorStatus(status: string) {
      let color = '';
      if (status === 'Por Realizar') {
        color = 'badge-danger';
      } else if (status === 'Realizando') {
        color = 'badge-info';
      } else if (status === 'Realizado') {
        color = 'badge-success';
      } else if (status === 'Por Verificar') {
        color = 'badge-warning';
      }
      return color;
    }

    mostrar(projectId: string) {
      this.authService
          .getUser(this.authService.userAuth)
          .subscribe(user => {(this.userApp = user); });
      this.projectService
          .getProject(projectId)
          .subscribe(project => {
              this.projectApp = project;
              this.projectService
              .getActivities(this.projectApp.id)
              .subscribe( activities => {
                    this.activitiesProject = activities;
                    this.dataC = [];
                    this.dataTable = [];
                    this.dataC.push(['Room', 'Name',  {role: 'tooltip', p: {html: true}}, 'Start', 'End']);
                    for (let i = 0; i < this.activitiesProject.length; i++) {
                    this.projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id)
                                      .subscribe(tasks => {
                                          this.activitiesProject[i].tasks = tasks;
                                          for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                              this.activitiesProject[i].tasks[j].startDate = new Date(this.activitiesProject[i].tasks[j].startDate['seconds'] * 1000);
                                              this.activitiesProject[i].tasks[j].endDate = new Date(this.activitiesProject[i].tasks[j].endDate['seconds'] * 1000);
                                              let data: any[] = [];
                                              data = [this.activitiesProject[i].name,
                                              this.activitiesProject[i].tasks[j].name,
                                              this.questioner(this.activitiesProject[i].tasks[j].name, this.activitiesProject[i].tasks[j].delegate.displayName,
                                              this.activitiesProject[i].tasks[j].delegate.photoURL,
                                              this.activitiesProject[i].tasks[j].progress,
                                              this.activitiesProject[i].tasks[j].startDate,
                                              this.activitiesProject[i].tasks[j].endDate,
                                              this.activitiesProject[i].tasks[j].status,
                                              this.activitiesProject[i].tasks[j].delegate.employment) ,
                                              this.activitiesProject[i].tasks[j].startDate,
                                              this.activitiesProject[i].tasks[j].endDate];
                                              this.dataC.push(data);
                                            }
                                          });
                                        }
                    });
                  });
      { setTimeout(() => {
        this.post = true;
        Swal.fire({
              allowOutsideClick: false,
              text: 'Por favor, espere...',
              timer: 2000,
              icon: 'info',
            });
        google.charts.load('current', {packages: ['timeline'], language: 'es'});
        google.charts.setOnLoadCallback(this.drawChart4);
        Swal.showLoading();
      },
      2000);
    }
  }

  ngOnDestroy() {}
  }


