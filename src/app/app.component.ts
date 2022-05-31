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
    { title: 'Change Pass', url: '/change-passwd', icon: 'medical' },
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
    this.reloadPermission();
  }

  reloadPermission() {
    if(!this.auth.isAuthenticated) {
      return;
    }

    //If user have manage timecard then add
    this.api.post('users/permissions', {}).subscribe((response: any) => {
      let authorized = false;
      if(response.success) {
        if(response.admin) {
          authorized = true;
        } else {
          if(typeof response.data.can_use_biometric !== 'undefined') {
            authorized = response.data.can_use_biometric ? true:false;
          }
        }
        if(authorized && this.appPages.filter(e => e.title === 'Biometrix').length === 0) {
          this.appPages.push({ title: 'Biometrix', url: '/qrscan', icon: 'qr-code' });
        }
      }
    });
  }

  openMenu() {
    this.menuCtrl.toggle();
  }

  reloadPage() {
    location.reload();
  }

  logout() {
    localStorage.clear();
    this.router.navigate([`/login`], { replaceUrl: true });
  }

}
