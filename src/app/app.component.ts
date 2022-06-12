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
    { title: 'Overtime', url: '/overtime', icon: 'timer' },
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
