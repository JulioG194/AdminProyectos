import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  message;
  notification;
  constructor(
    private msgService: MessagingService,
    private afMessaging: AngularFireMessaging
  ) {}
  title = 'AdminProyectos';

  ngOnInit() {
    this.msgService.requestPermission();
    this.afMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      const { notification } = payload;
      const { body, title } = notification;
      // this.snackBar.open(body, 'OK', { duration: 2000 });
      this.msgService.success(body);
    });
  }
}
