import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HeaderComponent } from './header/header.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { AngularMaterialModule } from '../design/angular-material.module';
import { IgniteModule } from '../design/ignite.module';



@NgModule({
  declarations: [HeaderComponent, NopagefoundComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    IgniteModule
  ],
  exports: [
    AngularMaterialModule,
    CommonModule,
    IgniteModule,
    HeaderComponent
  ]
})
export class SharedModule { }
