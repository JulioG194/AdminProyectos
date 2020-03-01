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
                                                                    this.projectsAux.forEach(project => {
                                                                      this.startD = new Date(project.start_date['seconds'] * 1000);
                                                                      this.endD = new Date(project.end_date['seconds'] * 1000);
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
  }


