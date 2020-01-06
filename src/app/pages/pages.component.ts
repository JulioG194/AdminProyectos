import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor( private router: Router ) { }
   // tslint:disable-next-line:member-ordering
   @ViewChild(IgxNavigationDrawerComponent, { static: true })
   public drawer: IgxNavigationDrawerComponent;



    public navItems = [
      { name: 'home', text: 'Inicio' , path: '/dashboard', submodule: false },
      { name: 'group', text: 'Mi Equipo' , path: '/my-team', submodule: false },
      { name: 'today', text: 'Proyectos' , path: '/projects', submodule: true },
      { name: 'av_timer', text: 'Cronograma' , path: '/schedule', submodule: false },
      { name: 'chat', text: 'Chat' , path: '/chat', submodule: false },
      { name: 'home', text: 'Perfil' , path: '/user-profile', submodule: false },
      { name: 'group', text: 'kanban' , path: '/activities', submodule: false }
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
      this.router.navigate([item.path]);


      if (!this.drawer.pin) {
        this.drawer.close();
      }
    }

}
