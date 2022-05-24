import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswdPageRoutingModule } from './change-passwd-routing.module';

import { ChangePasswdPage } from './change-passwd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePasswdPageRoutingModule
  ],
  declarations: [ChangePasswdPage]
})
export class ChangePasswdPageModule {}
