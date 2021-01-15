import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {IgxButtonModule,
        IgxIconModule,
        IgxLayoutModule,
        IgxBadgeModule,
        IgxAvatarModule,
        IgxNavigationDrawerModule,
        IgxRadioModule, IgxRippleModule,
        IgxSwitchModule, IgxToggleModule,
        IgxTooltipModule,
        IgxDropDownModule,
        IgxNavbarModule } from 'igniteui-angular';


@NgModule({
  imports: [
    FormsModule,
    IgxButtonModule,
    IgxIconModule,
    IgxLayoutModule,
    IgxBadgeModule,
    IgxAvatarModule,
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
    IgxNavbarModule,
    IgxBadgeModule,
    IgxAvatarModule,
  ]
})
export class IgniteModule {}
