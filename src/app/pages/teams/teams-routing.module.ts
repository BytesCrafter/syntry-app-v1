import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'members',
        pathMatch: 'full'
      },
      {
        path: 'members',
        loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule),
        data: { team: true }
      },
      // {
      //   path: 'schedule',
      //   loadChildren: () => import('../schedule/schedule.module').then( m => m.SchedulePageModule),
      //   data: { team: true }
      // },
      // {
      //   path: 'attendance',
      //   loadChildren: () => import('../leaves/leaves.module').then( m => m.LeavesPageModule),
      //   data: { team: true }
      // },
      // {
      //   path: 'overtime',
      //   loadChildren: () => import('../leaves/leaves.module').then( m => m.LeavesPageModule),
      //   data: { team: true }
      // },
      // {
      //   path: 'leaves',
      //   loadChildren: () => import('../leaves/leaves.module').then( m => m.LeavesPageModule),
      //   data: { team: true }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsPageRoutingModule {}
