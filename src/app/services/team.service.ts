import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../models/team.interface';
import { AuthService } from './auth.service';
import { User } from '../models/user.interface';
// tslint:disable-next-line:import-spacing
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { Task } from '../models/task.interface';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  // Variables de usuarios para colecciones y documentos en Firestore
  teamCollection: AngularFirestoreCollection<Team>;
  teamDoc: AngularFirestoreDocument<Team>;
  teamsObs: Observable<Team[]>;
  teamObs: Observable<Team>;
  teamsObservable: Observable<any>;

  delegates: Observable<User[]>;
  delegatesUser: Observable<User[]>;
  delegate: Observable<any>;
  manager: User;
  teamId: string;
  // Variables auxiliares
  teams: Team[];
  team: Team;
  idTeam: string;
  teamAux: Team;
  teamsAux: Team[] = [];

  usersToChoose: User[];
  usersToChooseS: string[];
  usersCompany: Observable<User[]>;
  tasksDelegate: Observable<Task[]>;
  data$: Observable<any>;
  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private authService: AuthService,
    private fns: AngularFireFunctions
  ) {
    this.loadTeams(afs);
    this.teamsObs.subscribe((teams) => {
      this.teams = teams;
    });
    this.authService.users.subscribe((users) => {
      this.usersToChoose = users;
    });
  }

  loadTeams(afs: AngularFirestore) {
    this.teamCollection = afs.collection<Team>('teams');
    this.teamsObs = this.teamCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Team;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getTeams(): Observable<Team[]> {
    this.teamsObs = this.teamCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as Team;
          data.id = action.payload.doc.id;
          return data;
        });
      })
    );
    return this.teamsObs;
  }

  getTeamByUser(user: User) {
    const { uid } = user;
    this.teamsObservable = this.afs
      .collection('teams', (ref) => ref.where('manager', '==', uid))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Team;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.teamsObservable;
  }

  getDelegates(team: Team) {
    this.delegates = this.afs
      .collection('teams')
      .doc(team.id)
      .collection('delegates', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.delegates;
  }

  getDelegatesId(id: string) {
    this.delegates = this.afs
      .collection('teams')
      .doc(id)
      .collection('delegates', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.delegates;
  }

  getDelegatesUser(team: Team, user: User) {
    this.delegatesUser = this.afs
      .collection('teams')
      .doc(team.id)
      .collection('delegates', (ref) => {
        const query = ref;
        query.where('id', '==', user.uid);
        // this.teamsAux = [];
        this.teamId = query.parent.id;
        // console.log(this.teamId);
        this.getTeam(this.teamId).subscribe((teamA) => {
          this.teamAux = teamA;
          this.teamsAux.push(this.teamAux);
        });
        console.log(this.teamsAux);
        return query;
      })
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.delegatesUser;
  }

  addDelegates(team: Team, users: User[]) {
    users.forEach((user) => {
      this.afs
        .collection('teams')
        .doc(team.id)
        .collection('delegates')
        .doc(user.uid)
        .set({
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          employment: user.employment,
          createdAt: user.createdAt,
          phoneNumber: user.phoneNumber,
        });
    });
  }

  getTeam(id: string) {
    this.teamDoc = this.afs.doc(`teams/${id}`);
    this.teamObs = this.teamDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Team;
          data.id = actions.payload.id;
          return data;
        }
      })
    );
    return this.teamObs;
  }

  setTeamtoUser(user: User, users: User[]) {
    const teamRef = this.afs
      .collection('teams')
      .doc(user.uid);

    teamRef
      .set({
        manager: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        employment: user.employment,
        phoneNumber: user.phoneNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // .then((doc) => {
    const delegatesCollection = teamRef
      .collection('delegates');

    const batch = this.afs.firestore.batch();

    users.forEach((d) => {
          const ref = delegatesCollection.doc(d.uid);
          const delegateRef = this.afs
                        .collection('users')
                        .doc(d.uid);

          batch.set(ref.ref, {
            displayName: d.displayName,
            email: d.email,
            uid: d.uid,
            photoURL: d.photoURL,
            employment: d.employment,
            phoneNumber: d.phoneNumber,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });

          batch.update(delegateRef.ref, {
            teams: firebase.firestore.FieldValue.arrayUnion(user.uid)
          });
        });

    return batch.commit();
  }

  getUsersCompany(id: string) {
    this.usersCompany = this.afs.collection('users', (ref) => ref.where('company.id', '==', id))
    .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.usersCompany;

  }

  getDelegatesUncompany() {
    this.usersCompany = this.afs.collection('users', (ref) => ref.where('manager', '==', false))
    .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            if (!data.company) {
              return data;
            }
          });
        })
      );
    return this.usersCompany;

  }

  deleteDelegate(teamId: string, delegateId: string) {
    this.afs.collection('teams').doc(teamId).collection('delegates').doc(delegateId).delete();
    this.afs.collection('users').doc(delegateId).update({
      teams: firebase.firestore.FieldValue.arrayRemove(teamId)
    });
  }

  getDelegateInTask(uid: string, projectId: string, activityId: string) {
    this.tasksDelegate = this.afs.collection('projects')
                          .doc(projectId)
                          .collection('activities')
                          .doc(activityId)
                          .collection('tasks', (ref) => ref.where('delegate.uid', '==', uid))
    .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Task;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.tasksDelegate;
  }

  sendNotificationNewTeam(manager: User, delegates: User[]) {
    console.log(delegates);
    const callable = this.fns.httpsCallable('notificationNewTeam');
    this.data$ = callable({ manager, delegates });
    // Imprimir el resultado que puedes enviar desde el functions
    return this.data$;
    // this.data$.subscribe(data => console.log(data));
  }

   sendNotificationRemoveTeam(managerId: string, delegateId: string) {
    const callable = this.fns.httpsCallable('notificationRemoveDelegateTeam');
    this.data$ = callable({ managerId, delegateId });
    // Imprimir el resultado que puedes enviar desde el functions
    return this.data$;
    // this.data$.subscribe(data => console.log(data));
  }

  sendNotificationFileResource(user: User, delegates: User[], projectName: string) {
    const callable = this.fns.httpsCallable('notificationNewFileResources');
    this.data$ = callable({ user, delegates, projectName });
    return this.data$;
  }

  sendNotificationFileResourceDel(user: User, delegates: User[], projectName: string, manager: User) {
    const callable = this.fns.httpsCallable('notificationNewFileResourcesDel');
    this.data$ = callable({ user, delegates, projectName, manager });
    return this.data$;
  }


  sendNotificationCommentResource(user: User, delegates: User[], projectName: string) {
    const callable = this.fns.httpsCallable('notificationNewCommentResources');
    this.data$ = callable({ user, delegates, projectName });
    return this.data$;
  }

  sendNotificationCommentResourceDel(user: User, delegates: User[], projectName: string, manager: User) {
    const callable = this.fns.httpsCallable('notificationNewCommentResourcesDel');
    this.data$ = callable({ user, delegates, projectName, manager });
    return this.data$;
  }

}
