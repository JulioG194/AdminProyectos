import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.interface';
import { ProjectService } from '../../services/project.service';
import { Activity } from '../../models/activity.interface';
import { Task } from '../../models/task.interface';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TeamService } from '../../services/team.service';
import { Team } from 'src/app/models/team.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase/app';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Evidence } from '../../models/evidence.interface';
import { EvidenceService } from '../../services/evidence.service';
import { MatFormField, MatInput } from '@angular/material';
import { NewActivityModalComponent } from '../../components/newActivity/newActivity-modal.component';
import { NewTaskModalComponent } from '../../components/newTask/newTask-modal.component';
import { OpenEvidenceModalComponent } from '../../components/openEvidence/openEvidence-modal.component';
import { EditActivityModalComponent } from '../../components/editActivity/editActivity-modal.component';
import { EditTaskModalComponent } from '../../components/editTask/editTask-modal.component';
import { untilDestroyed } from '@orchestrator/ngx-until-destroyed';
import { OpenEvidenceDelegateModalComponent } from 'src/app/components/openEvidenceDelegate/openEvidenceDelegate-modal.component';

export interface DialogData1 {
  project: Project;
  actId: string;
  delegatesG: User[];
  taskId?: string;
  taskAux?: Task;
}

export interface DialogData {
  projectAppId: string;
  minDate: Date;
  maxDate: Date;
  userApp: User;
  idAct: string;
  actAux: Activity;
  dateS: Date;
  dateE: Date;
}

export interface DialogData2 {
  task: Task;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit, OnDestroy {

  post = true;
  post1 = true;
  post2 = true;
  post3 = true;
  post4 = true;
  post5 = true;
  edit = true;
  expand = false;
  isLoading = true;
  isLoadingProject = true;
  isLoadingActivities = true;
  delegates: User[] = [];
  open = true;
  open1 = true;
  open2 = true;
  open3 = true;
  newActivityId = '';

  validate = true;

  panelOpenState = false;

  projectApp: Project = {
    name: '',
    client: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    type: '',
    teamId: '',
    ownerId: '',
    status: 'To Do',
  };
  startD = new Date();
  endD = new Date();
  startDt = new Date();
  endDt = new Date();
  id: string;
  idActivity: string;
  minDate = new Date();
  maxDate = new Date();

  activityProject: Activity = {
    name: '',
    status: '',
    activity_time: 0,
  };

  taskActivity: Task = {
    name: '',
    status: '',
    delegate: null,
  };

  team: Team;
  tasksActivity: Task[][];
  activitiesProject: Activity[] = [];
  differenceTime: number;
  differenceDays: number;
  exp: boolean;
  userApp: User;
  allstartdates: Date[] = [];
  allenddates: Date[] = [];
  allstartdatesT: Date[] = [];
  allenddatesT: Date[] = [];
  activityAux: Activity = {
    name: '',
    status: '',
    startDate: null,
    endDate: null,
    activity_time: 0,
  };

  aux7: number;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private router1: Router,
    public dialog: MatDialog,
    public teamService: TeamService,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.id = this.route.snapshot.paramMap.get('id');
    this.panelOpenState = false;
    this.userApp = this.authService.userAuth;
    this.getProject(this.id);
    this.getDelegates();
  }

  ngOnDestroy() {
      // this.subscriptionGetProjects.unsubscribe();
      // this.subscriptionGetActivities.unsubscribe();
  }

