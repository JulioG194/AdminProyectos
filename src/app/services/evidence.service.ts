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

import 'firebase/storage';
import { Evidence } from '../models/evidence.interface';

@Injectable({
  providedIn: 'root',
})
export class EvidenceService {
  evidenceCollection: AngularFirestoreCollection<Evidence>;
  evidenceDoc: AngularFirestoreDocument<Evidence>;
  evidencesObs: Observable<Evidence[]>;
  evidenceObs: Observable<Evidence>;

  files: Evidence[];
  evidences: Observable<Evidence[]>;

  private RESOURCES_FOLDER = 'resources';
  private FILES_FOLDER = 'files';

  constructor(private http: HttpClient, private afs: AngularFirestore) {
    // this.loadFiles(afs);
    // this.evidencesObs.subscribe((files) => {
    //   this.files = files;
    // });
  }

  loadFiles(afs: AngularFirestore) {
    this.evidenceCollection = afs.collection<Evidence>('evidences');
    this.evidencesObs = this.evidenceCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Evidence;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  uploadFilesFirebase(files: Evidence[], uid: User, tid: string) {
    const storageRef = firebase.storage().ref();
    // let url: string;
    for (const item of files) {
      item.isUploading = true;
      if (item.progress >= 100) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${uid.uid}/${this.FILES_FOLDER}/${tid}/ ${item.fileName}`)
        .put(item.file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          (item.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => console.error('Error al subir', error),
        () => {
          console.log('Imagen cargada correctamente');
          // tslint:disable-next-line: deprecation
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              console.log('File available at', downloadURL);
              // url = downloadURL;
              item.url = this.getString(downloadURL);
            })
            .then(() => {
              item.isUploading = false;
              item.tid = tid;
              // console.log(url);
              this.onSavePhoto(item, uid);
            });
        }
      );
    }
  }

  getString(str: string): string {
    let a: string;
    a = str;
    return a;
  }

  private onSavePhoto(photo: Evidence, uid: User) {
    const id = this.afs.createId();
    this.afs.collection('evidences').doc(photo.tid).set({
      tid: photo.tid,
    });
    this.afs
      .collection('evidences')
      .doc(photo.tid)
      .collection('files')
      .doc(id)
      .set({
        fileName: photo.fileName,
        url: photo.url,
        type: photo.file.type,
        userPhoto: uid.photoURL,
        userId: uid.uid,
        userName: uid.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  uploadResourcesFirebase(files: Evidence[], user: User, projectId: string) {
    const storageRef = firebase.storage().ref();
    for (const item of files) {
      item.isUploading = true;
      if (item.progress >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${this.RESOURCES_FOLDER}/${projectId}/ ${item.fileName}`)
        .put(item.file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          (item.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => console.error('Error al subir', error),
        () => {
          console.log('Imagen cargada correctamente');
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              console.log('File available at', downloadURL);
              item.url = this.getString(downloadURL);
            })
            .then(() => {
              item.isUploading = false;
              item.projectId = projectId;
              this.onSaveResource(item, user, projectId);
            });
        }
      );
    }
  }

  private onSaveResource(photo: Evidence, user: User, projectId: string) {
    const id = this.afs.createId();
    this.afs
      .collection('projects')
      .doc(projectId)
      .collection('resources')
      .doc(id)
      .set({
        fileName: photo.fileName,
        url: photo.url,
        type: photo.file.type,
        user,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  getEvidences(taskId: string) {
    this.evidences = this.afs
      .collection('evidences')
      .doc(taskId)
      .collection('files', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Evidence;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.evidences;
  }
}
