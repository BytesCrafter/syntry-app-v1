import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any = '';
  password: any = '';
  loggedIn: boolean;

  constructor(
    public util: UtilService,
    private auth: AuthService,
    private menuController: MenuController,
    private router: Router,
  ) {
    //Check if the is a token in local storage but need to check first.
    if(localStorage.getItem(AuthService.tokenKey) === null) {
      this.menuController.enable(false);
    } else {
      this.menuController.enable(true);
      this.router.navigate([`/`], { replaceUrl: true });
    }
  }

  ngOnInit() {
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
        this.router.navigate([`/`], { replaceUrl: true });
      } else {
        this.util.modalAlert('Action not Allowed', result.message);
      }
      this.loggedIn = false;
    });
  }
}
