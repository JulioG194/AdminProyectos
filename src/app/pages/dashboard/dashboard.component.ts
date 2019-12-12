import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';
import { Project } from 'src/app/models/project.interface';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  userApp: User;
  userApps: User[];
  projectsApp: Project[];

  // tslint:disable-next-line: variable-name
  constructor( public _auth: AuthService,
               public _proj: ProjectService ) {

  }

   ngOnInit() {
     this.userApps = this._auth.usersAuth;
     this.userApp = this._auth.userAuth;
     this.projectsApp = this._proj.projects;
     console.log(this.userApps);
     console.log(this.projectsApp);

  }

  testing() {
    console.log(this.userApps);
    console.log(this.projectsApp);
  }

}

