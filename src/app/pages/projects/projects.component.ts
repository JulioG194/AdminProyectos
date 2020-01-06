import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { NgForm } from '@angular/forms';

// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';
import { UserService } from '../../services/users.service';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { Observable } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { Team } from 'src/app/models/team.interface';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
    userApp: User = {
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
  projectApp: Project = {
        name: '',
        client: '',
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        type: '',
        status: 'To Do'
  };

  idUser: String;
  teamsObservable:any;
  teamAux: Team = {
        manager: ''
  };

  constructor( public _authService: AuthService,
               public _projectService: ProjectService,
               public _teamService: TeamService
               ) {


    }

  ngOnInit() {
    this._authService.showUser(this._authService.userAuth).subscribe(user => {(this.userApp = user, this.idUser = user.id);
                                                                              this._teamService.getTeamByUser(this.userApp).subscribe(team => {
                                                                              //    this.teamAux = team;
                                                                              this.teamsObservable = team;
                                                                              this.teamsObservable.map(a =>
                                                                              this.teamAux = a);
                                                                              this.teamAux.delegates = [];
                                                                              this._teamService.getDelegates(this.teamAux).subscribe(delegates => {
                                                                                  this.teamAux.delegates = delegates;
                                                                              });
                                                                              console.log(this.teamAux);


        });
    });

  }

  onSaveProject( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this._projectService.addNewProject( this.projectApp );


    Swal.close();


    Swal.fire({
        allowOutsideClick: false,
        type: 'success',
        title: 'Perfil actualizado con exito'
      });
    }

    inputEvent($event) {
    }
    inputEvent2($event) {
    }
  }
