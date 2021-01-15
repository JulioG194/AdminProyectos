import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.interface';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  panelOpenState = false;
  post = true;
  nots: any[] = [];

  userGugo: User = {
    displayName: '',
    email: '',
    password: '',
    uid: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photoURL: '',
    manager: false,
    phoneNumber: '',
  };

  value = 'Gu.Go';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  title = 'Gu.Go';
  manager = '';
  isLoading = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.authService.getUser(this.authService.userAuth).subscribe((user) => {
      this.userGugo = user;
      if (this.userGugo.manager === true) {
        this.manager = 'Gestor de Proyectos';
      } else {
        this.manager = 'Delegado';
      }
      this.isLoading = false;
      this.getNotifications(this.userGugo.uid);
    });
  }
  public ProbarlaApp() {
    this.router.navigate(['/dashboard']);
  }

  public openNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  public editUser() {
    this.router.navigate(['/user-profile']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['']).then(() => {
      location.reload();
    });
  }

  getNotifications(uid: string) {
    this.projectService.getNotifications(uid).subscribe(nots => {
      this.nots = nots;
      console.log(this.nots);
    });
  }
}
