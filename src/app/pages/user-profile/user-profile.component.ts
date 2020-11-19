import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/models/user.interface';
import { NgForm } from '@angular/forms';

// tslint:disable-next-line:import-spacing
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
// import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userAux: User;
  userApp: User = {
    displayName: '',
    email: '',
    password: '',
    uid: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photoURL: '',
    phoneNumber: '',
  };

  selected: string;
  birthdate = new Date();

  password1: '';
  password2: '';
  fileToUpload: File = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private _authService: AuthService,
              private storageService: AngularFireStorage) {
    // this.userAux =  JSON.parse( localStorage.getItem('usuario'));
    this._authService.getUser(this._authService.userAuth).subscribe((user) => {
      (this.userApp = user),
        (this.selected = user.gender),
        (this.userApp.birthdate = new Date(user.birthdate['seconds'] * 1000));
      console.log(this.userApp.birthdate['seconds']);
      console.log(this.birthdate);
    });
  }

  ngOnInit() {
    console.log(this.userApp.birthdate);
  }

  changePass() {
    if (this.password1.length > 0 && this.password2.length > 0) {
      if (this.password1 === this.password2) {
        /* this._authService.changePassword(this.password1, localStorage.getItem('token'))
        .subscribe( resp => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: 'Espere por favor...'
          });
          Swal.showLoading();

          Swal.close();

          Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Constraseña actualizada con exito'
          });
        }, (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: this.respError(err.error.error.message)
          });
        }); */
      } else {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          text: 'Las contraseñas no coinciden',
        });
        return;
      }
    }
  }

  respError(respuesta: string) {
    if (respuesta === 'WEAK_PASSWORD') {
      respuesta = 'ingrese minimo 6 caracteres';
    }
    return respuesta;
  }

  onProfileUpdate(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
    });
    Swal.showLoading();

    this._authService.updateUser(this.userApp);

    Swal.close();

    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: 'Perfil actualizado con exito',
    });
  }

  inputEvent($event) {}

  async uploadFile(event) {
    const user = this._authService.userAuth;
    const {uid} = user;
    const file = event.target.files[0];
    await this.setPhotoProfile(uid, file);
  }

  setPhotoProfile(uid: string, file: File) {
    return new Promise((resolve, reject) => {
      const filePath = `users/${uid}`;
      const ref = this.storageService.ref(filePath);
      const upload = ref.put(file);
      const sub = upload.snapshotChanges().pipe(
        finalize( async () => {
          try {
            const photoURL = await ref.getDownloadURL().toPromise();
            console.log(photoURL);
            resolve({ photoURL });
          } catch (err) {
            reject(err);
          }
          sub.unsubscribe();
        })
      ).subscribe((data) => {
        console.log('storage: ', data);
      });
    });
  }
}
