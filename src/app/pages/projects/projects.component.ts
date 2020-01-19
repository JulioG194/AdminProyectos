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

export interface DialogData {
  name: string;
  delegate: string;
  chores: string; //tareas
  userApp: User;
}
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

  constructor( public _authService: AuthService,
               public _projectService: ProjectService,
               public _teamService: TeamService,
               public dialog: MatDialog,
               private router1: Router,
               private router: Router
               ) {

    }


  projects: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Alexa','Julio','Yeye','Anto',
                            'Sarita','Santo','Dani','Tere'];
  projects1: string[] = [];

  userApp: User = {
        name: '',
        email: '',
        password: '',
        id: '',
        birthdate: new Date(),
        career: '',
        description: '',
        gender: '',
        photo: ''
    };

  projectsApp: Project[] = [];
  activitiesProjectsApp: Activity[] = [];
  tasksActivitiesApp: Task[] = [];

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


  idUser: String;
  teamsObservable:any;
  teamAux: Team = {
        manager: ''
  };

  startD: Date;
  endD: Date;
  minDate = new Date();
  name: string;
  delegate: string;
  chores: string; //tareas
  allstartdates: Date[] = [];
  allenddates: Date[] = [];


  ngOnInit() {
    this._authService.showUser(this._authService.userAuth).subscribe(user => {(this.userApp = user, this.idUser = user.id);
                                                                              this._projectService.getProjectByOwner(this.userApp)
                                                                              .subscribe(projects => {
                                                                                this.projectsApp = projects;
                                                                                console.log(this.projectsApp);
                                                                                this.allstartdates = [];
                                                                                this.allenddates = [];
                                                                                this.projectsApp.forEach(project => {
                                                                                  this.allstartdates.push(new Date(project.start_date['seconds'] * 1000));
                                                                                  this.allenddates.push(new Date(project.end_date['seconds'] * 1000));
                                                                                  console.log(this.allstartdates);
                                                                                  console.log(this.allenddates);
                                                                                  this.activitiesProjectsApp = [];
                                                                                  this._projectService.getActivities(project).subscribe(activities => {
                                                                                    this.activitiesProjectsApp = activities;
                                                                                    this.activitiesProjectsApp.forEach(activity => {
                                                                                      this.tasksActivitiesApp = [];
                                                                                      this._projectService.getTasks(project.id, activity.id).subscribe( tasks => {
                                                                                        this.tasksActivitiesApp = tasks;
                                                                                        console.log(this.tasksActivitiesApp);
                                                                                      });
                                                                                    });
                                                                                    console.log(this.activitiesProjectsApp);
                                                                                  });
                                                                                });
                                                                                console.log(this.projectsApp);
                                                                              });
    });

   // this._projectService.setActivitiestoProject(this.projectAux, this.activityAux);
  }


  openNewProject(): void {
    const dialogRef = this.dialog.open(NewProjectModalComponent, {
      width: '700px',
      data: {name: this.name , delegate: this.delegate , chores:this.chores, userApp: this.userApp}
  });

    dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.name = result;
    this.delegate = result;
    this.chores = result;
  });

  }

  openProject(): void {
    this.router1.navigateByUrl('/project');
  }

  openActivities(): void {
    this.router.navigateByUrl('/activities');
  }



  }

@Component({
    selector: 'newProject-modal',
    templateUrl: './newProject-modal.component.html',
    styleUrls: ['./newProject-modal.component.css']
  })

  export class NewProjectModalComponent {

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

    startD: Date;
    endD: Date;
    minDate = new Date();

    teamsObservable: any;
    teamAux: Team = {
        manager: ''
    };
    userApp: User;

    constructor(
      public dialogRef: MatDialogRef<NewProjectModalComponent>,
      public _teamService: TeamService,
      public _projectService: ProjectService,
      public _authService: AuthService,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {

           this._authService.showUser(this._authService.userAuth).subscribe(user => {(this.projectApp.ownerId = user.id);
                                                                                     this._teamService.getTeamByUser(this.data.userApp)
            .subscribe(team => {
                this.teamsObservable = team;
                this.teamsObservable.map(a =>
                this.teamAux = a);
                this.teamAux.delegates = [];
                this._teamService.getDelegates(this.teamAux).subscribe(delegates => {
                this.teamAux.delegates = delegates;
            });
                this.projectApp.teamId = this.teamAux.id;
                console.log(this.teamAux);


                });
                                                                                      });
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onSaveProject( form: NgForm ) {

      if ( form.invalid ) { return; }

      if ( this.endD < this.startD ) {
          console.log('invalido');
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


      this._projectService.addNewProject( this.projectApp );


      Swal.close();


      Swal.fire({
          allowOutsideClick: false,
          type: 'success',
          title: 'Proyecto creado con exito'
        });
      }

      inputEvent($event) {
        this.startD = new Date($event.value);
      }

      inputEvent2($event) {
        this.endD = new Date($event.value);
      }


  }




