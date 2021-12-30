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
  fname: any = '';
  lname: any = '';
  email: any = '';
  avatar: any = '';

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
  ) {
    if(this.auth.userToken) {
      this.fname = this.auth.userToken.fullname;
      this.lname = '';
      this.email = this.auth.userToken.email;
      this.avatar = this.auth.userToken.avatar;
    }

    // this.api.get('users/token').subscribe((response: any) => {
    //   if(response.success) {
    //     if(response.data.length > 0) {
    //       for (let i = 0; i < response.data.length; i++) {
    //         localStorage.setItem(response.data[i].name, response.data[i].value);
    //       }
    //     }
    //   }
    // });
  }

  openMenu() {
    this.menuCtrl.toggle();
  }

  logout() {
    localStorage.clear();
    this.router.navigate([`/login`], { replaceUrl: true });
  }

}