  getProject(projectId: string) {
      this.projectService.getProject(projectId).pipe(untilDestroyed(this)).subscribe((project) => {
      this.isLoading = false;
      this.projectApp = project;
      this.projectApp.startDate = new Date(
        this.projectApp.startDate['seconds'] * 1000
      );
      this.projectApp.endDate = new Date(
        this.projectApp.endDate['seconds'] * 1000
      );
      // this.panelOpenState = false;
      this.isLoadingProject = false;
      this.projectService
        .getActivities(this.projectApp.id)
        .pipe(untilDestroyed(this))
        .subscribe((activities) => {
          activities.map(activity => {
                            activity.startDate = new Date(activity.startDate['seconds'] * 1000);
                            activity.endDate = new Date(activity.endDate['seconds'] * 1000);
                          });
          this.activitiesProject = activities;
          this.isLoadingActivities = false;
          for (let i = 0; i < this.activitiesProject.length; i++) {
            this.projectService
              .getTasks(this.projectApp.id, this.activitiesProject[i].id)
              .pipe(untilDestroyed(this))
              .subscribe((tasks) => {
                this.panelOpenState = true;
                this.activitiesProject[i].tasks = tasks;
                for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                  this.activitiesProject[i].tasks[j].startDate = new Date(
                    this.activitiesProject[i].tasks[j].startDate['seconds'] * 1000
                  );
                  this.activitiesProject[i].tasks[j].endDate = new Date(
                    this.activitiesProject[i].tasks[j].endDate['seconds'] * 1000
                  ); }
                // this.panelOpenState = true;
                // this.exp = true;
              }
              );
          }
        });
    });
  }

  openPanel(activityId: string) {
    this.newActivityId = activityId;
  }

  getDelegates() {
    const {uid} = this.authService.userAuth;
    this.teamService.getDelegatesId(uid).pipe(untilDestroyed(this)).subscribe(delegates => {
      this.delegates = delegates;
    });
  }

  openNewActivity() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';
  dialogConfig.data = {
    startDate: this.projectApp.startDate,
    endDate: this.projectApp.endDate,
  };

  const dialogRef = this.dialog.open(NewActivityModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(
        data => {
          const newActivity: Activity = {
            name: data.name as string,
            description: data.description as string,
            startDate: data.startDate as Date,
            endDate: data.endDate as Date,
          };
          if (newActivity.name) {
            this.newActivityId = this.projectService.setActivitiestoProject(this.projectApp.id, newActivity);
            // this.panelOpenState = false;
            this.expand = true;
            Swal.fire({
              allowOutsideClick: false,
              text: 'Actividad Agregada con Exito...Recargando Tabla...',
              timer: 2000,
              icon: 'success'
            });
            Swal.showLoading();
          }
        });
  }

  openEditActivity(activity: Activity) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';
  dialogConfig.data = {
    activity,
    startDate: this.projectApp.startDate,
    endDate: this.projectApp.endDate,
  };

  const dialogRef = this.dialog.open(EditActivityModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
          const newActivity: Activity = {
            name: data.name as string,
            description: data.description as string,
            startDate: data.startDate as Date,
            endDate: data.endDate as Date,
          };
          if (newActivity.name) {
            this.projectService.updateActivity(this.projectApp.id, activity.id, newActivity);
            Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Actividades Actualizadas',
            text: 'Actividad editada con éxito',
            confirmButtonText: 'Listo!',
            showCloseButton: true
          });
          }
        },
  );
  }

  openEditTask(task: Task, startDateAct: Date, endDateAct: Date, activityId: string) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';
  dialogConfig.data = {
    task,
    startDate: startDateAct,
    endDate: endDateAct,
    delegates: this.delegates
  };

  const dialogRef = this.dialog.open(EditTaskModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
          const newTask: Task = {
            name: data.name as string,
            description: data.description as string,
            startDate: data.startDate as Date,
            endDate: data.endDate as Date,
            delegate: data.delegateTask as User
          };
          if (newTask.name) {
            this.projectService.updateTask(this.projectApp.id, activityId, task.id, newTask);
            Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Tareas actualizadas',
            text: 'Tarea editada con éxito',
            showCloseButton: true,
            confirmButtonText: 'Listo!'
          });
          }
        },
  );
  }

  openNewTask(startDateAct: Date, endDateAct: Date, activityId: string) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';
  dialogConfig.data = {
    startDate: startDateAct,
    endDate: endDateAct,
    delegates: this.delegates
  };

  const dialogRef = this.dialog.open(NewTaskModalComponent, dialogConfig);


  dialogRef.afterClosed().subscribe(
        async (data) => {
          const newTask: Task = {
            name: data.name as string,
            description: data.description as string,
            startDate: data.startDate as Date,
            endDate: data.endDate as Date,
            delegate: data.delegateTask as User
          };
          if (newTask.name) {
            await this.projectService.setTaskstoActivity(this.projectApp.id, activityId, newTask);
            this.projectService.sendNotificationNewTask(this.userApp, newTask.delegate, newTask.name).subscribe(dat => console.log(dat));
            this.newActivityId = activityId;
            // this.panelOpenState = fals
            Swal.fire({
              allowOutsideClick: false,
              text: 'Tarea Agregada con Exito...Recargando Tabla...' ,
              icon: 'success',
              timer: 2000
            });
            Swal.showLoading();
          }
        });
  }

  openEvidence(projectId: string, activityId: string, taskId: string, delegate: User, taskName: string) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '750px';
  dialogConfig.panelClass = 'custom-dialog2';
  dialogConfig.data = {
    projectId,
    activityId,
    taskId,
    delegate,
    userGugo: this.userApp,
    taskName
  };


  this.dialog.open(OpenEvidenceModalComponent, dialogConfig);
  }

  editProject() {
    this.post1 = !this.post1;
    this.open = !this.open;
  }

  editActivity() {
    this.post2 = !this.post2;
    this.open1 = !this.open1;
  }

  editTask() {
    this.post3 = !this.post3;
    this.open2 = !this.open2;
  }

  backProjects() {
    this.router.navigateByUrl('/projects');
  }

  openActivity(): void {
    this.router1.navigateByUrl('/activities');
  }

  imprime() {
    console.log(this.idActivity);
  }

  deleteActivity(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar la actividad!',
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
        this.projectService.deleteActivityFn(this.projectApp.id, id).subscribe(data => {
          console.log(data);
          Swal.fire('Listo!', 'Tu actividad ha sido eliminada.', 'success');
        });
      }
    });
  }

  deleteTask(activityId: string, taskId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar la tarea!',
      showCloseButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.projectService.deleteTask(this.projectApp.id, activityId, taskId);
        Swal.fire('Listo!', 'Tu tarea ha sido eliminada.', 'success');
      }
    });
  }

  inputEvent($event) {
    this.startD = new Date($event.value);
  }

  inputEvent2($event) {
    this.endD = new Date($event.value);
  }

  saveEditproject(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.endD < this.startD) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas fuera de rango',
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
    });
    Swal.showLoading();

    this.projectService.updateProject(this.projectApp);
    this.post1 = !this.post1;
    this.open = !this.open;
    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: 'Proyecto editado con exito',
    });
  }

  getActivity(id: string) {
    this.idActivity = id;
    this.post4 = false;
    // this.post = !this.post;
    this.activityProject.id = id;
    console.log(this.activityProject);
    this.projectService
      .getActivity(this.projectApp.id, this.activityProject.id)
      .subscribe((activity) => {
        this.activityProject = activity;
        console.log(this.activityProject);
      });
    this.projectService
      .getTasks(this.projectApp.id, this.activityProject.id)
      .subscribe((tasks) => {
        // this.tasksActivity = tasks;
        //  console.log(this.tasksActivity);
      });
  }

  // getTask(id: string) {
  //   this.post5 = false;
  //   this.projectService
  //     .getTask(this.projectApp, this.activityProject, id)
  //     .subscribe((task) => {
  //       this.taskActivity = task;
  //       console.log(this.taskActivity);
  //     });
  // }

  // openEvidence(taskAux: Task): void {
  //   // tslint:disable-next-line: no-use-before-declare
  //   const dialogRef = this.dialog.open(EvidenceModalComponent1, {
  //     width: '1000px',
  //     data: { task: taskAux },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //   });
  // }

  // checkTask(idActivity: string, idTask: string, progressTask: number) {
  //   this.projectService.checkTask(
  //     this.projectApp.id,
  //     idActivity,
  //     idTask,
  //     progressTask
  //   );
  // }
}

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'tasks',
//   templateUrl: './tasks.component.html',
//   styleUrls: ['./tasks.component.css'],
// })

