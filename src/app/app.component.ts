import { Component, OnInit, Optional } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Messages', url: '/messages', icon: 'chatbox-ellipses' },
    { title: 'Biometric', icon: 'id-card', open: false, children: [
      { title: 'Attendance', url: '/attendance', icon: 'alarm' },
      { title: 'Overtime', url: '/overtime', icon: 'timer'},
      { title: 'Schedule', url: '/schedule', icon: 'calendar' },
    ]},
    { title: 'Organize', icon: 'file-tray-stacked', open: false, children: [
      { title: 'To Do', url: '/todo', icon: 'checkmark-circle' },
      { title: 'Notes', url: '/notes', icon: 'create' },
    ]},
    { title: 'Department', url: '/teams/members', icon: 'people' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
    // { title: 'Camera', url: '/camera', icon: 'camera' },
    // { title: 'Gallery', url: '/gallery', icon: 'images' },
  ];
  public labels = ['Logout'];

  constructor(
    public util: UtilService,
    public auth: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    public msgSvs: MessagingService
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
