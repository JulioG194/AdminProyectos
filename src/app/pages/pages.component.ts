import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor() { }

   // tslint:disable-next-line:member-ordering
   @ViewChild(IgxNavigationDrawerComponent, { static: true })
   public drawer: IgxNavigationDrawerComponent;



    public navItems = [
      { name: 'home', text: 'Inicio' },
      { name: 'group', text: 'Mi Equipo' },
      { name: 'today', text: 'Proyectos' },
      { name: 'av_timer', text: 'Cronograma' },
      { name: 'chat', text: 'Chat' }
    ];
    public selected = 'Avatar';
    // tslint:disable-next-line:member-ordering

    public drawerState = {
      miniTemplate: true,
      open: true,
      pin: false
    };

  ngOnInit() {
  }

    /** Select item and close drawer if not pinned */
    public navigate(item) {
      this.selected = item.text;
      if (!this.drawer.pin) {
        this.drawer.close();
      }
    }

}
