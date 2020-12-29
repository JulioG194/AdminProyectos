import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { User } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Team } from 'src/app/models/team.interface';

import Swal from 'sweetalert2/src/sweetalert2.js';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import * as _ from 'lodash';
import { last, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TasksComponent } from '../tasks/tasks.component';
import { untilDestroyed } from '@orchestrator/ngx-until-destroyed';
import { OpenResourceModalComponent } from 'src/app/components/openResource/openResource-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit, OnDestroy {

  usersApp: User[] ;
  usersAppFilter: User[] = [];
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
  selectedUsersPlus: User[] = [];
  teams: Team[] = [];
  delegates: User[] = [];
  isLoading: boolean;
  managers: User[] = [];
  partners: User[] = [];
  partnersAll: User[] = [];
  projectsTeam: Project[] = [];
  numbersTasks = 0;

  userGugo: User = {
    displayName: '',
    email: '',
    password: '',
    uid: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photoURL: '',
    manager: false,
    phoneNumber: ''
  };

  teamsObservable: any;
  teamGugo: Team = {
    manager: ''
  };
  teamUserGugo: Team = {
    delegates: this.delegates
  };

  post = true;

  teamUsersDelegate: User[] = [];
  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  delegatesAux: User[] = [];
  delegatesAux1: User[] = [];
  // managers: string[] = [];
  managerAux: User = {
      displayName: '',
      email: '',
      uid: ''
  };
  delegateAux: User = {
    displayName: '',
    email: '',
    uid: ''
};
delegateAux1: User = {
  displayName: '',
  email: '',
  uid: ''
};
subscrp: Subscription;

teamId: string;
getDelTsk: Subscription;
numberT: number;
  //dialog: any;


  constructor( private teamService: TeamService,
               private authService: AuthService,
               private projectService: ProjectService,
               public dialog: MatDialog ) { }

onGroupsChange(selectedUsers: User[]) {
  this.selectedUsers = selectedUsers;

}

onGroupsChangePlus(selectedUsersPlus: User[]) {
  this.selectedUsersPlus = selectedUsersPlus;

}

async addNewTeam() {
  if ( this.selectedUsers.length > 0) {
    try {
      await this.teamService.setTeamtoUser(this.userGugo, this.selectedUsers);
      Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Guardado con exito',
        });
    } catch (error) {
      Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: error,
        });
    }
  } else {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'warning',
      text: 'No se han seleccionado personas para tu equipo'
    });
  }
}

