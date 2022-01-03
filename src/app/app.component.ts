import { Component } from '@angular/core';
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
    // { title: 'Camera', url: '/camera', icon: 'camera' },
    // { title: 'Gallery', url: '/gallery', icon: 'images' },
    { title: 'Biometrix', url: '/qrscan', icon: 'qr-code' },
  ];
  public labels = ['Logout'];

  constructor(
    public util: UtilService,
    public auth: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  openMenu() {
    this.menuCtrl.toggle();
  }

  logout() {
    localStorage.clear();
    this.router.navigate([`/login`], { replaceUrl: true });
  }

}
