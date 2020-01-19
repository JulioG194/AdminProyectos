import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { User } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Team } from 'src/app/models/team.interface';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {

  usersApp: User[] ;
  usersApp1: User[] = [];
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
  selectedUsers2: User[] = [];
  userGugo: User = {
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
  userAux: User;
  teamsObservable: any;
  teamAux: Team = {
    manager: ''
};

post = true;

  constructor( public _teamService: TeamService,
               public _authService: AuthService ) {

  this._authService.showUser(this._authService.userAuth)
                            .subscribe(user => {(this.userGugo = user);
                                                this._authService.getUsers()
                                                .subscribe(users => {
                                                            this.usersApp = users;
                                                            this.usersGugo = [];
                                                            this.usersApp.map( item => {
                                                            if ( item.id !== this.userGugo.id ) {
                                                            this.usersGugo.push(item);
                                                            }
                                                            });
                                                            this._teamService.getTeamByUser(this.userGugo)
                                                .subscribe(team => {
                                                         this.teamsObservable = team;
                                                         this.teamsObservable.map(a =>
                                                         this.teamAux = a);
                                                         if ( this.teamAux.manager ) {
                                                           console.log('si hay team');
                                                           this.teamAux.delegates = [];
                                                           this._teamService.getDelegates(this.teamAux).subscribe(delegates => {
                                                           this.teamAux.delegates = delegates;
                                                           console.log(this.usersGugo);
                                                           console.log(this.teamAux.delegates);
                                                           let emails;
                                                           emails = new Set(this.teamAux.delegates.map(({ email }) => email));
                                                           console.log(emails);
                                                           this.usersApp1 = this.usersGugo.filter(({ email }) => !emails.has(email));
                                                           console.log(this.usersApp1);
                                                           });
                                                        } else {
                                                            this.teamAux.delegates = [];
                                                            console.log('no hay team');
                                                    }
                                                });
                                                            });
                                                            });

}

onGroupsChange(selectedUsers: User[]) {
  this.selectedUsers = selectedUsers;
  console.log(this.selectedUsers);
}

onGroupsChange2(selectedUsers2: User[]) {
  this.selectedUsers2 = selectedUsers2;
  console.log(this.selectedUsers2);
}

addNewTeam() {
  if ( this.selectedUsers.length > 0) {
    this._teamService.setTeamtoUser(this.userGugo, this.selectedUsers);
  } else {
    console.log('no se ha seleccionado personas para tu equipo');
  }
}

updateTeam() {
  this.post = !this.post;
  if ( this.selectedUsers2.length > 0) {
    this._teamService.addDelegates(this.teamAux, this.selectedUsers2);
  } else {
    console.log('no se ha seleccionado personas para tu equipo');
  }
}


  ngOnInit() {

  }

}
