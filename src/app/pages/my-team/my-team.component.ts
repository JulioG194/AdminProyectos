import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { User } from 'src/app/models/user.interface';
import { AuthService } from '../../services/auth.service';
import { MatListOption } from '@angular/material/list';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {

  usersApp: User[] ;
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
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

  constructor( public team: TeamService,
               public _authService: AuthService ) {

  this._authService.showUser(this._authService.userAuth).subscribe(user => {(this.userGugo = user);
                                                                            this._authService.getUsers().subscribe(users => {
      this.usersApp = users;
      this.usersApp.map( item => {
        if ( item.id !== this.userGugo.id ) {
          this.usersGugo.push(item);
        }
      });
      console.log(this.usersGugo);
     });
  } );

}

onGroupsChange(selectedUsers: User[]) {
  this.selectedUsers = selectedUsers;
}

addNewTeam() {
  this.team.setTeamtoUser(this.userGugo, this.selectedUsers) ;
}


  ngOnInit() {

  }

}
