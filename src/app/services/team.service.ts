import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../models/team.interface';
import { AuthService } from './auth.service';
import { User } from '../models/user.interface';
// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  // Variables de usuarios para colecciones y documentos en Firestore
  teamCollection: AngularFirestoreCollection<Team>;
  teamDoc: AngularFirestoreDocument<Team>;
  teamsObs: Observable<Team[]>;
  teamObs: Observable<Team>;
  teamsObservable: Observable<any>;

  delegates: Observable<User[]>;
  delegate: Observable<any>;

  // Variables auxiliares
  teams: Team [];
  team: Team;
  idTeam: string;

  usersToChoose: User[];
  usersToChooseS: string[];

  constructor( private http: HttpClient,
               private afs: AngularFirestore,
               private _authService: AuthService ) {

      this.loadTeams(afs);
      this.teamsObs.subscribe(teams => {
        this.teams = teams;
      });
      this._authService.users.subscribe(users => {
        this.usersToChoose = users;
      });
   }

  loadTeams(afs: AngularFirestore ) {
        this.teamCollection = afs.collection<Team>('teams');
        this.teamsObs = this.teamCollection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(a => {
            const data = a.payload.doc.data() as Team;
            data.id = a.payload.doc.id;
            return data;
            });
  }));
  }


  getTeams(): Observable<Team[]> {
    this.teamsObs = this.teamCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Team;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    return this.teamsObs;

  }

  getTeamByUser( user: User) {
     this.teamsObservable = this.afs.collection('teams', ref => ref.where('manager', '==', user.id)).snapshotChanges().pipe(
       map( changes => {
         return changes.map(action => {
           const data = action.payload.doc.data() as Team;
           data.id = action.payload.doc.id;
           return data;
         });
       })
     );
     return this.teamsObservable;
  }

  getDelegates( team: Team ) {
   this.delegates = this.afs.collection('teams').doc(team.id).collection('delegates').snapshotChanges().pipe(
        map(changes => {
          return changes.map(action => {
            const data = action.payload.doc.data() as User;
            data.id = action.payload.doc.id;
            return data;
          });
        }));
   return this.delegates;
  }

  addDelegates( team: Team, users: User[] ) {
    let userAux: User = {
      name: '',
      id: '',
      email: '',
      photo: ''
    };
    users.forEach(user => {
      userAux = {
          name: user.name,
          id: user.id,
          email: user.email,
          photo: user.photo
      };
      this.afs.collection('teams').doc(team.id).collection('delegates').add(userAux);
    });
   }

   getTeam( id: string ) {
    this.teamDoc = this.afs.doc(`teams/${id}`);
    this.teamObs = this.teamDoc.snapshotChanges().pipe(
      map(actions => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Team;
          data.id = actions.payload.id;
          return data;
        }
        }));
    return this.teamObs;

  }


  setTeamtoUser( user: User, users: User[] ) {

    this.afs.collection('teams').add({
      manager: user.id,
    }).then(doc => {
      let delegatesCollection = doc.collection('delegates');

      let batch = this.afs.firestore.batch();

      users.forEach( d => {
        let ref = delegatesCollection.doc(d.id);
        batch.set(ref, {
          name: d.name,
          email: d.email,
          id: d.id,
          photo: d.photo
        });
      });

      return batch.commit();
    }).then(result => {
      Swal.fire({
        allowOutsideClick: false,
        type: 'success',
        title: 'Guardado con exito'
      });
    }).catch(err => {
      Swal.fire({
        type: 'error',
        title: 'Error al guardar',
        text: err
      });
    });
  }
}
