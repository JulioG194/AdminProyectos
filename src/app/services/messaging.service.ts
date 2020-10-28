import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  notif: any;
  constructor(private afMessaging: AngularFireMessaging) {
    // this.afMessaging.messaging.subscribe((msging) => {
    //   msging.onMessage = msging.onMessage.bind(msging);
    // });
  }

  requestPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          localStorage.setItem('fcm', token);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      const { notification } = payload;
      this.notif = notification;
      this.currentMessage.next(payload);
    });
  }
}
