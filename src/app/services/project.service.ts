import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.interface';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../models/team.interface';
import { User } from '../models/user.interface';
import { Activity } from '../models/activity.interface';
import { Task } from '../models/task.interface';
import * as firebase from 'firebase/app';
import { AngularFireFunctions } from '@angular/fire/functions';

export interface TaskDelegate {
  project?: any;
  activity?: any;
  manager?: any;
  taskId?: string;
}
@Injectable({
  providedIn: 'root',
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

  taskDelegateDoc: AngularFirestoreDocument<TaskDelegate>;
  taskDelegatesObs: Observable<TaskDelegate[]>;
  taskDelegateObs: Observable<TaskDelegate>;

  activities: Observable<Activity[]>;
  tasks: Observable<Task[]>;
  activityObservable: Observable<Activity[]>;

  idActivity: string;
  // Variables auxiliares
  projects: Project[];
  project: Project;
  projectId: string;

  serverTimeStamp: any;
  data$: Observable<any>;
  dataDelete$: Observable<any>;
  comments: Observable<any>;
  resources: Observable<any[]>;

  constructor(private http: HttpClient, private afs: AngularFirestore, private fns: AngularFireFunctions) {
    this.loadProjects(afs);
    this.projectsObs.subscribe((projects) => {
      this.projects = projects;
    });
    this.serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
  }

  loadProjects(afs: AngularFirestore) {
    this.projectCollection = afs.collection<Project>('projects');
    this.projectsObs = this.projectCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Project;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  addProject(project: Project) {
    const id = this.afs.createId();
    this.afs.collection('projects').doc(id).set({
              ...project,
              createdAt: this.serverTimeStamp,
              id,
              progress: 0,
              comments: 0,
              resources: 0,
              status: 'Por Realizar',
              delegates: [],
            });
  }

   setActivitiestoProject(projectId: string, activity: Activity) {
    const id = this.afs.createId();
    this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities')
      .doc(id)
      .set({
          ...activity,
          createdAt: this.serverTimeStamp,
          id,
          projectId,
          progress: 0,
          status: 'Por Realizar',
          delegates: [],
      });
    return id;
  }



  deleteProject(projectId: string) {
    this.projectCollection
      .doc(projectId)
      .collection('activities')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          changes.map((action) => {
            const data = action.payload.doc.data() as Activity;
            data.id = action.payload.doc.id;
            this.deleteActivity(projectId, data.id);
          });
        })
      );
    this.projectCollection.doc(projectId).delete();
  }

  deleteActivity(projectId: string, activityId: string) {
    this.projectCollection
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .delete();
  }

  deleteActivityFn(projectId: string, activityId: string) {
    const callable = this.fns.httpsCallable('onDeleteActivity');
    this.dataDelete$ = callable({ projectId, activityId });
    // Imprimir el resultado que puedes enviar desde el functions
    return this.dataDelete$;
  }

  deleteTask(projectId: string, activityId: string, taskId: string) {
    this.projectCollection
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .collection('tasks')
      .doc(taskId)
      .delete();
  }

  getProjects(): Observable<Project[]> {
    this.projectsObs = this.projectCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as Project;
          data.id = action.payload.doc.id;
          return data;
        });
      })
    );
    return this.projectsObs;
  }

  showProject(project: Project) {
    this.projectDoc = this.afs.doc(`projects/${project.id}`);
    this.projectObs = this.projectDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Project;
          data.id = actions.payload.id;
          return data;
        }
      })
    );
    return this.projectObs;
  }

  getActivity(projectId: string, activityId: string) {
    this.activityDoc = this.afs.doc(
      `projects/${projectId}/activities/${activityId}`
    );
    this.activityObs = this.activityDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Activity;
          data.id = actions.payload.id;
          return data;
        }
      })
    );
    return this.activityObs;
  }

  getProjectByTeam(team: Team) {
    this.projectsObservable = this.afs
      .collection('projects', (ref) => ref.where('teamId', '==', team.id))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Project;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.projectsObservable;
  }

  getProjectByOwner(user: User) {
    const { uid } = user;
    this.projectListObservable = this.afs
      .collection('projects', (ref) =>
        ref.where('ownerId', '==', uid).orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Project;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.projectListObservable;
  }

  getActivitybyName(activity: Activity, project: Project) {
    this.activityObservable = this.afs
      .collection('projects')
      .doc(project.id)
      .collection('activities', (ref) =>
        ref
          .where('name', '==', activity.name)
          .where('status', '==', activity.status)
          .where('activity_time', '==', activity.activity_time)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Activity;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.activityObservable;
  }

  getActivities(projectId: string) {
    this.activities = this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Activity;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.activities;
  }

  getTasks(projectId: string, activityId: string) {
    this.tasks = this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .collection('tasks', (ref) => ref.orderBy('createdAt'))
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
    return this.tasks;
  }

  getTask(projectId: string, activityId: string, taskId: string) {
    this.taskDoc = this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .collection('tasks')
      .doc(taskId);
    this.taskObs = this.taskDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Task;
          data.id = actions.payload.id;
          return data;
        }
      })
    );
    return this.taskObs;
  }


 getTasksDelegates(uid: string, ) {
    this.taskDelegatesObs = this.afs
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as TaskDelegate;
            return data;
          });
        })
      );
    return this.taskDelegatesObs;
 }

  getProject(id: string) {
    this.projectDoc = this.afs.doc(`projects/${id}`);
    this.projectObs = this.projectDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Project;
          data.id = actions.payload.id;
          return data;
        }
      })
    );
    return this.projectObs;
  }


  updateProject(project: Project) {
    this.afs.collection('projects').doc(project.id).update({
      name: project.name,
      client: project.client,
      type: project.type,
      endDate: project.endDate,
      description: project.description,
    });
  }
  updateActivity(projectId: string, activityId: string, activity: Activity) {
    this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .update({
        name: activity.name,
        startDate: activity.startDate,
        endDate: activity.endDate,
        description: activity.description
      });
  }

  setTaskstoActivity(projectId: string, activityId: string, task: Task) {
    const id = this.afs.createId();
    const batch = this.afs.firestore.batch();

    const taskRef = this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .collection('tasks')
      .doc(id);

    batch.set(taskRef.ref, {
        ...task,
          createdAt: this.serverTimeStamp,
          id,
          projectId,
          progress: 0,
          status: 'Por Realizar',
    });

    return batch.commit();
  }

  updateTask(
    projectId: string,
    activityId: string,
    taskId: string,
    task: Task
  ) {

    this.afs
      .collection('projects')
      .doc(projectId)
      .collection('activities')
      .doc(activityId)
      .collection('tasks')
      .doc(taskId)
      .update({
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        delegate: task.delegate,
      });
  }

  updateTaskProgress(projectId: string, activityId: string, taskId: string, progress: number) {
    const callable = this.fns.httpsCallable('updateTaskProg');
    this.data$ = callable({ projectId, activityId, taskId, progress });
    // Imprimir el resultado que puedes enviar desde el functions
    return this.data$;
    // this.data$.subscribe(data => console.log(data));
  }

  checkTaskProgress(projectId: string, activityId: string, taskId: string, progress: number) {
    const callable = this.fns.httpsCallable('checkTaskProg');
    this.data$ = callable({ projectId, activityId, taskId, progress });
    // Imprimir el resultado que puedes enviar desde el functions
    return this.data$;
    // this.data$.subscribe(data => console.log(data));
  }

  createComment(projectId: string, user: User, comment: string, createdAt: any) {
    const id = this.afs.createId();
    this.afs.collection('projects')
            .doc(projectId)
            .collection('comments')
            .doc(id).set({
                  user,
                  createdAt,
                  comment
            });
  }

  getComments(projectId: string) {
    this.comments = this.afs
      .collection('projects')
      .doc(projectId)
      .collection('comments', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as any;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.comments;
  }

  getResources(projectId: string) {
    this.resources = this.afs
      .collection('projects')
      .doc(projectId)
      .collection('resources', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as any;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.resources;
  }
}
