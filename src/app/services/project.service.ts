import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.interface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // Variables de usuarios para colecciones y documentos en Firestore
  projectCollection: AngularFirestoreCollection<Project>;
  projectDoc: AngularFirestoreDocument<Project>;
  projectsObs: Observable<Project[]>;
  projectObs: Observable<Project>;

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





}
