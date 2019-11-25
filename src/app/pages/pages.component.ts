import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor() { }

   // tslint:disable-next-line:member-ordering
   @ViewChild(IgxNavigationDrawerComponent, { static: true })
   public drawer: IgxNavigationDrawerComponent;



    public navItems = [
      { name: 'account_circle', text: 'Avatar' },
      { name: 'error', text: 'Badge' },
      { name: 'group_work', text: 'Button Group' },
      { name: 'home', text: 'Card' },
      { name: 'view_carousel', text: 'Carousel' },
      { name: 'date_range', text: 'Date picker' },
      { name: 'all_out', text: 'Dialog' },
      { name: 'web', text: 'Forms' },
      { name: 'android', text: 'Icon' },
      { name: 'list', text: 'List' },
      { name: 'arrow_back', text: 'Navbar' },
      { name: 'menu', text: 'Navdrawer' },
      { name: 'poll', text: 'Progress Indicators' },
      { name: 'linear_scale', text: 'Slider' },
      { name: 'swap_vert', text: 'Scroll' },
      { name: 'feedback', text: 'Snackbar' },
      { name: 'tab', text: 'Tabbar' },
      { name: 'android', text: 'Toast' }
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
