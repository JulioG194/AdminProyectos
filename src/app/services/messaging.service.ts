import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  notif: any;
  constructor(private afMessaging: AngularFireMessaging,
              public snackBar: MatSnackBar ) {
    // this.afMessaging.messaging.subscribe((msging) => {
    //   msging.onMessage = msging.onMessage.bind(msging);
    // });
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }

  success(msg: string) {
    this.config['panelClass'] = ['success', 'notification']
    this.snackBar.open(msg, '', this.config );
  }

  error(msg: string) {
    this.config['panelClass'] = ['error', 'notification']
    this.snackBar.open(msg, '', this.config );
  }

  requestPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => {
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
