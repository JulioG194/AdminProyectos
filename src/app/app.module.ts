import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routes';

// temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modulos
import { SharedModule } from './shared/shared.module';
import { AngularMaterialModule } from './design/angular-material.module';
import { IgniteModule } from './design/ignite.module';


// Componentes
import { AppComponent } from './app.component';
import { HomepageComponent } from './main pages/homepage/homepage.component';
import { LoginRegisterComponent } from './main pages/login-register/login-register.component';
import { PagesComponent } from './pages/pages.component';




@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginRegisterComponent,
    PagesComponent,
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AngularMaterialModule,
    IgniteModule,
    BrowserAnimationsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