updateTeam() {
  if ( this.selectedUsersPlus.length > 0) {
    this.teamService.addDelegates(this.teamGugo, this.selectedUsersPlus);
  } else {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'warning',
      text: 'No se han seleccionado personas para tu equipo'
    });
  }
  this.post = !this.post;
}


  ngOnInit() {
    this.isLoading = true;
    this.userGugo = this.authService.userAuth;
    if (this.userGugo.manager) {
        if (this.userGugo.company) {
            this.getLocalCompany();
            this.getProjectsTeam();
        } else {
            console.log('no pertence a una empresa');
            this.getDelegatesUncompany();
            this.getProjectsTeam();
        }
    } else {
      if (this.userGugo.company) {
          this.getTeamDelegate();
          this.getProjectsTasks();
      } else {
        console.log('no pertence a una empresa');
        this.getTeamDelegate();
      }
    }
  }

  ngOnDestroy() { }

  getLocalCompany() {
    this.userGugo = this.authService.userAuth;
    this.teamService.getUsersCompany(this.userGugo.company.id).pipe(untilDestroyed(this)).subscribe(users => {
     const usersGugoArray = _.reject(users, {uid: this.userGugo.uid});
     this.teamService.getTeamByUser(this.userGugo).pipe(untilDestroyed(this)).subscribe(teams => {
       if (teams.length > 0) {
         const {id} = _.head(teams);
         this.teamId = id;
         this.teamService.getDelegatesId(this.teamId).pipe(untilDestroyed(this)).subscribe(delegates => {
         this.usersGugo = _.xorBy(usersGugoArray, delegates, 'uid');
         this.teamGugo.delegates = delegates;
         this.isLoading = false;
        });
       } else {
         this.usersGugo = usersGugoArray;
         this.isLoading = false;
       }
    });
    });
  }

  getProjectsTeam() {
    this.userGugo = this.authService.userAuth;
    this.projectService.getProjectByOwner(this.userGugo).pipe(untilDestroyed(this)).subscribe(projs => {
      this.projectsTeam = projs;
      this.projectsTeam.map(proj => {
        // proj.delegates = _.uniqBy(proj.delegates, 'uid');
        proj.delegates = [];
        this.projectService.getActivities(proj.id).subscribe(acts => {
          acts.map(act => {
            this.projectService.getTasks(proj.id, act.id).subscribe(tsks => {
              tsks.map(tsk => {
                proj.delegates.push(tsk.delegate);
                proj.delegates = _.uniqBy(proj.delegates, 'uid');
              });
            });
          });
        });
      });
    });
  }

  getProjectsTasks() {
    this.userGugo = this.authService.userAuth;
    this.projectService.getProjectsbyTasks(this.userGugo)
                        .pipe(untilDestroyed(this))
                        .subscribe(tsks => {
                           const taskes = _.uniqBy(tsks, 'project.id');
                           const projects: Project[] = [];
                           taskes.map(task => {
                             this.projectService
                                         .getProject(task.project.id)
                                         .subscribe(prj => {
                                            projects.unshift(prj);
                                            this.projectsTeam = _.uniqBy(projects, 'id');
                                            this.projectsTeam.map(proj => {
        // proj.delegates = _.uniqBy(proj.delegates, 'uid');
        proj.delegates = [];
        this.projectService.getActivities(proj.id).subscribe(acts => {
          acts.map(act => {
            this.projectService.getTasks(proj.id, act.id).subscribe(tskz => {
              tskz.map(tsk => {
                proj.delegates.push(tsk.delegate);
                proj.delegates = _.uniqBy(proj.delegates, 'uid');
              });
            });
          });
        });
      });
                                         });
                           });
                        });
  }

  getTeamDelegate() {
    this.authService.getUser(this.authService.userAuth).pipe(untilDestroyed(this)).subscribe(usr => {
        this.userGugo = usr;
        this.userGugo.teams.map(team => {
      this.managers = [];
      this.partners = [];
      this.teamService.getTeam(team).pipe(untilDestroyed(this)).subscribe(tm => {
        const user: User = {
          uid: tm.manager,
          email: tm.email,
          displayName: tm.displayName,
          employment: tm.employment,
          phoneNumber: tm.phoneNumber,
          photoURL: tm.photoURL
        };
        this.managers.push(user);
        this.teamService.getDelegatesId(team).pipe(untilDestroyed(this)).subscribe(del => {
          del.map(d => {
            this.partners.push(d);
          });
          const uniq = _.uniqBy(this.partners, 'uid');
          const withoutHost = _.reject(uniq, {uid: this.userGugo.uid});
          this.partnersAll = withoutHost;
        });
      });
    });
    });
  }

  getDelegatesUncompany() {
      this.userGugo = this.authService.userAuth;
      this.teamService.getDelegatesUncompany().pipe(untilDestroyed(this))
                                              .subscribe(usrs => {
              const arrayUsers = usrs.filter(usr => usr !== undefined);
              console.log(arrayUsers);
              this.teamService.getTeamByUser(this.userGugo)
                                .pipe(untilDestroyed(this)).subscribe(teams => {
                                      console.log(teams);
                                      if (teams.length > 0) {
                                       const {id} = _.head(teams);
                                       this.teamId = id;
                                       this.teamService.getDelegatesId(this.teamId)
                                                           .pipe(untilDestroyed(this))
                                                           .subscribe(delegates => {
                                                             this.usersGugo = _.xorBy(arrayUsers, delegates, 'uid');
                                                             this.teamGugo.delegates = delegates;
                                                             this.isLoading = false;
                                      });
                                      } else {
                                        this.usersGugo = arrayUsers;
                                        this.isLoading = false;
                                      }
              });
      });
  }


  removeDelegates(delegateId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, remover delegado!',
      showCloseButton: true,
    }).then((result) => {
      if (result.value) {
       this.authService.getUserOnce(delegateId).pipe(take(1)).
        subscribe(user => {
          if (user.assignedTasks > 0) {
            Swal.fire({
            allowOutsideClick: false,
            icon: 'warning',
            text: 'No se puede borrar al delegado, tiene tareas en proceso asignadas'
            });
          } else {
            this.teamService.deleteDelegate(this.teamId, delegateId);
            Swal.fire('Listo!', 'Delegado removido de tu equipo.', 'success');
          }
        });
      }
    });
  }

  openResources(projectId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '750px';
    // dialogConfig.height = '700px';
    dialogConfig.panelClass = 'custom-dialog2';
    dialogConfig.data = {
      // delegates: this.delegates
      user: this.userGugo,
      projectId
    };
    this.dialog.open(OpenResourceModalComponent, dialogConfig);
    }
}
