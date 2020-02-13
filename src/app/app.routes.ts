import { RouterModule, Routes } from '@angular/router';

// import { HomepageComponent } from './main pages/homepage/homepage.component';
import { LoginRegisterComponent } from './main pages/login-register/login-register.component';
import { PagesComponent } from './pages/pages.component';






const appRoutes: Routes = [
  //  { path: '', component: HomepageComponent},
    { path: '', component: LoginRegisterComponent},
    {
        path: '',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModule'
    },

];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, {  useHash: true } );
