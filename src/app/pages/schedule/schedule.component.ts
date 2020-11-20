import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
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
import {GoogleChartInterface} from 'ng2-google-charts/ng2-google-charts';
// import { GoogleChartInterface } from 'ng2-google-charts';

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

declare let google: any;

@Component({
  selector: 'app-schedule',
 // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']/* ,
  encapsulation: ViewEncapsulation.None */
})
export class ScheduleComponent implements OnInit {

public orgChart: GoogleChartInterface = {
    chartType: 'Timeline',
    dataTable: [
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
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
      displayName: '',
      email: '',
      password: '',
      uid: '',
      birthdate: new Date(),
      description: '',
      gender: '',
      photoURL: ''
  };
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
teamsObservable: any;
projectsAux: Project[];
teamAux: Team = {
      manager: ''
};
idUser: string;
startD: Date;
endD: Date;
minDate = new Date();
activitiesProjectsApp: Activity[] = [];
tasksActivitiesApp: Task[] = [];
information: any[];
dataC: any[] = [];
dataT: any[] = [];

public timelineChartData: any =  {
  chartType: 'Timeline',
  dataTable: this.dataC,
  options: {
            title: 'Tasks',
            // width: 700,
            // height: 500,
            orientation: 'vertical',
            // chartArea: {width: '100%'},
            explorer: {axis: 'horizontal', keepInBounds: true},
            yAxis : {
              textStyle : {
                  fontSize: 7 // or the number you want
              }
          },
          hAxis: {
          format: 'MM/dd/yyyy',
      }
        }
   };

chartType: any;
dataTable: any = [];
optionsC: any;
automaticClose = false;

chartData;
options;
plantingDays = '2020-03-01 00:00:00.000';

MS_PER_DAY = 1000 * 60 * 60 * 24;

data = [];
lables = [];

    @ViewChild('chartDiv', { static: false }) pieChart: ElementRef;
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

    activeDayIsOpen = false;
  colNames: any[] = [];
  roles: { role: string; type: string; index: number; p: { html: boolean; }; }[];
  test = [['Task', 'Hours per Day', {role: 'tooltip', p: {html: true}}],
    ['Work', 11, '2'],
    ['Eat', 2, '2'],
    ['Commute', 2, '4'],
    ['Watch TV', 2, '6'],
    ['Sleep', 7, '7']];

  test2 = [['Task ID', 'Task Name', 'Resource', 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies', {role: 'tooltip', p: {html: true}}],
        ['2014Spring', 'Spring 2014', 'spring', new Date(2014, 2, 22), new Date(2014, 5, 20), 0, 50, null, 'toot'],
        ['2014Summer', 'Summer 2014', 'summer',
         new Date(2014, 5, 21), new Date(2014, 8, 20), 2, 100, null, 'toot'],
        ['2014Autumn', 'Autumn 2014', 'autumn',
         new Date(2014, 8, 21), new Date(2014, 11, 20), 3, 100, null, 'toot'],
        ['2014Winter', 'Winter 2014', 'winter',
         new Date(2014, 11, 21), new Date(2015, 2, 21), 4, 100, null, 'toot'],
        ['2015Spring', 'Spring 2015', 'spring',
         new Date(2015, 2, 22), new Date(2015, 5, 20), 5, 50, null, 'toot'],
        ['2015Summer', 'Summer 2015', 'summer',
         new Date(2015, 5, 21), new Date(2015, 8, 20), 6, 0, null, 'toot'],
        ['2015Autumn', 'Autumn 2015', 'autumn',
         new Date(2015, 8, 21), new Date(2015, 11, 20), 7, 0, null, 'toot'],
        ['2015Winter', 'Winter 2015', 'winter',
         new Date(2015, 11, 21), new Date(2016, 2, 21), 8, 0, null, 'toot'],
        ['Football', 'Football Season', 'sports',
         new Date(2014, 8, 4), new Date(2015, 1, 1), 9, 100, null, 'toot'],
        ['Baseball', 'Baseball Season', 'sports',
         new Date(2015, 2, 31), new Date(2015, 9, 20), 10, 14, null, 'toot'],
        ['Basketball', 'Basketball Season', 'sports',
         new Date(2014, 9, 28), new Date(2015, 5, 20), 11, 86, null, 'toot'],
        ['Hockey', 'Hockey Season', 'sports',
         new Date(2014, 9, 8), new Date(2015, 5, 21), 12, 89, null, 'toot']
      ];

  test3 = [['Room', 'Name',  {role: 'tooltip', p: {html: true}}, 'Start', 'End'],
      [ 'Magnolia Room',  'CSS Fundamentals',   '<h1>hola</h1>', new Date(0, 0, 0, 12, 0, 0),  new Date(0, 0, 0, 14, 0, 0),  ],
      [ 'Magnolia Room',  'Intro JavaScript', 'kk',    new Date(0, 0, 0, 14, 30, 0), new Date(0, 0, 0, 16, 0, 0), ],
      [ 'Magnolia Room',  'Advanced JavaScript', 'kl', new Date(0, 0, 0, 16, 30, 0), new Date(0, 0, 0, 19, 0, 0),  ],
      [ 'Gladiolus Room', 'Intermediate Perl',  'kq' , new Date(0, 0, 0, 12, 30, 0), new Date(0, 0, 0, 14, 0, 0), ],
      [ 'Gladiolus Room', 'Advanced Perl',  'kq' ,     new Date(0, 0, 0, 14, 30, 0), new Date(0, 0, 0, 16, 0, 0) ],
      [ 'Gladiolus Room', 'Applied Perl',     'kq' ,   new Date(0, 0, 0, 16, 30, 0), new Date(0, 0, 0, 18, 0, 0), ],
      [ 'Petunia Room',   'Google Charts',   'kq' ,    new Date(0, 0, 0, 12, 30, 0), new Date(0, 0, 0, 14, 0, 0),  ],
      [ 'Petunia Room',   'Closure',     'kq' ,        new Date(0, 0, 0, 14, 30, 0), new Date(0, 0, 0, 16, 0, 0),  ],
      [ 'Petunia Room',   'App Engine',   'kq' ,       new Date(0, 0, 0, 16, 30, 0), new Date(0, 0, 0, 18, 30, 0),  ]];

    constructor( private modal: NgbModal,
                 private _projectService: ProjectService,
                 private _teamService: TeamService,
                 private _authService: AuthService ) {}




    drawChart2 = () => {

  const data = google.visualization.arrayToDataTable(this.test);

  const options = {
    title: 'My Daily Activities',
    legend: {position: 'top'}
  };

  const chart = new google.visualization.PieChart(this.pieChart.nativeElement);

  chart.draw(data, options);
}


  drawChart3 = () => {
    const data = google.visualization.arrayToDataTable(this.test2);

    const options = {
     height: 400,
        gantt: {
          trackHeight: 30
        }
  };

    const chart = new google.visualization.Gantt(this.pieChart.nativeElement);

    chart.draw(data, options);
  }

  drawChart4 = () => {
    const data = google.visualization.arrayToDataTable(this.dataC);

    const options = {
     // timeline: { colorByRowLabel: true },
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
                 drawChart() {

    function drawChart() {

      let data = google.visualization.arrayToDataTable([
        ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
         'Western', 'Literature', { role: 'annotation' } ],
        ['2010', 10, 24, 20, 32, 18, 5, ''],
        ['2020', 16, 22, 23, 30, 16, 9, ''],
        ['2030', 28, 19, 29, 30, 12, 13, '']
      ]);

      const options = {
        height: 400,
        isStacked: true,
        vAxis: {format: 'decimal'},
        hAxis: {format: ''},
        series: {
          0: {color: '#fdd835'},
          1: {color: '#0091ff'},
          2: {color: '#e53935'},
          3: {color: '#43a047'},
        }
      };

      const chart = new google.charts.Bar(document.getElementById('initial_chart_div'));

      chart.draw(data, google.charts.Bar.convertOptions(options));
    }
    google.charts.load('current', {packages: ['bar']});
    google.charts.setOnLoadCallback(drawChart);
  }
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


    ngOnInit() { }

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

    questioner(question: string, img: string, progress: number) {
    // return `<div <h1>${question}</h1> </div>`;
    return `<div class="card2" style="width:250px;height:300px;padding:10px; border-radius: 10px;">
  <div style="display:flex; flex-direction: row; justify-content: space-between;">
  <img src="${img}" alt="John" style="width:50px; height: 50px;border-radius: 30px;align=”middle”;">
  <div style="display:flex; flex-direction: column">
  <h1 style="font-size:20px;text-align:center;">${question}</h1>
  <p class="title" style="font-size:15px;text-align:center">Employement</p>
  </div>
  </div>
  <p style="font-size:15px">Avance: </p>
  <p style="font-size:15px;font-weight: bold;">${progress}%</p>
  <p style="font-size:15px;text-align:center">Fecha de inicio:</p>
  <p style="font-size:15px;text-align:center">Fecha de fin:</p>
  <p style="font-size:15px;text-align:center">Estado: </p>
  <a href="#"><i class="fa fa-dribbble"></i></a>
  <a href="#"><i class="fa fa-twitter"></i></a>
  <a href="#"><i class="fa fa-linkedin"></i></a>
  <a href="#"><i class="fa fa-facebook"></i></a>
</div>`;
    }

    mostrar(projectId: string) {
      this.post = false;
      this._authService.getUser(this._authService.userAuth).subscribe(user => {(this.userApp = user); });
      this._projectService.getProject(projectId).subscribe(project => {
                                                                                                              this.projectApp = project;
                                                                                                              this.projectApp.startDate = new Date(this.projectApp.startDate['seconds'] * 1000);
                                                                                                              this.projectApp.endDate = new Date(this.projectApp.endDate['seconds'] * 1000);
                                                                                                             /*  this.differenceTime = Math.abs(this.projectApp.endDate.getTime() - this.projectApp.startDate.getTime());
                                                                                                              this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                                                              console.log(this.differenceDays); */
                                                                                                              this._teamService.getTeam(this.projectApp.teamId).subscribe(team => {
                                                                                                              this.team = team;
                                                                                                              this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                                this.delegates = delegates;
                                                                                                                          });
                    });
                                                                                                              this._projectService.getActivities(this.projectApp.id).subscribe( activities => {
                                                                                                                    this.activitiesProject = activities;
                                                                                                                    this.dataC = [];
                                                                                                                    this.dataTable = [];
                                                                                                                    this.dataC.push(['Room', 'Name',  {role: 'tooltip', p: {html: true}}, 'Start', 'End']);
                                                                                                                    for (let i = 0; i < this.activitiesProject.length; i++) {
                                                                                                                            this._projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id).subscribe(tasks => {
                                                                                                                               this.activitiesProject[i].tasks = tasks;
                                                                                                                               // console.log(this.activitiesProject[i]);
                                                                                                                               // tslint:disable-next-line:prefer-for-of
                                                                                                                               for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                                                                                                                   this.activitiesProject[i].tasks[j].startDate = new Date(this.activitiesProject[i].tasks[j].startDate['seconds'] * 1000);
                                                                                                                                   this.activitiesProject[i].tasks[j].endDate = new Date(this.activitiesProject[i].tasks[j].endDate['seconds'] * 1000);
                                                                                                                                   let data: any[] = [];
                                                                                                                                   data = [this.activitiesProject[i].name, this.activitiesProject[i].tasks[j].name, this.questioner(this.activitiesProject[i].tasks[j].delegate.displayName, this.activitiesProject[i].tasks[j].delegate.photoURL, this.activitiesProject[i].tasks[j].progress) , this.activitiesProject[i].tasks[j].startDate, this.activitiesProject[i].tasks[j].endDate];
                                                                                                                                   // this.colNames = ['Date', 'Low', 'Open', 'Close', 'Tooltip'];
                                                                                                                                   this.dataC.push(data);
                                                                                                                                  }

                                                                                                                      });
                                                                                                                      }

                    });
                  });
      {
                    setTimeout(() => { this.post = true; google.charts.load('current', {packages: ['timeline'], language: 'es'});
                                       google.charts.setOnLoadCallback(this.drawChart4); }, 2000);
                  }
  }


  }


