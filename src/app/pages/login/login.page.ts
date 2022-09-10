import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any = '';
  password: any = '';
  loggedIn: boolean;
  loadedCompany: boolean;

  siteLogo: any = 'assets/images/logo.png';
  companyName: any = 'Log in with your account';
  themeColor: any = '';

  constructor(
    public util: UtilService,
    private auth: AuthService,
    private menuController: MenuController,
    private router: Router,
    private api: ApiService,
  ) {
    //Check if the is a token in local storage but need to check first.
    if(localStorage.getItem(AuthService.tokenKey) === null) {
      this.menuController.enable(false);
    } else {
      this.menuController.enable(true);
      this.router.navigate([`/`]);
    }
  }

  ngOnInit() {
    this.api.posts('settings/company_info', {}).then((res: any) => {
      if(res.success === true) {
        this.siteLogo = res.logo ? res.logo:this.siteLogo;
        this.companyName = res.title ? res.title:'Log in with your account';
        this.loadedCompany = true;
      }
    }).catch(error => {
      console.log('error', error);
    });
  }

  forgotPass() {
    this.util.modalAlert('Notification', '', 'This feature is not fully implemented yet, thank you for your patience.');
  }

  login() {
    if (!this.email || !this.password) {
      this.util.modalAlert('Notification', 'All Fields are required');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.modalAlert('Notification', 'Please enter valid email');
      return false;
    }
    this.loggedIn = true;

    this.auth.login(this.email, this.password, (result: any) => {
      if(result.success) {
        //const token: Token = result.data;
        this.menuController.enable(true);
        this.email = '';
        this.password = '';
        this.auth.getInfo();
        this.auth.loadPermission();
        this.router.navigate(['/home'])
        .then(() => {
          window.location.reload();
        });
      } else {
        this.util.modalAlert('Action not Allowed', result.message);
      }
      this.loggedIn = false;
    });
  }
}
