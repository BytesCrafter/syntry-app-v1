import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswdPage } from './change-passwd.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswdPageRoutingModule {}
