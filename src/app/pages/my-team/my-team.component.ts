import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { User } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Team } from 'src/app/models/team.interface';

import Swal from 'sweetalert2/src/sweetalert2.js';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {

  usersApp: User[] ;
  usersAppFilter: User[] = [];
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
  selectedUsersPlus: User[] = [];
  teams: Team[] = [];
  delegates: User[] = [];

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

  // Variables Auxiliares
  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  delegatesAux: User[] = [];
  delegatesAux1: User[] = [];
  managers: string[] = [];
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

teamId: string;


  constructor( private teamService: TeamService,
               private authService: AuthService,
               private projectService: ProjectService ) { }

// Evento para agregar personas y formar un equipo
onGroupsChange(selectedUsers: User[]) {
  this.selectedUsers = selectedUsers;

}

// Evento para ampliar el equipo agregando mas personas
onGroupsChangePlus(selectedUsersPlus: User[]) {
  this.selectedUsersPlus = selectedUsersPlus;

}

// Metodo para crear un equipo
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
getUniqueDelegates() {
  this.delegatesAux1.filter((elem, pos) => this.delegatesAux1.indexOf(elem) === pos);
  let element = 0;
  let decrement = this.delegatesAux1.length - 1;
  while (element < this.delegatesAux1.length) {
                while (element < decrement) {
                  if (this.delegatesAux1[element].email === this.delegatesAux1[decrement].email) {
                      this.delegatesAux1.splice(decrement, 1);
                      decrement--;
                  } else {
                      decrement--;
                  }
                }
                decrement = this.delegatesAux1.length - 1;
                element++;
                                                          }

}

removeDelegate(delegate) {
  this.delegatesAux1.forEach( (item, index) => {
    if ( item.email === delegate.email ) { this.delegatesAux1.splice(index, 1); }
  });
}


// Metodo para agregar usuarios al equipo
updateTeam() {
  if ( this.selectedUsersPlus.length > 0) {
    this.teamService.addDelegates(this.teamGugo, this.selectedUsersPlus);
    console.log(this.selectedUsersPlus);
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

     // this.getTeam();
      this.getLocalCompany();
  }

  getLocalCompany() {
    // const user = localStorage.getItem('user');
    // const userObj = JSON.parse(user);
    // console.log(userObj.company.id);
    this.userGugo = this.authService.userAuth;
    this.teamService.getUsersCompany(this.userGugo.company.id).subscribe(users => {
     const usersGugoArray = _.reject(users, {uid: this.userGugo.uid});
      // console.log(users);
     console.log(this.authService.userAuth);
     this.teamService.getTeamByUser(this.userGugo).subscribe(teams => {
       // console.log(_.head(teams));
       if (teams.length > 0) {
         const {id} = _.head(teams);
         this.teamId = id;
         console.log(this.teamId);
         this.teamService.getDelegatesId(this.teamId).subscribe(delegates => {
         console.log(delegates);
         this.usersGugo = _.xorBy(usersGugoArray, delegates, 'uid');
         this.teamGugo.delegates = delegates;
         console.log(this.teamGugo.delegates);
         console.log('result', this.usersGugo);
        });
       } else {
         this.usersGugo = usersGugoArray;
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
      confirmButtonText: 'Sí, remover delegado!',
    }).then((result) => {
      if (result.value) {
        this.teamService.deleteDelegate(this.teamId, delegateId);
        Swal.fire('Listo!', 'Delegado removido de tu equipo.', 'success');
      }
    });
  }

  getTeam() {
    this.authService.getUser(this.authService.userAuth)
    .subscribe(user => {(this.userGugo = user);
                        // Obtener todos los usuarios de la App
                        this.authService.getUsers()
                        .subscribe(users => {
                                    this.usersApp = users;        // Lista de todos los usuarios
                                    this.usersGugo = [];          // Lista de los usuarios excepto el usuario autenticado
                                    // Obtener lista de usuarios excepto el usuario autenticado
                                    this.usersApp.map( item => {
                                    if ( item.uid !== this.userGugo.uid && item.manager === false ) {
                                    this.usersGugo.push(item);
                                    }
                                    });
                                    // Obtener el equipo segun el usuario autenticado
                                    this.teamService.getTeamByUser(this.userGugo)
                        .subscribe(team => {
                                 this.teamsObservable = team;
                                 this.teamsObservable.map(a =>
                                 this.teamGugo = a);
                                   // Obtener los delegados del equipo
                                 if ( this.teamGugo.manager ) {
                                   this.teamGugo.delegates = [];
                                   this.teamService.getDelegates(this.teamGugo).subscribe(delegates => {
                                   this.teamGugo.delegates = delegates;

                                   // Obtener los correos de los usuarios para poder ampliar los miembros de un equipo
                                   let emails;
                                   emails = new Set(this.teamGugo.delegates.map(({ email }) => email));

                                   // Establecer los usuarios que no pertencen al equipo
                                   this.usersAppFilter = [];
                                   this.usersAppFilter = this.usersGugo.filter(({ email }) => !emails.has(email));
                                   });
                                } else {
                                    this.teamGugo.delegates = [];
                                    this.teamService.getTeams().subscribe(teams => {
                                        this.teamsAux = teams;
                                        this.teamsAux.forEach(team => {
                                            this.teamService.getDelegates(team).subscribe(delegates => {
                                                   // tslint:disable-next-line:prefer-for-of
                                                   team.delegates = delegates;
                                                   team.delegates.forEach(delegate => {
                                                       if ( delegate.email === this.userGugo.email ) {
                                                           this.teamsAux1.push(team);
                                                           this.teamsAux1.forEach(teamA => {
                                                            this.authService.getUserById(teamA.manager).subscribe(manager => {
                                                              if (manager != null) {
                                                                if (!this.delegatesAux1.some(obj => obj.email === manager.email && obj.uid === manager.uid)) {
                                                                  this.delegatesAux1.push(manager);
                                                                }
                                                              }
                                                           });
                                                });
                                                           team.delegates.forEach(delegate => {
                                                            if (delegate != null) {
                                                            if (!this.delegatesAux1.some(obj => obj.email === delegate.email && obj.uid === delegate.uid)) {
                                                              this.delegatesAux1.push(delegate);
                                                            }
                                                          }
                                                           });
                                                       }
                                                       this.removeDelegate(this.userGugo);
                                                       this.delegatesAux1 = this.delegatesAux1.sort();
                                                       this.getUniqueDelegates();
                                                   });
                                        });
                                    });
                                    });
                            }
                        });
                      });
                    });
  }

}
