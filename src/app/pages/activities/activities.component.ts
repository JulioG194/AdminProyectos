import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.interface';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2/src/sweetalert2.js';

import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import { User } from 'src/app/models/user.interface';
import { TeamService } from '../../services/team.service';
import { Team } from 'src/app/models/team.interface';


export interface DialogData {
      activity: Activity;
      project: Project;
}

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

 /*  dialog: any; */

  test = true;
  empty = true;
  id: string;
  idActivity: string;
  team: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Alexa', 'Julio', 'Yeye', 'Anto'];
  /* tasks: string[] = [];
  tasks1: string[] = [];  */

  tasks: Task[] = [];

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

  post = true;
  post2 = true;
  activities: Activity [] = [];
  activityProject: Activity = {
    name: '',
    status: 'Por realizar',
    activity_time: 0
    };


  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private _projectService: ProjectService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this._projectService.getProject(this.id).subscribe(project => {
      this.projectApp = project;
      console.log(this.projectApp);
    /*   if ( !this.empty) {

    } */
    });

/*     if ( this.empty === false ) {
          this._projectService.getTasks(this.projectApp, this.activityProject).subscribe(tasks => {
          this.tasks = tasks;
          console.log(this.tasks);
    });
    } */


  }

  openTask():void {
    const dialogRef = this.dialog.open(TaskComponent, {
    width: '700px',
    data: { activity: this.activityProject, project: this.projectApp }
  });

   /*  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed')
  }); */
    // console.log(this.activityProject);
  }

  onSaveActivity( form: NgForm ) {
    if ( form.invalid ) { return; }


    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this._projectService.setActivitiestoProject(this.projectApp.id, this.activityProject);
   // this.activityProject.id = this._projectService.idActivity;
    this.post = false;
    this.activities = [];
    this._projectService.getActivitybyName(this.activityProject, this.projectApp).subscribe(activities => {
          this.activities = activities;
          console.log(this.activities);
          this.activityProject.id = this.activities[0].id;
          this.empty = false;
          this._projectService.getTasks(this.projectApp.id, this.activityProject.id).subscribe(tasks => {
            this.tasks = tasks;
            console.log(this.tasks);
        });
    });
  //  this.empty = false;

    Swal.close();


    Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        title: 'Actividad guardada con exito, ahora puedes agregar tareas'
      });

  }
}

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit {

  task: Task = {
    name: '',
    status: 'Por realizar',
    delegate: null
    };

    team: Team;
    delegates: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _projectService: ProjectService,
    private _teamService: TeamService) {


    }

    ngOnInit() {
      console.log(this.data.activity.id);
      console.log(this.data.project.id);
      console.log(this.data.project.teamId);
      if ( this.data.project.teamId ) {
        this._teamService.getTeam(this.data.project.teamId).subscribe(team => {
        this.team = team;
        console.log(this.team);
        this._teamService.getDelegates(this.team).subscribe(delegates => {
          this.delegates = delegates;
        });
      });
      }
    }

    onSaveTask( form: NgForm ) {
      if ( form.invalid ) { return; }


      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      this._projectService.setTaskstoActivity(this.data.project, this.data.activity.id, this.task);

      Swal.close();


      Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Tarea agregada con exito'
        });

    }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
