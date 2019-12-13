import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

 /*  title: string; */

    value = 'Gu.Go';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

   title = 'Gu.go';

  constructor(private breakpointObserver: BreakpointObserver, 
              private router: Router) { }

  ngOnInit() {

  }
  public ProbarlaApp() {
    this.router.navigate(['/dashboard']);
  }


}
