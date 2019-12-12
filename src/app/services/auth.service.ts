import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Urls necesarias para usar la Firebase Auth REST Api
  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'AIzaSyC9fGbPafvbFK_Ev_Gpzu650eTIPJGAaEo';

  // Variables de usuarios para colecciones y documentos en Firestore
  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  users: Observable<User[]>;
  user: Observable<User>;

  // Variables auxiliares
  usersAuth: User [];
  userAuth: User;
  userToken: string;
  idUser: string;

  constructor( private http: HttpClient,
               private afs: AngularFirestore ) {

      // Obtiene los documentos de la coleccion de usuarios
      this.loadUsers(afs);
      this.users.subscribe(users => {
        this.usersAuth = users;
      });
      this.loadStorage();
   }


  // Funcion para cargar la coleccion de usuarios de la base de Firestore
  loadUsers(afs: AngularFirestore ) {
    this.userCollection = afs.collection<User>('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          data.id = a.payload.doc.id;
          return data;
        });
      }));

  }

  // Funcion para el cierre de la sesion
  logout() {
    localStorage.removeItem('token');
  }

  // Funcion para que el usuario pueda iniciar sesion
  login( user: User ) {
    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/accounts:signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( (resp: any) => {
       this.saveTokenOnStorage(resp.localId, resp.idToken );
       this.saveUserOnStorage(user);
       return resp;
      })
    );

  }

  // Guardar el token del usuario en el localstorage para tener la sesion activa
  saveTokenOnStorage( id: string, token: string ) {

    localStorage.setItem('idSession', id);
    localStorage.setItem('token', token);
    this.userToken = token;

  }

  // Funcion para que el usuario pueda registrarse en la aplicacion
  register( user: User ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/accounts:signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( (resp: any) => {


        this.saveTokenOnStorage(resp.localId, resp.idToken );
        return resp;
      })
    );

  }

  // Funcion para guardar un nuevo usuario en la base Firestore
  addNewUser( user: User ) {

    this.userCollection.add(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    this.userAuth = user;
  }

  // *Opcional* Funcion para ver si el usuario esta autenticado
  isAuthenticated(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }

  // Funcion que retorna un observable para obtener un usuario como parametro de entrada su Id
  showUser( user: User ) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.user = this.userDoc.snapshotChanges().pipe(
      map(actions => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as User;
          data.id = actions.payload.id;
          return data;
        }
        }));
    return this.user;

  }

  // Funcion que retorna un observable para obtener todos los usuarios de la base
  showUsers() {
    return this.users;
  }

  // Funcion para guardar un usuario en el localstorage
  saveUserOnStorage( user: User) {
    this.usersAuth.forEach(userAux => {
      if (userAux.email === user.email) {
        localStorage.setItem('usuario', JSON.stringify(userAux));
        this.userAuth = userAux;
        return userAux;
    }
   });
  }


  // Funcion para cargar el loadStorage con todos los datos de la sesion
  loadStorage() {
    if ( localStorage.getItem('token')) {
        this.userToken = localStorage.getItem('token');
        this.userAuth = JSON.parse( localStorage.getItem('usuario'));
    } else {
      this.userToken = '';
      this.userAuth = null;
    }
  }
}