// // tslint:disable-next-line:component-class-suffix
// export class TaskComponent1 {
//   task: Task = {
//     name: '',
//     status: 'Por Realizar',
//     delegate: null,
//     progress: 0,
//     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//   };

//   startD: Date;
//   endD: Date;

//   minD: Date;
//   maxD: Date;

//   activityAux: Activity = {
//     name: '',
//     status: '',
//     // startDate: this.minD,
//     // endDate: this.maxD,
//     activity_time: 0,
//   };

//   constructor(
//     public dialogRef: MatDialogRef<TaskComponent1>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData1,
//     private projectService: ProjectService
//   ) {
//     console.log(this.data.project.id);
//     console.log(this.data.actId);
//     this.projectService
//       .getActivity(this.data.project.id, this.data.actId)
//       .subscribe((act) => {
//         this.activityAux = act;
//         console.log(this.activityAux);
//         console.log(this.data.delegatesG);
//         this.minD = new Date(this.activityAux.startDate['seconds'] * 1000);
//         this.maxD = new Date(this.activityAux.endDate['seconds'] * 1000);
//       });
//     if (this.data.taskAux != null) {
//       this.task = this.data.taskAux;
//     }
//   }

//   onSaveTask(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }

//     if (this.endD < this.startD) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Fechas fuera de rango',
//       });
//       return;
//     }

