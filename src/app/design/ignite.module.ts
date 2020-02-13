import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';

import {IgxButtonModule,
        IgxIconModule,
        IgxLayoutModule,
        IgxNavigationDrawerModule,
        IgxRadioModule, IgxRippleModule,
        IgxSwitchModule, IgxToggleModule,
        IgxTooltipModule,
        IgxDropDownModule,
        IgxNavbarModule } from 'igniteui-angular';


@NgModule({
  imports: [
    //BrowserModule,
  //  BrowserAnimationsModule,
    FormsModule,
    IgxButtonModule,
    IgxIconModule,
    IgxLayoutModule,
    IgxNavigationDrawerModule,
    IgxRadioModule,
    IgxRippleModule,
    IgxSwitchModule,
    IgxToggleModule,
    IgxTooltipModule,
    IgxDropDownModule,
    IgxNavbarModule
  ],
  exports: [
   // BrowserModule,
 //   BrowserAnimationsModule,
    FormsModule,
    IgxButtonModule,
    IgxIconModule,
    IgxLayoutModule,
    IgxNavigationDrawerModule,
    IgxRadioModule,
    IgxRippleModule,
    IgxSwitchModule,
    IgxToggleModule,
    IgxTooltipModule,
    IgxDropDownModule,
    IgxNavbarModule
  ]
})
export class IgniteModule {}
