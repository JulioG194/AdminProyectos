import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: string [] = ['Mi Equipo: Julio te ha unido asu equipo de trabajo',
                              'Tarea: Has sido asignado a una nueva tarea',
                              'Mi Equipo: El Gestor te ha removido de su equipo',
                              'Tarea: Julio ha corregido el avance de una tarea',
                              'Tarea: Julio ha aprobado tu avance en una tarea',
];
    userGugo: User;
    userApp: User;
    nots: any[] = [];

  constructor(private projectService: ProjectService,
              private authService: AuthService,
              private router: Router, ) { }

  ngOnInit() {
    this.userApp = this.authService.userAuth;
    this.authService.getUser(this.authService.userAuth).subscribe((user) => {
      this.userGugo = user;
      this.getNotifications(this.userGugo.uid);
    });
  }

  getNotifications(uid: string) {
    this.projectService.getNotificationsD(uid).subscribe(nots => {
      this.nots = nots;
      console.log(this.nots);
    });
  }

  goNotification(idNotification: string, clickWeb: string) {
    this.projectService.updateNotification(this.userApp, idNotification);
    this.router.navigateByUrl(clickWeb);
  }

}
