import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: string [] = ['Proyecto: "Construccion de torreta Calacali" tiene 5 dias para su culminacion',
                              'Notificacion: David ha subido la evidencia de la tarea "limpieza del sitio"',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion',
                              'Notificacion'];

  constructor() { }

  ngOnInit() {
  }

}
