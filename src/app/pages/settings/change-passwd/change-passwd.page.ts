import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-change-passwd',
  templateUrl: './change-passwd.page.html',
  styleUrls: ['./change-passwd.page.scss'],
})
export class ChangePasswdPage implements OnInit {

  oldpass: any = null;
  newpass: any = null;
  confirmpass: any = null;

  constructor(
    private api: ApiService,
    private util: UtilService
  ) { }

  ngOnInit() {
  }

  changepass() {
    this.api.posts('users/changepass', {
      oldpass: this.oldpass,
      newpass: this.newpass,
      confirmpass: this.confirmpass,
    }).then((res: any) => {
      if(res && res.success === true) {
        this.oldpass = '';
        this.newpass = '';
        this.confirmpass = '';
        this.util.modalAlert('Success', res.message);
      } else {
        this.util.modalAlert('Warning', res.message);
      }
    }).catch(error => {
      this.util.modalAlert('Error', 'Something went wrong!');
      console.log('error', error);
    });
  }

}
