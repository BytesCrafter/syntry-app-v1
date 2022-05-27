import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { BiometGuard } from './guard/biomet.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
      },
      {
        path: 'schedule',
        loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.SchedulePageModule)
      },
      {
        path: 'camera',
        loadChildren: () => import('./reserved/camera/camera.module').then( m => m.CameraPageModule),
      },
      {
        path: 'gallery',
        loadChildren: () => import('./reserved/gallery/gallery.module').then( m => m.GalleryPageModule),
      },
      {
        path: 'change-passwd',
        loadChildren: () => import('./pages/change-passwd/change-passwd.module').then( m => m.ChangePasswdPageModule)
      },
      {
        path: 'qrscan',
        loadChildren: () => import('./pages/qrscan/qrscan.module').then( m => m.QrscanPageModule),
        canActivate: [BiometGuard]
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'notfound',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  {
    path: '**',
    redirectTo: 'notfound'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
