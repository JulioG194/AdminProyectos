import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';
import { Team } from 'src/app/models/team.interface';
import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import format from 'date-fns/format';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#2261bf',
    secondary: '#050000'
  }
};



@Component({
  selector: 'app-schedule',
 // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']/* ,
  encapsulation: ViewEncapsulation.None */
})
export class ScheduleComponent implements OnInit {

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
difDyas: number[] = [];
post = false;
allstartdates: Date[] = [];
allenddates: Date[] = [];
allstartdatesT: Date[] = [];
allenddatesT: Date[] = [];
    projects: Project[] = [];
    userApp: User = {
      name: '',
      email: '',
      password: '',
      id: '',
      birthdate: new Date(),
      description: '',
      gender: '',
      photo: ''
  };
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
projects1: any[] = [{ 
  name:'Proyecto1',
  fecha:'10/02/2020',
  dias:'2',
  porcentaje:'80'
},
{
  name:'Proyecto2',
  fecha:'11/02/2020',
  dias:'4',
  porcentaje:'50'
},
{
  name:'Proyecto3',
  fecha:'15/02/2020',
  dias:'5',
  porcentaje:'75'
},
{
  name:'Proyecto3',
  fecha:'15/02/2020',
  dias:'15',
  porcentaje:'100'
}
];
// idUser: String;
teamsObservable: any;
projectsAux: Project[];
teamAux: Team = {
      manager: ''
};
idUser: string;
startD: Date;
endD: Date;
minDate = new Date();


chartData;
options;
plantingDays = '2020-03-01 00:00:00.000';

MS_PER_DAY = 1000 * 60 * 60 * 24;

data = [];
lables = [];


    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    modalData: {
      action: string;
      event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
     /*  {
        label: '<i class="fa fa-fw fa-pencil"></i>',
        a11yLabel: 'Edit',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent('Edited', event);
        }
      },
      {
        label: '<i class="fa fa-fw fa-times"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.events = this.events.filter(iEvent => iEvent !== event);
          this.handleEvent('Deleted', event);
        }
      } */
    ];

    refresh: Subject<any> = new Subject();

    event: CalendarEvent = {
        start: new Date(),
        end: new Date(),
        title: '',
        color: colors.red,
      //  actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
    };
    events: CalendarEvent[] = [
      /* {
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: 'A 3 day event',
        color: colors.red,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      },
      {
        start: startOfDay(new Date()),
        title: 'An event with no end date',
        color: colors.yellow,
        actions: this.actions
      },
      {
        start: subDays(endOfMonth(new Date()), 3),
        end: addDays(endOfMonth(new Date()), 3),
        title: 'A long event that spans 2 months',
        color: colors.blue,
        allDay: true
      },
      {
        start: addHours(startOfDay(new Date()), 2),
        end: addHours(new Date(), 2),
        title: 'A draggable and resizable event',
        color: colors.yellow,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      } */
    ];

    activeDayIsOpen: boolean = false;

    constructor( private modal: NgbModal,
                 private _projectService: ProjectService,
                 private _teamService: TeamService,
                 private _authService: AuthService ) {}

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = date;
      }
    }

    eventTimesChanged({
      event,
      newStart,
      newEnd
    }: CalendarEventTimesChangedEvent): void {
      this.events = this.events.map(iEvent => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd
          };
        }
        return iEvent;
      });
      this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
      this.events = [
        ...this.events,
        {
          title: 'New event',
          start: startOfDay(new Date()),
          end: endOfDay(new Date()),
          color: colors.red,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        }
      ];
    }

    deleteEvent(eventToDelete: CalendarEvent) {
      this.events = this.events.filter(event => event !== eventToDelete);
    }

    setView(view: CalendarView) {
      this.view = view;
    }

    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }

    newObj(object: CalendarEvent) {
     const newObject = {
      start: new Date(),
      end: new Date(),
      title: '',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
     };
     for (const key in object) {
        if (object.hasOwnProperty(key)) {
          newObject[key] = object[key];
        }
      }
     return newObject;
    }

    ngOnInit() {
      this._authService.getUser(this._authService.userAuth)
      .subscribe(user => {(this.userApp = user, this.idUser = user.id);
                          this._teamService.getTeamByUser(this.userApp)
                          .subscribe(team => {
                                              this.teamsObservable = team;
                                              this.teamsObservable.map((a: Team) =>
                                              this.teamAux = a);
                                              this.teamAux.delegates = [];
                                              this._teamService.getDelegates(this.teamAux)
                                              .subscribe(delegates => {
                                                                      this.teamAux.delegates = delegates;
                                                                                  });
                                              this.projectApp.teamId = this.teamAux.id;
                                              this._projectService.getProjectByOwner(this.userApp)
                                              .subscribe(projects => {
                                                                    this.projectsAux = projects;
                                                                    this.difDyas = [];
                                                                    this.allenddates = [];
                                                                    // console.log(this.projectsAux);
                                                                    this.projectsAux.forEach(project => {
                                                                      this.startD = new Date();
                                                                      this.endD = new Date(project.end_date['seconds'] * 1000);
                                                                      this.allenddates.push(this.endD);
                                                                      this.differenceTime = Math.abs(this.endD.getTime() - this.startD.getTime());
                                                                      this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                      // console.log(this.differenceDays);
                                                                      this.difDyas.push(this.differenceDays);
                                                                      console.log(this.difDyas);
                                                                      this.event.start = startOfDay(this.startD);
                                                                      this.event.end = startOfDay(this.endD);
                                                                      this.event.title = project.name;
                                                                      this.event.color = colors.green;
                                                                      this.event.allDay = true;
                                                                      this.event.resizable.beforeStart = false;
                                                                      this.event.resizable.afterEnd = false;
                                                                      this.event.draggable = false;
                                                                      this.events.push(this.newObj(this.event));
                                                                    });
                                                                    this.refresh.next();
                                              });
      });
      });
    }

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

    mostrar(idProject: string) {
    this.data = [];
    this.lables = [];
    this._authService.getUser(this._authService.userAuth).subscribe(user => {(this.userApp = user); });
    this._projectService.getProject(idProject).subscribe(project => {
                                                                                                            this.projectApp = project;
                                                                                                            this.projectApp.start_date = new Date(this.projectApp.start_date['seconds'] * 1000);
                                                                                                            this.projectApp.end_date = new Date(this.projectApp.end_date['seconds'] * 1000);
                                                                                                           /*  this.differenceTime = Math.abs(this.projectApp.end_date.getTime() - this.projectApp.start_date.getTime());
                                                                                                            this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                                                            console.log(this.differenceDays); */
                                                                                                            this._teamService.getTeam(this.projectApp.teamId).subscribe(team => {
                                                                                                            this.team = team;
                                                                                                            this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                              this.delegates = delegates;
                                                                                                                        });
                  });
                                                                                                            this._projectService.getActivities(this.projectApp).subscribe( activities => {
                                                                                                                  this.activitiesProject = activities;
                                                                                                                  /* this.allstartdates = [];
                                                                                                                  this.allenddates = []; */
                                                                                                                  /* this.activitiesProject.forEach(activity => {
                                                                                                                    this.allstartdates.push(new Date(activity.start_date['seconds'] * 1000));
                                                                                                                    this.allenddates.push(new Date(activity.end_date['seconds'] * 1000));
                                                                                                                  }); */
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


