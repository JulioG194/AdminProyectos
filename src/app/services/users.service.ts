/* import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Variables de usuarios para colecciones y documentos en Firestore
  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  users: Observable<User[]>;
  user: Observable<User>;

  userAuth: User;
  usersAuth: User[];
  constructor( private http: HttpClient,
               private afs: AngularFirestore ) {

     // Obtiene los documentos de la coleccion de usuarios
     this.loadUsers(afs);
     this.users.subscribe(users => {
       this.usersAuth = users;
     });
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


  // Funcion para guardar un nuevo usuario en la base Firestore
  addNewUser( user: User ) {

    this.userCollection.add(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    this.userAuth = user;

  }

  updateUser( user: User ) {
    this.afs.collection('users').doc(user.id).update(
      {
        name: user.name,
        password: user.password,
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




}
 */