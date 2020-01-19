import { Component, OnInit, Inject } from '@angular/core';
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

export interface DialogData {

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

activitiesProject: Activity[] = [];
tasksActivity: Task[] = [];
differenceTime: number;
differenceDays: number;

  constructor( private route: ActivatedRoute,
               private _projectService: ProjectService,
               private router: Router,
               private router1: Router,
               public dialog: MatDialog,
               public _teamService: TeamService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
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
       this.tasksActivity = tasks;
     //  console.log(this.tasksActivity);
     });
  }

  getTask( id: string) {
    this.post5 = false;
    this._projectService.getTask(this.projectApp, this.activityProject, id).subscribe(task => {
      this.taskActivity = task;
    });
  }

  openTask(): void {
    const dialogRef = this.dialog.open( TaskComponent1, {
    width: '700px',
    data: {}
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
team :  Team[] =[]
  constructor(
    public dialogRef: MatDialogRef<TaskComponent1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

