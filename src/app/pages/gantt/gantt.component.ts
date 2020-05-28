import { Component, OnInit } from '@angular/core';
import 'chartjs-plugin-datalabels';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import { ActivatedRoute } from '@angular/router';
import { Activity } from 'src/app/models/activity.interface';
import { Project } from 'src/app/models/project.interface';
import { Task } from 'src/app/models/task.interface';
import { Team } from 'src/app/models/team.interface';
import format from 'date-fns/format';
import { datos } from '../gantt/data';

// import { Foo, datos } from './data';

export interface DataG {
  actividad: string;
  datos: any[];
}

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styles: []
})
export class GanttComponent implements OnInit {

  MS_PER_DAY = 1000 * 60 * 60 * 24;

  data = [];
  data1 = [];
  post = false;
  // data: Data[] = [];
  datos: DataG[] = [];
  projectApp: Project = {
    name: '',
    client: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    type: '',
    teamId: '',
    ownerId: '',
    status: 'To Do'
};
startD = new Date();
endD = new Date();
id: string;
idActivity: string;
minDate = new Date();
maxDate = new Date();

activityProject: Activity = {
    name: '',
    status: '',
    activity_time: 0
};

taskActivity: Task = {
    name: '',
    status: '',
    delegate: null
};

team: Team;
delegates: User[] = [];
tasksActivity: Task[][];
activitiesProject: Activity[] = [];
differenceTime: number;
differenceDays: number;

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
allstartdates: Date[] = [];
allenddates: Date[] = [];
allstartdatesT: Date[] = [];
allenddatesT: Date[] = [];
activityAux: Activity = {
  name: '',
  status: '',
  start_date: null,
  end_date: null,
  activity_time: 0
};

dat: any = {
  task : '',
  startDate: '',
  endDate: ''
};

aux7: number;


  chartData;
  options;
  plantingDays = '2020-03-01 00:00:00.000';

  constructor( private authService: AuthService,
               private _projectService: ProjectService,
               public _teamService: TeamService,
               private route: ActivatedRoute ) {
  }

  lables = [];
  lables1 = [];
  title = '';
  // lables: string [] = [];

