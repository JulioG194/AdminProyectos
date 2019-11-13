import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styles: []
})
export class HomepageComponent implements OnInit {

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  public ProbarlaApp() {
    this.router.navigate(['./login-register']);
  }

}
