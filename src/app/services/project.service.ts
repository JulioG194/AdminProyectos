import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.interface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../models/team.interface';
import { User } from '../models/user.interface';
import { Activity } from '../models/activity.interface';
import { Task } from '../models/task.interface';



@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // Variables de usuarios para colecciones y documentos en Firestore
  projectCollection: AngularFirestoreCollection<Project>;
  projectDoc: AngularFirestoreDocument<Project>;
  projectsObs: Observable<Project[]>;
  projectObs: Observable<Project>;
  projectsObservable: Observable<any[]>;
  projectListObservable: Observable<Project[]>;
  projectList2Observable: Observable<Project[]>;
  projectObservable: Observable<Project>;

  taskDoc: AngularFirestoreDocument<Task>;
  tasksObs: Observable<Task[]>;
  taskObs: Observable<Task>;

  activityDoc: AngularFirestoreDocument<Activity>;
  activitiesObs: Observable<Activity[]>;
  activityObs: Observable<Activity>;

  activities: Observable<Activity[]>;
  tasks: Observable<Task[]>;
  activityObservable: Observable<Activity[]>;


  idActivity: string;
  // Variables auxiliares
  projects: Project [];
  project: Project;
  idProject: string;

  constructor( private http: HttpClient,
               private afs: AngularFirestore ) {

      this.loadProjects(afs);
      this.projectsObs.subscribe(projects => {
        this.projects = projects;
      });
   }

  loadProjects(afs: AngularFirestore ) {
        this.projectCollection = afs.collection<Project>('projects');
        this.projectsObs = this.projectCollection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(a => {
            const data = a.payload.doc.data() as Project;
            data.id = a.payload.doc.id;
            return data;
            });
  }));
  }

  addNewProject( project: Project ) {
    this.projectCollection.add(project);
  }

  getProjects(): Observable<Project[]> {
    this.projectsObs = this.projectCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Project;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    return this.projectsObs;

  }

  showProject( project: Project ) {
    this.projectDoc = this.afs.doc(`projects/${project.id}`);
    this.projectObs = this.projectDoc.snapshotChanges().pipe(
      map(actions => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Project;
          data.id = actions.payload.id;
          return data;
        }
        }));
    return this.projectObs;

  }

  getActivity( projectId: string, activityId: string ) {
    this.activityDoc = this.afs.doc(`projects/${projectId}/activities/${activityId}`);
    this.activityObs = this.activityDoc.snapshotChanges().pipe(
      map(actions => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Activity;
          data.id = actions.payload.id;
          return data;
        }
        }));
    return this.activityObs;

  }


  getProjectByTeam( team: Team) {
    this.projectsObservable = this.afs.collection('projects', ref => ref.where('teamId', '==', team.id)).snapshotChanges().pipe(
      map( changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Project;
          data.id = action.payload.doc.id;
          return data;
        });
      })
    );
    return this.projectsObservable;
 }

 getProjectByOwner( user: User) {
  this.projectListObservable = this.afs.collection('projects', ref => ref.where('ownerId', '==', user.id)).snapshotChanges().pipe(
    map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Project;
        data.id = action.payload.doc.id;
        return data;
      });
    })
  );
  return this.projectListObservable;
}

getActivitybyName( activity: Activity, project: Project) {
  this.activityObservable = this.afs.collection('projects').doc(project.id).collection('activities', ref => ref.where('name', '==', activity.name).where('status', '==', activity.status).where('activity_time', '==', activity.activity_time)).snapshotChanges().pipe(
    map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Activity;
        data.id = action.payload.doc.id;
        return data;
      });
    })
  );
  return this.activityObservable;
}

getActivities( project: Project ) {
  this.activities = this.afs.collection('projects').doc(project.id).collection('activities').snapshotChanges().pipe(
       map(changes => {
         return changes.map(action => {
           const data = action.payload.doc.data() as Activity;
           data.id = action.payload.doc.id;
           return data;
         });
       }));
  return this.activities;
 }

 getTasks( projectId: string, activityId: string ) {
  this.tasks = this.afs.collection('projects').doc(projectId).collection('activities').doc(activityId).collection('tasks').snapshotChanges().pipe(
       map(changes => {
         return changes.map(action => {
           const data = action.payload.doc.data() as Task;
           data.id = action.payload.doc.id;
           return data;
         });
       }));
  return this.tasks;
 }

 getTask( project: Project , activity: Activity, id: string ) {
  this.taskDoc = this.afs.collection('projects').doc(project.id).collection('activities').doc(activity.id).collection('tasks').doc(id);
  this.taskObs = this.taskDoc.snapshotChanges().pipe(
    map(actions => {
      if (actions.payload.exists === false) {
        return null;
      } else {
        const data = actions.payload.data() as Task;
        data.id = actions.payload.id;
        return data;
      }
      }));
  return this.taskObs;

}

 setActivitiestoProject( project: Project, activity: Activity ) {

  this.afs.collection('projects').doc(project.id).collection('activities').add(activity)
  .then(ref => {
    console.log('id', ref.id);
    this.idActivity = ref.id;
  });
}

setTaskstoActivity( project: Project, activity: Activity, task: Task ) {

  this.afs.collection('projects').doc(project.id).collection('activities').doc(activity.id).collection('tasks').add(task);

}

getProject( id: string ) {
  this.projectDoc = this.afs.doc(`projects/${id}`);
  this.projectObs = this.projectDoc.snapshotChanges().pipe(
    map(actions => {
      if (actions.payload.exists === false) {
        return null;
      } else {
        const data = actions.payload.data() as Project;
        data.id = actions.payload.id;
        return data;
      }
      }));
  return this.projectObs;

}


}
