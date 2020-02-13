import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';
import { UserService } from '../../services/users.service';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { Observable } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { Team } from 'src/app/models/team.interface';
import { map } from 'rxjs/operators';
import { group } from '@angular/animations';
import { Activity } from '../../models/activity.interface';
import { Task } from '../../models/task.interface';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

export interface DialogData {
  projectAppId: string;
  minDate: Date;
  maxDate: Date;
  userApp: User;
}

/* export interface DialogDataActivities {
  projectAppId: string;
} */

export interface StringDate {
  name: string;
  delegate: string;
  chores: string; //tareas
}
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor( public authService: AuthService,
               public projectService: ProjectService,
               public teamService: TeamService,
               public dialog: MatDialog,
               private router1: Router,
               private router: Router
               ) {

    }

  team: string[] = [];

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

  projectsApp: Project[];
  activitiesProjectsApp: Activity[] = [];
  tasksActivitiesApp: Task[] = [];

  idUser: string;
  teamsObservable: any;
  teamAux: Team = {
        manager: ''
  };
  teamAux1: Team[] = [];
  startD: Date;
  endD: Date;
  minDate = new Date();
  name: string;
  delegate: string;
  chores: string; // tareas
  allstartdates: Date[] = [];
  allenddates: Date[] = [];

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

  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  teamGugoAux: Team = {
    manager: ''
  };
  teamGugo: Team = {
    manager: ''
  };


  ngOnInit() {
    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user, this.idUser = user.id);
                                                                           if ( this.userApp.manager === true ) {
                                                                                this.teamService.getTeamByUser(this.userApp).subscribe(team => {
                                                                                    this.teamAux1 = team;
                                                                                  //  console.log(this.teamAux1);
                                                                                    this.teamAux1.forEach(team => {
                                                                                    this.teamAux = team;
                                                                                  //  console.log(this.teamAux);
                                                                                });
                                                                                });
                                                                                /* if ( this.teamAux.manager !== null ) {
                                                                                console.log('hola');
                                                                                } */
                                                                                this.projectService.getProjectByOwner(this.userApp)
                                                                                .subscribe(projects => {
                                                                                  this.projectsApp = projects;
                                                                                  // console.log(this.projectsApp);
                                                                                  this.allstartdates = [];
                                                                                  this.allenddates = [];
                                                                                  this.projectsApp.forEach(project => {
                                                                                    this.allstartdates.push(new Date(project.start_date['seconds'] * 1000));
                                                                                    this.allenddates.push(new Date(project.end_date['seconds'] * 1000));
                                                                                    // console.log(this.allstartdates);
                                                                                    // console.log(this.allenddates);
                                                                                    this.activitiesProjectsApp = [];
                                                                                    this.projectService.getActivities(project).subscribe(activities => {
                                                                                      this.activitiesProjectsApp = activities;
                                                                                      this.activitiesProjectsApp.forEach(activity => {
                                                                                        this.tasksActivitiesApp = [];
                                                                                        this.projectService.getTasks(project.id, activity.id).subscribe( tasks => {
                                                                                          this.tasksActivitiesApp = tasks;
                                                                                        //  console.log(this.tasksActivitiesApp);
                                                                                        });
                                                                                      });
                                                                                    //  console.log(this.activitiesProjectsApp);
                                                                                    });
                                                                                  });
                                                                                //  console.log(this.projectsApp);
                                                                                });
                                                                            } else {
                                                                              console.log('ud es delegado');
                                                                              this.teamGugo.delegates = [];
                                                                              this.teamService.getTeams().subscribe(teams => {
                                                                                  this.teamsAux = teams;
                                                                                  this.teamsAux.forEach(team => {
                                                                                      this.teamService.getDelegates(team).subscribe(delegates => {
                                                                                             // tslint:disable-next-line:prefer-for-of
                                                                                             team.delegates = delegates;
                                                                                             team.delegates.forEach(delegate => {
                                                                                                 if ( delegate.email === this.userApp.email ) {
                                                                                                     this.teamGugoAux = team;
                                                                                                     console.log(this.teamGugoAux);
                                                                                                     this.projectService.getProjectByTeam(this.teamGugoAux)
                                                                                                     .subscribe(projects => {
                                                                                                       this.projectsApp = projects;
                                                                                                        console.log(this.projectsApp);
                                                                                                       this.allstartdates = [];
                                                                                                       this.allenddates = [];
                                                                                                       this.projectsApp.forEach(project => {
                                                                                                         this.allstartdates.push(new Date(project.start_date['seconds'] * 1000));
                                                                                                         this.allenddates.push(new Date(project.end_date['seconds'] * 1000));
                                                                                                         // console.log(this.allstartdates);
                                                                                                         // console.log(this.allenddates);
                                                                                                         this.activitiesProjectsApp = [];
                                                                                                         this.projectService.getActivities(project).subscribe(activities => {
                                                                                                           this.activitiesProjectsApp = activities;
                                                                                                           this.activitiesProjectsApp.forEach(activity => {
                                                                                                             this.tasksActivitiesApp = [];
                                                                                                             this.projectService.getTasks(project.id, activity.id).subscribe( tasks => {
                                                                                                               this.tasksActivitiesApp = tasks;
                                                                                                             //  console.log(this.tasksActivitiesApp);
                                                                                                             });
                                                                                                           });
                                                                                                         //  console.log(this.activitiesProjectsApp);
                                                                                                         });
                                                                                                       });
                                                                                                     //  console.log(this.projectsApp);
                                                                                                     });
                                                                                                 }
                                                                                             });
                                                                                  });
                                                                              });
                                                                              });
                                                                            }

    });

   // this.projectService.setActivitiestoProject(this.projectAux, this.activityAux);
  }


  openNewProject(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open( NewProjectModalComponent, {
      width: '700px',
      data: { userApp: this.userApp }
  });

   /*  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.name = result;
    this.delegate = result;
    this.chores = result;
  }); */
  }

  /* openProject(): void {
    this.router1.navigateByUrl('/project');
  } */

  openActivities( id: string, minDateF: Date, maxDateF: Date ): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open( ActivitiesModalComponent, {
      width: '600px',
      data: {  projectAppId: id, minDate: minDateF, maxDate: maxDateF  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    });
  }
  }

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'newProject-modal',
    templateUrl: './newProject-modal.component.html',
    styleUrls: ['./newProject-modal.component.css']
  })

  export class NewProjectModalComponent implements OnInit {

    projectApp: Project = {
        name: '',
        client: '',
        description: '',
        start_date: null,
        end_date: null,
        type: '',
        teamId: '',
        ownerId: '',
        status: 'Por Realizar',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    startD: Date;
    endD: Date;
    minDate = new Date();

    teamsObservable: any;
    teamAux: Team = {
        manager: ''
    };

    constructor(
      public dialogRef: MatDialogRef<NewProjectModalComponent>,
      public teamService: TeamService,
      public projectService: ProjectService,
      public authService: AuthService,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit() {

      this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.projectApp.ownerId = user.id);
                                                                             this.teamService.getTeamByUser(this.data.userApp)
                                                                                              .subscribe(team => {
                                                                                                          this.teamsObservable = team;
                                                                                                          this.teamsObservable.map(a =>
                                                                                                          this.teamAux = a);
                                                                                                          /* this.teamAux.delegates = [];
                                                                                                          this.teamService.getDelegates(this.teamAux)
                                                                                              .subscribe(delegates => {
                                                                                                          this.teamAux.delegates = delegates;
                                                                                                          }); */
                                                                                                          this.projectApp.teamId = this.teamAux.id;
                                                                                                        });
                                                                                                      });
    }

    onSaveProject( form: NgForm ) {

      if ( form.invalid ) { return; }

      if ( this.endD <= this.startD ) {

          Swal.fire({
            type: 'error',
            title: 'Fechas fuera de rango',
          });
          return;
      }

      Swal.fire({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();


      this.projectService.addNewProject( this.projectApp );

      Swal.close();
      Swal.fire({
          allowOutsideClick: false,
          type: 'success',
          title: 'Proyecto creado con exito'
        });

      this.dialogRef.close();

      }

      inputEvent($event) {
        this.startD = new Date($event.value);
      }

      inputEvent2($event) {
        this.endD = new Date($event.value);
      }
  }


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'activities-modal',
    templateUrl: './activities-modal.component.html',
    styleUrls: ['./activities-modal.component.css']
  })

  export class ActivitiesModalComponent implements OnInit {

    task: Task = {
      name: '',
      status: 'Por realizar',
      delegate: 'Delegado'
      };


    id: string;
    maxD: Date;
    minD: Date;
    startD: Date;
    endD: Date;

    activityProject: Activity = {
      name: '',
      status: 'Por Realizar',
      start_date: null,
      end_date: null,
      percentaje: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    constructor(
      public dialogRef: MatDialogRef<ActivitiesModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private projectService: ProjectService) { }

    ngOnInit() {
        this.id = this.data.projectAppId;
        this.maxD = this.data.maxDate;
        this.minD = this.data.minDate;

      }

    inputEvent($event) {
        this.startD = new Date($event.value);
      }

    inputEvent2($event) {
        this.endD = new Date($event.value);
      }

    onSaveActivity( form: NgForm ) {
      if ( form.invalid ) { return; }

      if ( this.endD <= this.startD ) {

          Swal.fire({
            type: 'error',
            title: 'Fechas fuera de rango',
          });
          return;
      }

      Swal.fire({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      this.projectService.setActivitiestoProject( this.id, this.activityProject );

      Swal.close();
      Swal.fire({
          allowOutsideClick: false,
          type: 'success',
          title: 'Actividad agregada con exito'
        });

      this.dialogRef.close();
    }
  }




