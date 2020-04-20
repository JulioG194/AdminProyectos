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

  userDoc1: AngularFirestoreDocument<User>;
  users1: Observable<User[]>;
  user1: Observable<User>;

  // Variables auxiliares
  usersAuth: User [];
  userAuth: User;
  userGuGo: User;
  userToken: string;
  idUser: string;
  photoUrl: string;

  constructor( private http: HttpClient,
               private afs: AngularFirestore
               ) {

      // Obtiene los documentos de la coleccion de usuarios
      this.loadUsers(afs);
      this.users.subscribe(users => {
        this.usersAuth = users;
      });
      this.loadStorage();

   }


  // Funcion para cargar la coleccion de usuarios de la base de Firestore
  loadUsers(afs: AngularFirestore ) {
    this.userCollection = afs.collection<User>('users', ref => ref.orderBy('createdAt'));
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
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
      //  this.saveTokenOnStorage(resp.localId, resp.idToken );
        console.log(resp);
        localStorage.clear();
        const userAu: User = {
          id : resp.localId,
          name : user.name,
          email : resp.email
        };
        localStorage.setItem('usuario', JSON.stringify(userAu));
        this.saveTokenOnStorage(resp.localId, resp.idToken );
        this.userAuth = JSON.parse( localStorage.getItem('usuario'));
        return resp;
      })
    );

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
     this.userAuth = JSON.parse( localStorage.getItem('usuario'));
     return resp;
    })
  );

}

 // Funcion para que el usuario pueda iniciar sesion
 changePassword( pass: string, idT: string ) {
  const authData = {
    idToken: idT,
    password: pass,
    returnSecureToken: true
  };

  console.log(authData);

  return this.http.post(
    `${ this.url }/accounts:update?key=${ this.apikey }`,
    authData
  ).pipe(
    map( (resp: any) => {
    return resp;
    })
  );

}

  // Funcion para el cierre de la sesion
  logout() {
    localStorage.clear();
  }



  // Funcion para guardar un nuevo usuario en la base Firestore
  addNewUser( user: User, idUser: string ) {
    // this.userCollection.add(user);
    this.userCollection.doc(idUser).set({
        birthdate: user.birthdate,
        createdAt: user.createdAt,
        description: user.description,
        email: user.email,
        employment: user.employment,
        gender: user.gender,
        google: user.google,
        manager: user.manager,
        name: user.name,
        phone_number: user.phone_number,
        photo: user.photo
  });
  }

  // *Opcional* Funcion para ver si el usuario esta autenticado
  /* isAuthenticated(): boolean {

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
  } */

  // Funcion que retorna un observable para obtener un usuario como parametro de entrada su Id
  getUser( user: User ) {
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

 /*  getUserById( user: string ) {
    this.userDoc1 = this.afs.doc(`users/${user}`);
    this.user1 = this.userDoc.snapshotChanges().pipe(
      map(actions => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as User;
          data.id = actions.payload.id;
          return data;
        }
        }));
    return this.user1;

  }
 */

 getUserById( id: string ) {
  this.userDoc1 = this.afs.collection('users').doc(id);
  this.user1 = this.userDoc1.snapshotChanges().pipe(
    map(actions => {
      if (actions.payload.exists === false) {
        return null;
      } else {
        const data = actions.payload.data() as User;
        data.id = actions.payload.id;
        return data;
      }
      }));
  return this.user1;

}

getPhotoById( id: string ): string {
  this.userDoc1 = this.afs.collection('users').doc(id);
  this.user1 = this.userDoc1.snapshotChanges().pipe(
    map(actions => {
      if (actions.payload.exists === false) {
        return null;
      } else {
        const data = actions.payload.data() as User;
        data.id = actions.payload.id;
        return data;
      }
      }));
  return this.photoUrl;

}


  updateUser( user: User ) {
    this.afs.collection('users').doc(user.id).update(
      {
        name: user.name,
       // password: user.password,
        birthdate: user.birthdate,
      //  career: user.career,
        description: user.description,
        gender: user.gender,
        photo: user.photo
      }
    );
  }


  // Funcion que retorna un observable para obtener todos los usuarios de la base
  showUsers() {
    return this.users;
  }

  getUsers(): Observable<User[]> {
    this.users = this.userCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as User;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    return this.users;

  }

  // Funcion para guardar un usuario en el localstorage
  saveUserOnStorage( user: User) {
     const userAu: User = {
      id : '',
      name : '',
      email : ''
    };
     this.usersAuth.forEach(userAux => {
      if (userAux.email === user.email) {
        userAu.id = userAux.id;
        userAu.name = userAux.name;
        userAu.email = userAux.email;

        localStorage.setItem('usuario', JSON.stringify(userAu));
        return userAux;
    }
   });
  }

}
