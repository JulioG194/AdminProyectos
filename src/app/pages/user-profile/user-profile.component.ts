import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { NgForm } from '@angular/forms';

// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';
import { UserService } from '../../services/users.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userAux: User;
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

  selected: string;
  birthdate = new Date();

  constructor( public _authService: AuthService
               ) {
    // this.userAux =  JSON.parse( localStorage.getItem('usuario'));
    this._authService.showUser(this._authService.userAuth).subscribe(user => {(this.userApp = user, this.selected = user.gender, this.userApp.birthdate = new Date(user.birthdate['seconds'] * 1000));
                                                                              console.log(this.userApp.birthdate['seconds'] ); console.log(this.birthdate ); } );

    }

  ngOnInit() {
      console.log(this.userApp.birthdate);
  }

  onProfileUpdate( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this._authService.updateUser( this.userApp );


    Swal.close();


    Swal.fire({
        allowOutsideClick: false,
        type: 'success',
        title: 'Perfil actualizado con exito'
      });
    }

    inputEvent($event) {
    }
  }


