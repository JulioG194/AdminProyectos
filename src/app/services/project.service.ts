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

  deleteProject( projectId: string ) {

    this.projectCollection.doc(projectId).collection('activities').snapshotChanges().pipe(
      map(changes => {
          changes.map(action => {
          const data = action.payload.doc.data() as Activity;
          data.id = action.payload.doc.id;
          this.deleteActivity(projectId, data.id);
        });
      }));
    this.projectCollection.doc(projectId).delete();
  }

  deleteActivity( projectId: string, activityId: string ) {

    this.projectCollection.doc(projectId).collection('activities').doc(activityId).delete();
  }

  deleteTask( projectId: string, activityId: string, taskId: string ) {

    this.projectCollection.doc(projectId).collection('activities').doc(activityId).collection('tasks').doc(taskId).delete();
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
  this.projectListObservable = this.afs.collection('projects', ref => ref.where('ownerId', '==', user.uid).orderBy('createdAt')).snapshotChanges().pipe(
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
  this.activities = this.afs.collection('projects').doc(project.id).collection('activities', ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
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
  this.tasks = this.afs.collection('projects').doc(projectId).collection('activities').doc(activityId).collection('tasks', ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
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

 setActivitiestoProject( projectId: string, activity: Activity ) {
  this.afs.collection('projects').doc(projectId).collection('activities').add({
      name: activity.name,
      percentaje: activity.percentaje,
      status: activity.status,
      start_date: activity.start_date,
      end_date: activity.end_date,
      createdAt: activity.createdAt,
      idProject: projectId
  });
}

setTaskstoActivity( project: Project, activityId: string, task: Task ) {
  this.afs.collection('projects').doc(project.id).collection('activities').doc(activityId).collection('tasks').add({
    name: task.name,
    progress: task.progress,
    status: task.status,
    start_date: task.start_date,
    end_date: task.end_date,
    createdAt: task.createdAt,
    delegate: task.delegate,
    idActivity: activityId
});

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
updateProject( project: Project ) {
  this.afs.collection('projects').doc(project.id).update({
      name: project.name,
      client: project.client,
      type: project.type,
      start_date: project.start_date,
      end_date: project.end_date,
      description: project.description
  });
}
updateActivity( idProject: string, idActivity: string, activity: Activity ) {
  this.afs.collection('projects').doc(idProject).collection('activities').doc(idActivity).update({
      name: activity.name,
      start_date: activity.start_date,
      end_date: activity.end_date
  });
}

updateTask(idProject: string, idActivity: string, idTask: string, task: Task) {
  this.afs.collection('projects').doc(idProject).collection('activities').doc(idActivity).collection('tasks').doc(idTask).update({
    name: task.name,
    start_date: task.start_date,
    end_date: task.end_date,
    delegate: task.delegate
  });
}

setTaskProgress( idProject: string, idActivity: string, idTask: string, prog: number ) {
  this.afs.collection('projects').doc(idProject).collection('activities').doc(idActivity).collection('tasks').doc(idTask).update(
    {
       progress: prog,
       status: 'Por Verificar'
    }
  );
  this.afs.collection('projects').doc(idProject).collection('activities').doc(idActivity).update(
    {
       status: 'Por Verificar'
    }
  );
  this.afs.collection('projects').doc(idProject).update(
    {
       status: 'Por Verificar'
    }
  );
}

setActivityProgress( idProject: string, idActivity: string, percent: number) {
  this.afs.collection('projects').doc(idProject).collection('activities').doc(idActivity).update(
    {
       percentaje: percent
    }
  );
}

setProjectProgress( idProject: string, percent: number) {
  this.afs.collection('projects').doc(idProject).update(
    {
       progress: percent
    }
  );
}

checkTask(projectId: string, activityId: string, taskId: string, progressTask: number) {
    if ( (progressTask > 0) && (progressTask < 100)   ) {
      this.projectCollection.doc(projectId).collection('activities').doc(activityId).collection('tasks').doc(taskId).update(
        {
           status: 'Realizando'
        }
      );
    } else if ( progressTask === 100 ) {
      this.projectCollection.doc(projectId).collection('activities').doc(activityId).collection('tasks').doc(taskId).update(
        {
           status: 'Realizado'
        }
      );
    } else {
      this.projectCollection.doc(projectId).collection('activities').doc(activityId).collection('tasks').doc(taskId).update(
        {
           status: 'Por Realizar'
        }
      );
    }

}

}