//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'info',
//       text: 'Espere por favor...',
//     });
//     Swal.showLoading();

//     // this.projectService.setTaskstoActivity(
//     //   this.data.project,
//     //   this.data.actId,
//     //   this.task
//     // );

//     Swal.close();
//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'success',
//       title: 'Tarea asignada con exito',
//     });

//     this.dialogRef.close();
//   }

//   onEditTask(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }

//     if (this.endD < this.startD) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Fechas fuera de rango',
//       });
//       return;
//     }

//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'info',
//       text: 'Espere por favor...',
//     });
//     Swal.showLoading();

//     this.projectService.updateTask(
//       this.data.project.id,
//       this.data.actId,
//       this.task.id,
//       this.task
//     );

//     Swal.close();
//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'success',
//       title: 'Tarea asignada con exito',
//     });

//     this.dialogRef.close();
//   }

//   inputEvent($event) {
//     this.startD = new Date($event.value);
//   }

//   inputEvent2($event) {
//     this.endD = new Date($event.value);
//   }
// }

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'activities-modal',
//   templateUrl: './activities-modal.component.html',
//   styleUrls: ['./activities-modal.component.css'],
// })
// export class ActivitiesModalComponent1 implements OnInit {
//   task: Task = {
//     name: '',
//     status: 'Por realizar',
//     delegate: null,
//   };

//   id: string;
//   maxD: Date;
//   minD: Date;
//   startD: Date;
//   endD: Date;

//   activityProject: Activity = {
//     name: '',
//     status: 'Por Realizar',
//     progress: 0,
//     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//   };

//   constructor(
//     public dialogRef: MatDialogRef<ActivitiesModalComponent1>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData,
//     private projectService: ProjectService
//   ) {
//     this.id = this.data.projectAppId;
//     this.maxD = this.data.maxDate;
//     this.minD = this.data.minDate;
//     if (this.data.actAux != null) {
//       this.activityProject = this.data.actAux;
//     }
//   }

//   ngOnInit() {}

//   inputEvent($event) {
//     this.startD = new Date($event.value);
//   }

//   inputEvent2($event) {
//     this.endD = new Date($event.value);
//   }

//   onSaveActivity(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }

//     if (this.endD <= this.startD) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Fechas fuera de rango',
//       });
//       return;
//     }

//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'info',
//       text: 'Espere por favor...',
//     });
//     Swal.showLoading();

//     this.projectService.setActivitiestoProject(this.id, this.activityProject);

//     Swal.close();
//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'success',
//       title: 'Actividad agregada con exito',
//     });

//     this.dialogRef.close();
//   }

//   onEditActivity(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }

//     if (this.endD <= this.startD) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Fechas fuera de rango',
//       });
//       return;
//     }

//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'info',
//       text: 'Espere por favor...',
//     });
//     Swal.showLoading();

//     this.projectService.updateActivity(
//       this.id,
//       this.activityProject.id,
//       this.activityProject
//     );

//     Swal.close();
//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'success',
//       title: 'Actividad agregada con exito',
//     });

//     this.dialogRef.close();
//   }
// }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'evidence-modal',
  templateUrl: './evidence-modal.component.html',
  styleUrls: ['./evidence-modal.component.css'],
})

// tslint:disable-next-line:component-class-suffix
export class EvidenceModalComponent1 implements OnInit {
  /* evidences: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa','Clogs', 'Loafers', 'Moccasins', 'Sneakers','Alexa','Julio','Yeye','Anto',
                        'Sarita','Santo','Dani','Tere','Boots', 'Yeye','Pedro', 'Juli','Alexa','fin']; */

  evidences: Evidence[];
  constructor(
    public dialogRef: MatDialogRef<EvidenceModalComponent1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData2,
    private evidenceService: EvidenceService
  ) {}

  ngOnInit() {
    console.log(this.data.task);
    this.evidenceService.getEvidences(this.data.task.id).subscribe((evids) => {
      this.evidences = evids;
      this.evidences.map((evid) => {
        evid.createdAt = new Date(evid.createdAt['seconds'] * 1000);
      });
      console.log(this.evidences);
    });
    // this.getEvidences();
  }

  getEvidences() {
    this.evidenceService.getEvidences(this.data.task.id).subscribe((evids) => {
      this.evidences = evids;
    });
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }
}