  createChart() {
    const that = this;
    this.chartData = {
      // labels: this.data.map(t => t.task),
      labels: this.lables,
      datasets: [
        {
          data: this.data.map(t => {
            return this.dateDiffInDays(new Date(this.plantingDays), new Date(t.startDate));
          }),
          datalabels: {
            color: '#025ced',
            formatter(value, context) {
              return '';
            }
          },
          backgroundColor: 'rgba(63,103,126,0)',
          hoverBackgroundColor: 'rgba(50,90,100,0)',
        },
        {
          data: this.data.map(t => {
            return this.dateDiffInDays(new Date(t.startDate), new Date(t.endDate));
          }),
          datalabels: {
            color: '#025ced',
            formatter(value, context) {
              return '';
            }
          },
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Diagrama Gantt',
      },
      legend: { display: false },
      tooltips: {
        mode: 'index',
        callbacks: {
          label(tooltipItem, d) {
            let label = d.datasets[tooltipItem.datasetIndex].label || '';
            const date = new Date(that.plantingDays);
            if (tooltipItem.datasetIndex === 0) {
              const diff = that.dateDiffInDays(date, new Date(that.data[tooltipItem.index].startDate));
              date.setDate(diff + 1);
              label += 'Fecha Inicio: ' + that.getDate(date);
            } else if (tooltipItem.datasetIndex === 1) {
              const diff = that.dateDiffInDays(date, new Date(that.data[tooltipItem.index].endDate));
              date.setDate(diff + 1);
              label += 'Fecha Fin: ' + that.getDate(date);
            }
            return label;
          },
        },
      },
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            callback(value, index, values) {
              const date = new Date(that.plantingDays);
              date.setDate(value);
              return that.getDate(date);
            },
          },
        }],
        yAxes: [{
          stacked: true,
        }],
      },
    };
  }

  getDate(date: Date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2)
      + '-' + ('0' + (date.getDate())).substr(-2);
  }

  dateDiffInDays(a: Date, b: Date) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / this.MS_PER_DAY);
  }

  mostrar(acti: Activity) {
    this.data = [];
    this.lables = [];
    this.data1.forEach(d => {
      if ( d.idAct === acti.id) {
          this.data.push(d);
          this.lables.push(d.task);
          this.title = d.nameAct;
      }
    });
    this.post = true;
  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user); });
    this._projectService.getProject(this.id).subscribe(project => {
                                                                                                            this.projectApp = project;
                                                                                                            this.projectApp.start_date = new Date(this.projectApp.start_date['seconds'] * 1000);
                                                                                                            this.projectApp.end_date = new Date(this.projectApp.end_date['seconds'] * 1000);
                                                                                                            this.differenceTime = Math.abs(this.projectApp.end_date.getTime() - this.projectApp.start_date.getTime());
                                                                                                            this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                                                            console.log(this.differenceDays);
                                                                                                            this._teamService.getTeam(this.projectApp.teamId).subscribe(team => {
                                                                                                            this.team = team;
                                                                                                            this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                              this.delegates = delegates;
                                                                                                                        });
                  });
                                                                                                            this._projectService.getActivities(this.projectApp).subscribe( activities => {
                                                                                                                  this.activitiesProject = activities;
                                                                                                                  this.allstartdates = [];
                                                                                                                  this.allenddates = [];
                                                                                                                  this.activitiesProject.forEach(activity => {
                                                                                                                    this.allstartdates.push(new Date(activity.start_date['seconds'] * 1000));
                                                                                                                    this.allenddates.push(new Date(activity.end_date['seconds'] * 1000));
                                                                                                                  });
                                                                                                                  // tslint:disable-next-line:prefer-for-of
                                                                                                                  for (let i = 0; i < this.activitiesProject.length; i++) {
                                                                                                                          this._projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id).subscribe(tasks => {
                                                                                                                             this.activitiesProject[i].tasks = tasks;
                                                                                                                             console.log(this.activitiesProject[i]);
                                                                                                                             // tslint:disable-next-line:prefer-for-of
                                                                                                                             for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                                                                                                                 this.activitiesProject[i].tasks[j].start_date = new Date(this.activitiesProject[i].tasks[j].start_date['seconds'] * 1000);
                                                                                                                                 let st: string;
                                                                                                                                 st = format(this.activitiesProject[i].tasks[j].start_date, 'yyyy-MM-dd HH:mm:ss');
                                                                                                                                 // console.log( );
                                                                                                                                 let end: string;
                                                                                                                                 ////
                                                                                                                                 this.activitiesProject[i].tasks[j].end_date = new Date(this.activitiesProject[i].tasks[j].end_date['seconds'] * 1000);
                                                                                                                                 end = format(this.activitiesProject[i].tasks[j].end_date, 'yyyy-MM-dd HH:mm:ss');
                                                                                                                                 const dato: any = {
                                                                                                                                   task: this.activitiesProject[i].tasks[j].name,
                                                                                                                                   startDate: st,
                                                                                                                                   endDate: end,
                                                                                                                                   idAct: this.activitiesProject[i].id,
                                                                                                                                   nameAct: this.activitiesProject[i].name
                                                                                                                                 };
                                                                                                                                 this.data.push(dato);
                                                                                                                                 console.log(this.data);
                                                                                                                                 // console.log(this.data);
                                                                                                                                 this.lables.push(this.activitiesProject[i].tasks[j].name);
                                                                                                                                }
                                                                                                                    });
                                                                                                                    }
                  });
                });
    {
                  setTimeout(() => { this.createChart(); this.post = true; }, 1000);
                }
  }

}
