import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routes';

// temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


// Modulos
import { SharedModule } from './shared/shared.module';
import { AngularMaterialModule } from './design/angular-material.module';
import { IgniteModule } from './design/ignite.module';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Componentes
import { AppComponent } from './app.component';
import { HomepageComponent } from './main pages/homepage/homepage.component';
import { LoginRegisterComponent } from './main pages/login-register/login-register.component';
import { PagesComponent } from './pages/pages.component';
import { environment } from 'src/environments/environment';
import { MatCarouselModule } from '@ngmodule/material-carousel';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginRegisterComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AngularMaterialModule,
    IgniteModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCarouselModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  exports: [

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
