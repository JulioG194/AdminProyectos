import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { LoginRegisterComponent } from './login-register/login-register.component';


const appRoutes: Routes = [
    { path: '', component: HomepageComponent},
    { path: 'login-register', component: LoginRegisterComponent}

];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { onSameUrlNavigation: 'reload', useHash: true } );
