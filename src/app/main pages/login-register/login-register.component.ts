import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';

// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2/src/sweetalert2.js';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls  : ['./login-register.component.css', './login-register.component.scss' ]
})


export class LoginRegisterComponent implements OnInit {

  userRegister: User = {
    uid: '',
    displayName: '',
    email: '',
    employment: '',
    description: '',
    gender: '',
    photoURL: 'https://firebasestorage.googleapis.com/v0/b/tesis-adminproyectos.appspot.com/o/login.png?alt=media&token=ce8a16cb-009c-4d41-b9c0-c493bd8a355b',
    birthdate: new Date(),
    phoneNumber: '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
  userLogin: User = {
    uid: '',
    displayName: '',
    email: ''
};

  post1 = true;
  password = '';

  // Definimos el constructor del componente y declaramos los servicios y clases externas a usar
  constructor( private authService: AuthService,
               private router: Router
               ) { }


  // Metodo que se ejecuta al momento de iniciar el componente
  ngOnInit() {
      /* if ( localStorage.getItem('token') ) {
          this.router.navigateByUrl('/dashboard');
      } */
   }

  // Metodo par registrar nuevos usuarios
  onRegister( form: NgForm ) {

    if ( form.invalid ) { return; }

    if ( this.userRegister.password !== this.password) {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    if ( form.value.manager === 'true' ) {
       this.userRegister.manager = true;
       this.userRegister.employment = 'Gestor de proyectos';
    } else {
      this.userRegister.manager = false;
      this.userRegister.employment = 'Tecnico asistente';
    }

    this.authService.register( this.userRegister )
    .subscribe( resp => {

      Swal.close();
      // console.log(resp);
      this.authService.addNewUser(this.userRegister, resp.localId);
      this.router.navigateByUrl('/dashboard');
      // tslint:disable-next-line:no-shadowed-variable
/*       this.authService.verifyEmail(localStorage.getItem('token')).subscribe((resp: any) => {
        console.log(resp);
      }); */
      Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: 'Registrado con exito',
      text: 'Ahora puedes acceder a la aplicacion',
      position: 'center',
      showConfirmButton: false,
      timer: 1500
    });

      form.reset();
      this.post1 = true;


    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: this.respError(err.error.error.message)
      });
    });
  }

  // Metodo complementario cuando existe un problema en el registro
  respError( respuesta: string ) {

    if ( respuesta === 'EMAIL_EXISTS' ) {
        respuesta = 'Correo electrónico existente';
    }
    return respuesta;
  }

  // Metodo para el ingreso de usuarios a la aplicacion
  onLogin( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.authService.login( this.userLogin )
    .subscribe( resp => {
      setTimeout(() => {
        Swal.close();
      }, 1000);
      this.router.navigateByUrl('/dashboard');
    }, (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: this.respError2(err.error.error.message)
        });

    });
    }

  // Metodo complementario cuando existe un problema en el ingreso a la aplicacion
  respError2( respuesta: string ) {

      if ( respuesta === 'EMAIL_NOT_FOUND' ) {
          respuesta = 'Correo electrónico no encontrado';
      } else {
        respuesta = 'Contraseña incorrecta';
      }
      return respuesta;

    }


}
