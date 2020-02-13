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

export interface DialogData {
  project: Project;
  actId: string;
  delegatesG: User[];
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

  activities: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa','Clogs', 'Loafers', 'Moccasins', 'Sneakers','Alexa','Julio','Yeye','Anto',
                        'Sarita','Santo','Dani','Tere'];

  tasks: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa'];
  tasks1: string[]=[];

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
    delegate: ''
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
                                                                                                console.log(this.team);
                                                                                                this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                  this.delegates = delegates;
                                                                                                            });
      });
                                                                                                this._projectService.getActivities(this.projectApp).subscribe( activities => {
                                                                                                      this.activitiesProject = activities;
                                                                                                      console.log(this.activitiesProject);
                                                                                                      this.allstartdates = [];
                                                                                                      this.allenddates = [];
                                                                                                      this.activitiesProject.forEach(activity => {
                                                                                                        this.allstartdates.push(new Date(activity.start_date['seconds'] * 1000));
                                                                                                        this.allenddates.push(new Date(activity.end_date['seconds'] * 1000));
                                                                                                        // console.log(this.allstartdates);
                                                                                                        // console.log(this.allenddates);
                                                                                                        // this.activitiesProject = [];
                                                                                                        // tslint:disable-next-line:prefer-for-of
                                                                                                      });
                                                                                                      console.log(this.activitiesProject);
                                                                                                      // this.allstartdatesT = [];
                                                                                                      // this.allenddatesT = [];
                                                                                                      // tslint:disable-next-line:prefer-for-of
                                                                                                      for (let i = 0; i < this.activitiesProject.length; i++) {
                                                                                                              this._projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id).subscribe(tasks => {
                                                                                                                 this.activitiesProject[i].tasks = tasks;
                                                                                                                 // tslint:disable-next-line:prefer-for-of
                                                                                                                 for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                                                                                                     this.activitiesProject[i].tasks[j].start_date = new Date(this.activitiesProject[i].tasks[j].start_date['seconds'] * 1000);
                                                                                                                     this.activitiesProject[i].tasks[j].end_date = new Date(this.activitiesProject[i].tasks[j].end_date['seconds'] * 1000);
                                                                                                                 }
                                                                                                                 /* this.activitiesProject[i].tasks.forEach(task => {
                                                                                                                   console.log(task);
                                                                                                                   this.allstartdatesT.push(new Date(task.start_date['seconds'] * 1000));
                                                                                                                   this.allenddatesT.push(new Date(task.end_date['seconds'] * 1000));
                                                                                                                   console.log(this.allenddatesT);
                                                                                                                 }); */
                                                                                                                 console.log(tasks);
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

  imprime(){
    console.log(this.idActivity);
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
  delegate: '',
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
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

