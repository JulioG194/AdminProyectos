import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { NoAuthGuard } from './guards/noauth-guard.service';
import { LoginRegisterComponent } from './main pages/login-register/login-register.component';
import { PagesComponent } from './pages/pages.component';

const appRoutes: Routes = [
  { path: '', component: LoginRegisterComponent, pathMatch: 'full', canActivate: [NoAuthGuard]  },
  {
    path: '',
    component: PagesComponent,
    loadChildren: './pages/pages.module#PagesModule',
    canActivate: [AuthGuard]
  }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes);
