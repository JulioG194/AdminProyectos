import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 /*  title: string; */
 panelOpenState = false;
 post = true;
 notifications: string [] = ['Notificacion','Notificacion','Notificacion','Notificacion','Notificacion','Notificacion','Notificacion','Notificacion','Notificacion','Notificacion','Notificacion'];

 userGugo: User = {
  name: '',
  email: '',
  password: '',
  id: '',
  birthdate: new Date(),
  description: '',
  gender: '',
  photo: '',
  manager: false,
  google: false,
  phone_number: ''
};
 
    value = 'Gu.Go';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

   title = 'Gu.go';

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {

    this.authService.getUser(this.authService.userAuth)
    .subscribe(user => {(this.userGugo = user); });

  }
  public ProbarlaApp() {
    this.router.navigate(['/dashboard']);
  }


  public openNotifications(){
    this.router.navigateByUrl('/notifications')
  }

  public editUser() {
    this.router.navigate(['/user-profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']). then(() => {
      // do whatever you need after navigation succeeds
      location.reload();
    });
  }
}
