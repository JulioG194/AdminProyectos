import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.interface';
import { ProjectService } from '../../services/project.service';
import { Activity } from '../../models/activity.interface';
import { Task } from '../../models/task.interface';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamService } from '../../services/team.service';
import { Team } from 'src/app/models/team.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase/app';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Evidence } from '../../models/evidence.interface';
import { EvidenceService } from '../../services/evidence.service';

export interface DialogData1 {
  project: Project;
  actId: string;
  delegatesG: User[];
}


export interface DialogData {
  projectAppId: string;
  minDate: Date;
  maxDate: Date;
  userApp: User;
}

export interface DialogData2 {
  taskId: string;
}




@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  post = true;
  post1 = true;
  post2 = true;
  post3 = true;
  post4 = true;
  post5 = true;
  edit = true;

  open = true;
  open1 = true;
  open2 = true;
  open3 = true;

  validate = true;

  panelOpenState = false;


 // delegates: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa'];

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
  name: '',
  email: '',
  password: '',
  id: '',
  birthdate: new Date(),
  description: '',
  gender: '',
  photo: ''
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

aux7: number;


  constructor( private route: ActivatedRoute,
               private _projectService: ProjectService,
               private authService: AuthService,
               private router: Router,
               private router1: Router,
               public dialog: MatDialog,
               public _teamService: TeamService,
               private datepipe: DatePipe) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
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
                                                                                                                     this.activitiesProject[i].tasks[j].end_date = new Date(this.activitiesProject[i].tasks[j].end_date['seconds'] * 1000);
                                                                                                                    }
                                                                                                        });
                                                                                                        }
      });
    });
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

  backProjects(): void {
    this.router.navigateByUrl('/projects');
  }

  openActivity(): void {
    this.router1.navigateByUrl('/activities');
  }

  imprime() {
    console.log(this.idActivity);
  }

  deleteActivity( id: string ) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar la actividad!'
    }).then((result) => {
      if (result.value) {
        this._projectService.deleteActivity(this.projectApp.id, id);
        Swal.fire(
          'Listo!',
          'Tu actividad ha sido eliminada.',
          'success'
        );
      }
    });
  }

  deleteTask( activityId: string, taskId: string ) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar la actividad!'
    }).then((result) => {
      if (result.value) {
        this._projectService.deleteTask(this.projectApp.id, activityId, taskId );
        Swal.fire(
          'Listo!',
          'Tu actividad ha sido eliminada.',
          'success'
        );
      }
    });
  }

  getActivities() {
   // this._projectService.getTasks()

  }

  getActivity( id: string) {
     this.idActivity = id;
     this.post4 = false;
    // this.post = !this.post;
     this.activityProject.id = id;
     console.log(this.activityProject);
     this._projectService.getActivity(this.projectApp.id, this.activityProject.id).subscribe(activity => {
        this.activityProject = activity;
        console.log(this.activityProject);
     });
     this._projectService.getTasks(this.projectApp.id, this.activityProject.id).subscribe(tasks => {
      // this.tasksActivity = tasks;
     //  console.log(this.tasksActivity);
     });
  }

  getTask( id: string) {
    this.post5 = false;
    this._projectService.getTask(this.projectApp, this.activityProject, id).subscribe(task => {
      this.taskActivity = task;
      console.log(this.taskActivity);

    });
  }

  openTask( id: string ): void {
    const dialogRef = this.dialog.open( TaskComponent1, {
    width: '600px',
    data: { project: this.projectApp, actId: id, delegatesG: this.delegates }
  });

    dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });

  }

  openActivities( id: string, minDateF: Date, maxDateF: Date ): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open( ActivitiesModalComponent1, {
      width: '600px',
      data: {  projectAppId: id, minDate: minDateF, maxDate: maxDateF  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    });
  }

  openEvidence( tId: string ): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open( EvidenceModalComponent1, {
      width: '800px',
      data: { taskId: tId  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    });
  }
}

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})


export class TaskComponent1 {

task: Task = {
  name: '',
  status: 'Por realizar',
  delegate: null,
  progress: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };


  startD: Date;
  endD: Date;

  minD: Date;
  maxD: Date;

  activityAux: Activity = {
    name: '',
    status: '',
    start_date: this.minD,
    end_date: this.maxD,
    activity_time: 0
  };

  constructor(
    public dialogRef: MatDialogRef<TaskComponent1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData1,
    private projectService: ProjectService) {
      this.projectService.getActivity(this.data.project.id, this.data.actId).subscribe(act => {
        this.activityAux = act;
        console.log(this.activityAux);
        this.minD = new Date(this.activityAux.start_date['seconds'] * 1000);
        this.maxD = new Date(this.activityAux.end_date['seconds'] * 1000);
      });
    }

 /*  onNoClick(): void {
    this.dialogRef.close();
  } */

  onSaveTask( form: NgForm ) {

    if ( form.invalid ) { return; }

    if ( this.endD < this.startD ) {

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


    this.projectService.setTaskstoActivity( this.data.project, this.data.actId, this.task );

    Swal.close();
    Swal.fire({
        allowOutsideClick: false,
        type: 'success',
        title: 'Tarea asignada con exito'
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

export class ActivitiesModalComponent1 implements OnInit {

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
    public dialogRef: MatDialogRef<ActivitiesModalComponent1>,
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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'evidence-modal',
  templateUrl: './evidence-modal.component.html',
  styleUrls: ['./evidence-modal.component.css']
})

// tslint:disable-next-line:component-class-suffix
export class EvidenceModalComponent1 implements OnInit {

  /* evidences: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa','Clogs', 'Loafers', 'Moccasins', 'Sneakers','Alexa','Julio','Yeye','Anto',
                        'Sarita','Santo','Dani','Tere','Boots', 'Yeye','Pedro', 'Juli','Alexa','fin']; */

  evidences: Evidence[];
  constructor(
    public dialogRef: MatDialogRef<EvidenceModalComponent1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData2,
    private evidenceService: EvidenceService) { }

  ngOnInit() {
      console.log(this.data.taskId);
      this.evidenceService.getEvidences(this.data.taskId).subscribe(evids => {
        this.evidences = evids;
        console.log(this.evidences);
      });
      // this.getEvidences();
  }

  getEvidences() {
      this.evidenceService.getEvidences(this.data.taskId).subscribe(evids => {
        this.evidences = evids;
      });
  }

  downloadFile(url: string) {
      window.open(url, '_blank');
  }

}
