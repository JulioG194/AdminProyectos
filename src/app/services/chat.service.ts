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
import * as firebase from 'firebase/app';
import { Chat } from '../models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatCollection: AngularFirestoreCollection<Chat>;
  chatDoc: AngularFirestoreDocument<Chat>;
  chatsObs: Observable<Chat[]>;
  chatObs: Observable<Chat>;
  chatsObservable: Observable<any>;

  chats: Chat [];
  chatsUsers: Observable<Chat[]>;

  constructor(  private http: HttpClient,
                private afs: AngularFirestore ) {

          this.loadChats(afs);
          this.chatsObs.subscribe(chats => {
          this.chats = chats;
                  });

  }

  loadChats(afs: AngularFirestore ) {
    this.chatCollection = afs.collection<Chat>('chats');
    this.chatsObs = this.chatCollection.snapshotChanges().pipe(
    map(actions => {
        return actions.map(a => {
        const data = a.payload.doc.data() as Chat;
        data.id = a.payload.doc.id;
        return data;
        });
}));
}

addNewChat( chat: Chat ) {
  this.chatCollection.doc(chat.userId).set({
      idUser: chat.userId
  });
  this.chatCollection.doc(chat.userId).collection('messages').add(chat);

  this.chatCollection.doc(chat.coworkerId).set({
    idUser: chat.coworkerId
});
  this.chatCollection.doc(chat.coworkerId).collection('messages').add(chat);
}

getChats( userId: string) {
  this.chatsUsers = this.afs.collection('chats').doc(userId).collection('messages', ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
    map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Chat;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  return this.chatsUsers;
}




}
