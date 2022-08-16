import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Attendance', url: '/attendance', icon: 'alarm' },
    { title: 'Schedule', url: '/schedule', icon: 'calendar' },
    { title: 'Overtime', url: '/overtime', icon: 'timer'},
    { title: 'Teams', icon: 'people', open: true, children: [
      { title: 'Members', url: '/teams/members', icon: 'person' },
      // { title: 'Schedule', url: '/teams/schedule', icon: 'calendar' },
      // { title: 'Attendance', url: '/teams/attendance', icon: 'alarm'},
      // { title: 'Overtime', url: '/teams/overtime', icon: 'timer' },
      // { title: 'Leaves', url: '/teams/leaves', icon: 'footsteps' },
    ]},
    { title: 'Settings', url: '/settings', icon: 'settings' },
    // { title: 'Camera', url: '/camera', icon: 'camera' },
    // { title: 'Gallery', url: '/gallery', icon: 'images' },
    //{ title: 'Biometrix', url: '/qrscan', icon: 'qr-code' }
  ];
  public labels = ['Logout'];

  constructor(
    public util: UtilService,
    public auth: AuthService,
    private router: Router,
    private api: ApiService,
    private menuCtrl: MenuController
  ) {
    this.auth.loadPermission();
  }

  openMenu() {
    this.menuCtrl.toggle();
  }

  openBio() {
    this.router.navigate(['/qrscan']);
  }

  openBiov2() {
    this.router.navigate(['/rfid']);
  }

  reloadPage() {
    location.reload();
  }

  logout() {
    localStorage.clear();
    this.router.navigate([`/login`], { replaceUrl: true });
    //If user have manage timecard then add
    // this.api.post('users/logout', {}).subscribe((response: any) => {
    //   if(response.success) {
    //     localStorage.clear();
    //     this.router.navigate([`/login`], { replaceUrl: true });
    //   } else {
    //     console.log('Something went wrong');
    //   }
    // });
  }

}
