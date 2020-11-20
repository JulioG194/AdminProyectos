import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import  Swal  from 'sweetalert2/src/sweetalert2.js';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { TeamService } from '../../services/team.service';
import { Team } from 'src/app/models/team.interface';
import { Activity } from '../../models/activity.interface';
import { Task } from '../../models/task.interface';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { EvidenceService } from '../../services/evidence.service';
import { Evidence } from '../../models/evidence.interface';
import { NewProjectModalComponent } from '../../components/newProject/newProject-modal.component';
import { EditProjectModalComponent } from '../../components/editProject/editProject-modal.component';
import { untilDestroyed } from '@orchestrator/ngx-until-destroyed';
import { OpenEvidenceDelegateModalComponent } from 'src/app/components/openEvidenceDelegate/openEvidenceDelegate-modal.component';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  constructor( public authService: AuthService,
               public projectService: ProjectService,
               public teamService: TeamService,
               public dialog: MatDialog
               ) { }

  team: string[] = [];
  userApp: User;
  delegates: User[] = [];
  isLoading = true;
  isLoadingTeam = true;
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
  allstartdates: Date[] = [];
  allenddates: Date[] = [];

  tskDelegate: any;
  tskDelegates: any[] = [];

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

  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  teamGugoAux: Team = {
    manager: ''
  };
  teamGugo: Team = {
    manager: ''
  };

  value = '';

  ngOnInit() {
    this.userApp = this.authService.userAuth;
    this.isLoading = true;
    if (this.userApp.manager === true) {
        this.getProjects();
        this.getDelegates();
    }

    if (this.userApp.manager === false) {
        this.getTasksDelegate();
    }
  }

  ngOnDestroy() {}


  openNewProject() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';

  const dialogRef = this.dialog.open(NewProjectModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
          const newProject: Project = {
            name: data.name as string,
            client: data.client as string,
            description: data.description as string,
            startDate: data.startDate as Date,
            endDate: data.endDate as Date,
            type: data.typeProj as string,
            ownerId: this.authService.userAuth.uid,
          };
          if (newProject.name) {
            this.projectService.addProject(newProject);
            Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Proyecto agregado con exito'
          });
          }
        },
  );
  }

  openEditProject(project: Project) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';
  dialogConfig.data = {
    project
  };

  const dialogRef = this.dialog.open(EditProjectModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
          const newProject: Project = {
            name: data.name as string,
            client: data.client as string,
            description: data.description as string,
            endDate: data.endDate as Date,
            type: data.typeProj as string,
            id: project.id
          };

          if (newProject.name) {
            this.projectService.updateProject(newProject);
            Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'actividad editada con exito'
          });
          }
        },
  );
  }



  getProjects() {
    const user = this.authService.userAuth;
    this.projectService.getProjectByOwner(user)
                        .pipe(untilDestroyed(this))
                        .subscribe(projects => {
                          projects.map(project => {
                            project.startDate = new Date(project.startDate['seconds'] * 1000);
                            project.endDate = new Date(project.endDate['seconds'] * 1000);
                          });
                          this.projectsApp = projects;
                          this.isLoading = false;
                        });
  }

  getDelegates() {
    const {uid} = this.authService.userAuth;
    this.teamService.getDelegatesId(uid).pipe(untilDestroyed(this)).subscribe(delegates => {
      this.delegates = delegates;
      this.isLoadingTeam = false;
    });
  }

  getTasksDelegate() {
    const {uid} = this.authService.userAuth;
    this.projectService.getTasksDelegates(uid).pipe(untilDestroyed(this)).subscribe(resp => {
      this.tskDelegates = [];
      resp.map(r => {
         const {project, activity, taskId} = r;
         this.projectService.getTask(project.id, activity.id, taskId).subscribe(tsk => {
             tsk.startDate =  new Date(tsk.startDate['seconds'] * 1000);
             tsk.endDate =  new Date(tsk.endDate['seconds'] * 1000);
             const obj = {
              ...r,
              tsk
            };
             this.tskDelegates.push(obj);
         });
      });
      this.isLoading = false;
      }
      );
  }

  updateTskProg(projectId: string, activityId: string, taskId: string, progress: number) {
    this.projectService.updateTaskProgress(projectId, activityId, taskId, progress).subscribe(data => console.log(data));
  }


  onDeleteProject( projectId: string ) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar el proyecto!'
    }).then((result) => {
      if (result.value) {
        this.projectService.deleteProject(projectId);
        Swal.fire(
          'Listo!',
          'Tu proyecto ha sido eliminado.',
          'success'
        );
      }
    });
  }

  openEvidenceDelegate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '650px';
    dialogConfig.panelClass = 'custom-dialog2';
    dialogConfig.data = {
      delegates: this.delegates
    };
    this.dialog.open(OpenEvidenceDelegateModalComponent, dialogConfig);
    }
    
  }

// @Component({
//     // tslint:disable-next-line:component-selector
//     selector: 'evidence-modal',
//     templateUrl: './evidence-modal.component.html',
//     styleUrls: ['./evidence-modal.component.css']
//   })

//   export class EvidenceModalComponent implements OnInit {

//     tid: string;
//     uid: User;
//     fileToUpload: File = null;
//     filesToUpload: File [] = [];
//     fileToUploadFirebase: Evidence = {
//         file: null,
//         fileName: '',
//         url: '',
//         isUploading: false,
//         progress: 0,
//         type: '',
//         size: 0
//     };
//     filesToUploadFirebase: Evidence [] = [];
//     // archivo: FileItem = null;
//     constructor(
//       public dialogRef: MatDialogRef<EvidenceModalComponent>,
//       @Inject(MAT_DIALOG_DATA) public data: EvidenceData,
//       private evidenceService: EvidenceService) { }

//     ngOnInit() {
//       this.tid = this.data.tid;
//       this.uid = this.data.user;
//       console.log(this.uid);
//     }

//     handleFileInput(files: FileList) {

//         for (let index = 0; index < files.length; index++) {
//           let evidence: Evidence = {
//               file: files.item(index),
//               fileName: files.item(index).name,
//               size: files.item(index).size,
//               type: files.item(index).type,
//               tid: this.tid
//           };
//           this.filesToUploadFirebase.push(evidence);
//           // this.filesToUpload.push(files.item(index));
//         }
//         // console.log(this.filesToUpload);
//         console.log(this.filesToUploadFirebase);
//        /*   */
//   }

//   onUpdateFiles() {
//     this.evidenceService.uploadFilesFirebase(this.filesToUploadFirebase, this.uid, this.tid);
//   }

//   onClearFiles() {
//     this.filesToUploadFirebase = [];
//   }
// }




