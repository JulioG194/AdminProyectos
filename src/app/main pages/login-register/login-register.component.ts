import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';
import * as _ from 'lodash';

// tslint:disable-next-line:import-spacing
import Swal from 'sweetalert2/src/sweetalert2.js';
import * as firebase from 'firebase/app';
import { ValidatorService } from '../../services/validators.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactFormModalComponent } from '../../components/contactForm/contactForm-modal.component';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: [
    './login-register.component.css',
    './login-register.component.scss',
  ],
})
export class LoginRegisterComponent implements OnInit {
  storagePhoto =
    'https://firebasestorage.googleapis.com/v0/b/epn-gugo.appspot.com/o/uni-avtar.jpg?alt=media&token=04e188b6-35cb-4bc0-bd5e-9f100307878f';
  serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
  userRegister: User = {
    uid: '',
    displayName: '',
    email: '',
    employment: '',
    description: '',
    gender: '',
    photoURL: this.storagePhoto,
    birthdate: new Date(),
    phoneNumber: '',
    createdAt: this.serverTimeStamp,
  };

  userLogin: User = {
    uid: '',
    displayName: '',
    email: '',
  };

  section = true;
  password = '';
  hide = true;
  hidePasswd = true;

  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  selected = '';
  registered: any;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private validators: ValidatorService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.validators.patternValidator()])]
    });
    this.registerForm = this.fb.group({
      fullName: ['', Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.validators.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', Validators.compose([ Validators.required,
        this.validators.patternPhoneValidator(),
        Validators.minLength(10), Validators.maxLength(10)])],
      role: ['', Validators.required],
      app: ['', Validators.required]
    },
     {
        validator: this.validators.MatchPassword('password', 'confirmPassword'),
      }
    );
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  openContactForm() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = '700px';
  dialogConfig.panelClass = 'custom-dialog';

  const dialogRef = this.dialog.open(ContactFormModalComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
        },
  );
  }

  async onRegister() {
     try {
       this.submitted = true;
       if (!this.registerForm.valid) {
        return;
      }
       if (!this.registerForm.value.role) {
        return;
      }
       const role = this.registerForm.value.role;
       const company = this.selected;
       const email = this.registerForm.value.email;

       this.loadingLoginRegister();

       this.setEmployment(role);

       if (company === 'Empresa' && role === 'true') {
        this.authService.getCompanyManager(email).subscribe(async (data) => {
            const snap = _.head(data);
            if (snap) {
              this.userRegister.company = {
              id: snap.cid,
              name: snap.name,
              address: snap.address,
              ref: snap.ref
            };
              await this.sucessRegister(role);
            } else {
              this.failedRegister();
            }
          });
      }

       if ( company === 'Empresa' && role === 'false' ) {
        this.authService.getCompanyDelegate(email).subscribe(async (data) => {
            const snap = _.head(data);
            if (snap) {
            this.userRegister.company = {
              id: snap.cid,
              name: snap.name,
              address: snap.address,
              ref: snap.ref
            };
            await this.sucessRegister(role);
            } else {
              this.failedRegister();
            }
          });
       }
       if ( company === 'Personal' ) {
           await this.sucessRegister(role);
       }
    }  catch (error) {
      console.log(error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: this.modalError(error),
        confirmButtonText: 'Listo!'
      });
      this.userRegister.manager = null;
    }
  }

  async sucessRegister(role: any) {
    try {
      const userReg = await this.authService.register(this.userRegister);
      const { uid } = userReg;
      delete this.userRegister.password;
      this.userRegister.uid = uid;
      this.userRegister.tokens = [];
      if (role === 'false') {
        this.userRegister.assignedTasks = 0;
      }
      this.authService.createUser(this.userRegister, uid);
      Swal.fire({
        icon: 'success',
        title: 'Registrado con exito',
        position: 'center',
        showCloseButton: true,
        confirmButtonText: 'Listo'
      });
      this.registerForm.reset();
      this.section = true;
    } catch (error) {
      console.log(error);
      this.userRegister.manager = null;
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: this.modalError(error),
        confirmButtonText: 'Listo!',
        showCloseButton: true,
      });
    }
  }

  failedRegister() {
      Swal.fire({
              icon: 'error',
              title: 'Error uso empresarial',
              text: 'No existe registro del usuario o su rol no coincide',
              position: 'center',
              showCloseButton: true,
              confirmButtonText: 'Listo!'
              });
      this.userRegister.manager = null;
  }

  loadingLoginRegister() {
      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...',
        timer: 4000
      });
      Swal.showLoading();
  }

  async onLogin() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    this.loadingLoginRegister();

    try {
      const user = await this.authService.login(this.userLogin);
      this.authService.getUser(user).subscribe((userObs) => {
          const loginUser = userObs;
          this.authService.saveUserOnStorage(loginUser);
          const token = localStorage.getItem('fcm');
          console.log(token);
          if (token) {
            this.authService.setTokensUser(loginUser, token);
          }
        });
      Swal.close();
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
        });
      setTimeout(() => {
        this.router.navigateByUrl('/dashboard');
       }, 1200);
      Toast.fire({
        icon: 'success',
        title: 'Ingreso Exitoso'
        });
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: this.modalError(error),
        showCloseButton: true,
        confirmButtonText: 'Listo!'
      });
    }
  }

     setEmployment(value: string) {
    if (value === 'true') {
      this.userRegister.manager = true;
      this.userRegister.employment = 'Gestor de proyectos';
    } else {
      this.userRegister.manager = false;
      this.userRegister.employment = 'Delegado de proyectos';
    }
  }

     async openResetPassword() {
    const { value: email } = await Swal.fire({
      title: 'Recuperar mi contraseña',
      input: 'email',
      inputPlaceholder: 'Ingrese el correo electrónico',
      showCloseButton: true,
      validationMessage: 'Correo electrónico inválido',
      confirmButtonText: 'Listo'
    });

    if (email) {
      Swal.fire(`Hemos enviado un correo a: ${email}`);
      return email;
    }
  }

     async resetPassword() {
    try {
      const value = await this.openResetPassword();
      const email: any = value;
      if (email) {
        await this.authService.resetPassword(email);
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al recuperar contraseña',
        text: this.modalError(error),
        showCloseButton: true,
        confirmButtonText: 'Listo'
      });
    }
  }

     modalError(error: any) {
    const { code } = error;
    switch (code) {
      case 'auth/wrong-password':
        return 'Ha ingresado mal su contraseña';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/invalid-email':
        return 'Correo electrónico no válido';
      case 'auth/email-already-in-use':
        return 'Usuario existente';
      case 'auth/weak-password':
        return 'Contraseña muy debil intente ingresando otra';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      default:
        break;
    }
  }
}
