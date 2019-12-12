import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';

// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';
import { ProjectService } from '../../services/project.service';


@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls  : ['./login-register.component.css']
})


export class LoginRegisterComponent implements OnInit {

  recordarme: false;

  user: User = {
        name: '',
        email: '',
        password: ''
  };


  users: User[];
  constructor( private auth: AuthService,
               private proj: ProjectService,
               private router: Router ) { }

  public ProbarlaApp() {
    this.router.navigate(['/dashboard']);
  }


  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }

  }

  onRegister( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.auth.register( this.user )
    .subscribe( resp => {

      Swal.close();

      this.auth.addNewUser(this.user);

      Swal.fire({
        allowOutsideClick: false,
        type: 'success',
        title: 'Registrado con exito',
        text: 'Bienvenido a la plataforma'
      });


      this.router.navigateByUrl('/dashboard');

    }, (err) => {
      Swal.fire({
        type: 'error',
        title: 'Error al registrar',
        text: this.respError(err.error.error.message)
      });

    });

  }


  respError( respuesta: string ) {

    if ( respuesta === 'EMAIL_EXISTS' ) {
        respuesta = 'Correo electrónico existente';
    }
    return respuesta;
  }


  onLogin( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.auth.login( this.user )
    .subscribe( resp => {
      Swal.close();
      this.proj.projbb();
      this.router.navigateByUrl('/dashboard');

    }, (err) => {

        Swal.fire({
          type: 'error',
          title: 'Error al autenticar',
          text: this.respError2(err.error.error.message)
        });
    });
    }
    respError2( respuesta: string ) {

      if ( respuesta === 'EMAIL_NOT_FOUND' ) {
          respuesta = 'Correo electrónico no encontrado';
      } else {
        respuesta = 'Contraseña incorrecta';
      }
      return respuesta;

    }


}
