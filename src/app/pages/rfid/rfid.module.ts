import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RfidPageRoutingModule } from './rfid-routing.module';

import { RfidPage } from './rfid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RfidPageRoutingModule
  ],
  declarations: [RfidPage]
})
export class RfidPageModule {}
