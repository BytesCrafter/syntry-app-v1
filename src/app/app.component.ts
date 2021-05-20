import { Component } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

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

  get version(): string {
    return environment.version;
  }

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Camera', url: '/camera', icon: 'camera' },
    { title: 'Gallery', url: '/gallery', icon: 'images' },
    { title: 'Biometrix', url: '/qrscan', icon: 'qr-code' },
  ];
  public labels = ['Logout'];
  constructor(
    public util: UtilService,
    private api: ApiService,
    private router: Router,
    private permissions: AndroidPermissions
  ) {
    this.fname = localStorage.getItem('fname');
    this.lname = localStorage.getItem('lname');
    this.email = localStorage.getItem('email');
    this.avatar = localStorage.getItem('avatar');
    // this.api.get('users/token').subscribe((response: any) => {
    //   if(response.success) {
    //     if(response.data.length > 0) {
    //       for (let i = 0; i < response.data.length; i++) {
    //         localStorage.setItem(response.data[i].name, response.data[i].value);
    //       }
    //     }
    //   }
    // });

    this.permissions.checkPermission(this.permissions.PERMISSION.INTERNET)
      .then( result => {
        if(!result.hasPermission) {
          this.permissions.requestPermission(this.permissions.PERMISSION.INTERNET);
        }
      });

    this.permissions.checkPermission(this.permissions.PERMISSION.CAMERA)
      .then( result => {
        if(!result.hasPermission) {
          this.permissions.requestPermission(this.permissions.PERMISSION.CAMERA);
        }
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigate([`/login`], { replaceUrl: true });
  }

}
