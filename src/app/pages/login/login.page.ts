import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private api: ApiService,
    private menuController: MenuController,
    private router: Router,
  ) {
    //Check if the is a token in local storage but need to check first.
    if(localStorage.getItem('token') === null) {
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
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'top');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.showToast(this.util.getString('Please enter valid email'), 'dark', 'top');
      return false;
    }
    this.loggedIn = true;

    const param = {
      email: this.email,
      pword: this.password,
    };

    this.api.post('users/signin', param).subscribe((response: any) => {
      if(response.success === true) {
        localStorage.setItem('id', response.data.user.id);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('fname', response.data.user.fname);
        localStorage.setItem('lname', response.data.user.lname);
        localStorage.setItem('avatar', response.data.user.avatar);
        localStorage.setItem('email', response.data.user.email);
        this.menuController.enable(true);
        this.router.navigate([`/`], { replaceUrl: true });
      } else {
        this.util.showToast(response.message, 'dark', 'top');
      }
      this.loggedIn = false;
    });
  }
}
