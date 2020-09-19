import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2/src/sweetalert2.js';
// import { UserService } from '../../services/users.service';
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

import { EvidenceService } from '../../services/evidence.service';
import { Evidence } from '../../models/evidence.interface';

export interface DialogData {
  projectAppId: string;
  minDate: Date;
  maxDate: Date;
  userApp: User;
}

export interface EvidenceData {
  tid: string;
  user: User;
}

export interface PAT {
  project: Project;
  activity: Activity;
  task: Task;
  start_date: Date;
  end_date: Date;
  photoURL?: string;
  manager_name?: string;
}

/* export interface DialogDataActivities {
  projectAppId: string;
} */

export interface StringDate {
  name: string;
  delegate: string;
  chores: string; // tareas
}
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
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
        displayName: '',
        email: '',
        password: '',
        uid: '',
        birthdate: new Date(),
        description: '',
        gender: '',
        photoURL: ''
    };



  projectsApp: Project[] = [];
  activitiesProjectsApp: Activity[] = [];
  tasksActivitiesApp: Task[] = [];
  tasksActivitiesApp1: Task[] = [];
  projectsOfDelegate: Project[] = [];
  activitiesDelegate: Activity[] = [];
  projectsOfDelegate1: Project[] = [];
  activitiesDelegate1: Activity[] = [];
  tasksDelegate: Task[] = [];

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

  pats: PAT[] = [];
  pats1: PAT[] = [];
  pat: PAT = {
    project: null,
    activity: null,
    task: null,
    start_date: null,
    end_date: null,
    photoURL: ''
  };
  value = '';

  ngOnInit() {
    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user, this.idUser = user.uid);
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
                                                                                    let aux5: number;
                                                                                    let aux1: number;
                                                                                    let status: string;
                                                                                    let countRND = 0;
                                                                                    let countRD = 0;
                                                                                    let countPR = 0;
                                                                                    let max = 0;
                                                                                    let statusP: string;
                                                                                    let countPRND = 0;
                                                                                    let countPRD = 0;
                                                                                    let countPPR = 0;
                                                                                    this.projectService.getActivities(this.projectsApp[index]).subscribe(acts => {
                                                                                        let aux8 = 0;
                                                                                        countPRND = 0;
                                                                                        countPRD = 0;
                                                                                        countPPR = 0;
                                                                                        this.activitiesProjectsApp = acts;
                                                                                        numeroActs = this.activitiesProjectsApp.length;
                                                                                        porcentajeActividad = 100 / numeroActs;
                                                                                        aux6 = 100 / numeroActs;
                                                                                        for (let activity of this.activitiesProjectsApp) {
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
                                                                                          if ((countPRND >= countPRD) && (countPRND >=  countPPR)) {
                                                                                            statusP = 'Realizando';
                                                                                        } else if ((countPRD >= countPRND) && (countPRD >= countPPR)) {
                                                                                          statusP = 'Realizado';
                                                                                          } else {
                                                                                            statusP = 'Por Realizar';
                                                                                        }
                                                                                        }

                                                                                        // tslint:disable-next-line:prefer-for-of
                                                                                        for (let j = 0; j < this.activitiesProjectsApp.length; j++) {
                                                                                          aux7 = this.activitiesProjectsApp[j].percentaje * aux6;
                                                                                          aux8 += aux7;
                                                                                          this.projectService.getTasks(this.activitiesProjectsApp[j].idProject, this.activitiesProjectsApp[j].id).subscribe(tasks => {
                                                                                               let aux2 = 0;
                                                                                               countRND = 0;
                                                                                               countRD = 0;
                                                                                               countPR = 0;
                                                                                               this.tasksActivitiesApp = tasks;
                                                                                               if ( this.tasksActivitiesApp.length === 0 ) {
                                                                                                try {
                                                                                                  this.projectService.setActivityProgress(this.projectsApp[index].id, this.activitiesProjectsApp[j].id, 0 );
                                                                                                 } catch {}
                                                                                               } else {
                                                                                               numeroTasks = this.tasksActivitiesApp.length;
                                                                                               porcentajeTask = 100 / numeroTasks;
                                                                                               // tslint:disable-next-line:prefer-for-of
                                                                                               for (let k = 0; k < this.tasksActivitiesApp.length; k++) {
                                                                                                 aux1 = this.tasksActivitiesApp[k].progress * porcentajeTask;
                                                                                                 aux2 += aux1;
                                                                                                 aux3 = aux2 / 100;
                                                                                                 aux4 = +(aux3.toFixed(2));
                                                                                                 id = this.tasksActivitiesApp[k].idActivity;
                                                                                               }

                                                                                               for (let task of this.tasksActivitiesApp) {
                                                                                                if (task.status === 'Por Verificar') {
                                                                                                  status = 'Por Verificar';
                                                                                                  break;
                                                                                                } else if ( task.status === 'Realizando' ) {
                                                                                                  status = 'Realizando';
                                                                                                  break;
                                                                                                } else {
                                                                                                  status = '';
                                                                                                  if (task.status === 'Realizado') {
                                                                                                    countRD++;
                                                                                                  } else if (task.status === 'Por Realizar') {
                                                                                                   countPR++;
                                                                                                }
                                                                                                }
                                                                                                // status = '';
                                                                                                  /* if (task.status === 'Realizando') {
                                                                                                    // countRND++;
                                                                                                    status = 'Realizando';
                                                                                                    break;
                                                                                                  } else 
                                                                                              }

                                                                                               if (status !== 'Por Verificar') {
                                                                                               /*  if ((countRND >= countRD) && (countRND >=  countPR)) {
                                                                                                  status = 'Realizando';
                                                                                              } else */ 
                                                                                                if (/* (countRD >= countRND) && */ (countRD > countPR)) {
                                                                                                status = 'Realizado';
                                                                                                } else {
                                                                                                  status = 'Por Realizar';
                                                                                              }
                                                                                              }
                                                                                               try {
                                                                                                  this.projectService.setActivityProgress(this.projectsApp[index].id, id, aux4 );
                                                                                                  this.projectService.setStatusActivity(this.projectsApp[index].id, id, status);
                                                                                                 } catch {}
                                                                                               }
                                                                                           });
                                                                                        }
                                                                                        aux9 = +((aux8 / 100).toFixed(2));
                                                                                        try {
                                                                                          this.projectService.setProjectProgress( this.projectsApp[index].id , aux9 );
                                                                                          // this.projectService.setStatusProject(this.projectsApp[index].id, statusP);
                                                                                         } catch {}
                                                                                    });


                                                                                    this.allstartdates = [];
                                                                                    this.allenddates = [];
                                                                                    this.projectsApp.forEach(project => {
                                                                                    this.allstartdates.push(new Date(project.start_date['seconds'] * 1000));
                                                                                    this.allenddates.push(new Date(project.end_date['seconds']* 1000));
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
                                                                                }});
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
                                                                                                         let userAux: User = {
                                                                                                          displayName: '',
                                                                                                          email: '',
                                                                                                          photoURL: '',
                                                                                                          uid: ''
                                                                                                      };
                                                                                                         this.authService.getUserById(project.ownerId).subscribe( user => {
                                                                                                            userAux = user;
                                                                                                         // console.log(this.allstartdates);
                                                                                                         // console.log(this.allenddates);

                                                                                                        // this.activitiesProjectsApp = [];
                                                                                                            this.projectService.getActivities(project).subscribe(activities => {
                                                                                                           this.activitiesProjectsApp = activities;
                                                                                                           console.log(this.activitiesProjectsApp);
                                                                                                           this.activitiesProjectsApp.forEach(activity => {
                                                                                                            // this.tasksActivitiesApp = [];
                                                                                                           //  this.activitiesDelegate = [];
                                                                                                          //   this.projectsOfDelegate = [];
                                                                                                             this.projectService.getTasks(project.id, activity.id).subscribe( tasks => {
                                                                                                               console.log(tasks);
                                                                                                               tasks.forEach(task => {

                                                                                                                 if ( task.delegate.email === this.userApp.email ) {
                                                                                                                  if ( task.idActivity === activity.id) {
                                                                                                                    if ( activity.idProject === project.id ) {

                                                                                                                      // tslint:disable-next-line:no-shadowed-variable

                                                                                                                           this.pat = {
                                                                                                                            project,
                                                                                                                            activity,
                                                                                                                            task,
                                                                                                                            start_date: new Date(task.start_date['seconds'] * 1000),
                                                                                                                            end_date: new Date(task.end_date['seconds'] * 1000),
                                                                                                                            photoURL : userAux.photoURL,
                                                                                                                            manager_name: userAux.displayName
                                                                                                                          };
                                                                                                                           this.pats.push(this.pat);

                                                                                                                           console.log(this.pat);

                                                                                                                  }
                                                                                                                }
                                                                                                             }
                                                                                                               });
                                                                                                               this.tasksActivitiesApp1 = [];
                                                                                                               this.activitiesDelegate1 = [];
                                                                                                               this.projectsOfDelegate1 = [];
                                                                                                               this.pats1 = [];
                                                                                                               this.removeDuplicates();

                                                                                                               console.log(this.pats1);
                                                                                                               /* console.log(this.tasksActivitiesApp1);
                                                                                                               console.log(this.activitiesDelegate1);
                                                                                                               console.log(this.projectsOfDelegate1); */
                                                                                                             });
                                                                                                           });
                                                                                                         //  console.log(this.activitiesProjectsApp);
                                                                                                         });
                                                                                                       });
                                                                                                     //  console.log(this.projectsApp);
                                                                                                    });
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

  removeDuplicates() {
    const uniqueObject = {};
    // tslint:disable-next-line:forin
    for (const i in this.pats) {
        const objId = this.pats[i].task.id;
        uniqueObject[objId] = this.pats[i];
    }

    // tslint:disable-next-line:forin
    for (const i in uniqueObject) {
        this.pats1.push(uniqueObject[i]);
    }
    try {
      this.pats1.sort((a, b) => a.task.createdAt.seconds - b.task.createdAt.seconds);
      this.pats1.forEach(chat => {
      });
    } catch {}
  }

  onEnter(idP: string, idA: string, idT: string, value: string) {
    this.value = value;
    if ( +this.value > 0 && +this.value <= 100) {
      this.projectService.setTaskProgress(idP, idA, idT, +(this.value));
    } else {
      console.log('numero ingresado incorrecto');
    }
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

  openEvidence( taskid: string  ): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open( EvidenceModalComponent, {
      width: '800px',
      data: { tid: taskid, user: this.userApp }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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
      console.log('The dialog was closed');
    });
  }

  onDeleteProject( idProject: string ) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar el proyecto!'
    }).then((result) => {
      if (result.value) {
        this.projectService.deleteProject(idProject);
        Swal.fire(
          'Listo!',
          'Tu proyecto ha sido eliminado.',
          'success'
        );
      }
    });

  }
  }

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'newProject-modal',
    templateUrl: './newProject-modal.component.html',
    styleUrls: ['./newProject-modal.component.scss']
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
        progress: 0,
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

      this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.projectApp.ownerId = user.uid);
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
            icon: 'error',
            title: 'Fechas fuera de rango',
          });
          return;
      }

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();


      this.projectService.addNewProject( this.projectApp );

      Swal.close();
      Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
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
      delegate: null
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
            icon: 'error',
            title: 'Fechas fuera de rango',
          });
          return;
      }

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      this.projectService.setActivitiestoProject( this.id, this.activityProject );

      Swal.close();
      Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Actividad agregada con exito'
        });

      this.dialogRef.close();
    }
  }

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'evidence-modal',
    templateUrl: './evidence-modal.component.html',
    styleUrls: ['./evidence-modal.component.css']
  })

  export class EvidenceModalComponent implements OnInit {

    tid: string;
    uid: User;
    fileToUpload: File = null;
    filesToUpload: File [] = [];
    fileToUploadFirebase: Evidence = {
        file: null,
        fileName: '',
        url: '',
        isUploading: false,
        progress: 0,
        type: '',
        size: 0
    };
    filesToUploadFirebase: Evidence [] = [];
    // archivo: FileItem = null;
    constructor(
      public dialogRef: MatDialogRef<EvidenceModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: EvidenceData,
      private evidenceService: EvidenceService) { }

    ngOnInit() {
      this.tid = this.data.tid;
      this.uid = this.data.user;
      console.log(this.uid);
    }

    handleFileInput(files: FileList) {

        for (let index = 0; index < files.length; index++) {
          let evidence: Evidence = {
              file: files.item(index),
              fileName: files.item(index).name,
              size: files.item(index).size,
              type: files.item(index).type,
              tid: this.tid
          };
          this.filesToUploadFirebase.push(evidence);
          // this.filesToUpload.push(files.item(index));
        }
        // console.log(this.filesToUpload);
        console.log(this.filesToUploadFirebase);
       /*   */
  }

  onUpdateFiles() {
    this.evidenceService.uploadFilesFirebase(this.filesToUploadFirebase, this.uid, this.tid);
  }

  onClearFiles() {
    this.filesToUploadFirebase = [];
  }



}




