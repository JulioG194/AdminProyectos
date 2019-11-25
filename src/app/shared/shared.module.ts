import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { AngularMaterialModule } from '../design/angular-material.module';
import { NavdrawerComponent } from './navdrawer/navdrawer.component';
import { IgniteModule } from '../design/ignite.module';



@NgModule({
  declarations: [HeaderComponent, SidebarComponent, NopagefoundComponent, NavdrawerComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    IgniteModule
  ],
  exports: [
    AngularMaterialModule,
    CommonModule,
    IgniteModule,
    HeaderComponent,
    NavdrawerComponent
  ]
})
export class SharedModule { }
