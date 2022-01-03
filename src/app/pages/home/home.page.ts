import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  previous = null;
  attendance: any[] = [];

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {
    this.api.get('attendance/my_clocked_in_list').subscribe((response: any) => {
      if(response.success) {
        this.previous = null;

        const clockedIn: any[] = response.data;
        clockedIn.forEach(attd => {
          this.attendance.push(
            {
              avatar: auth.userToken.avatar,
              timein: attd.in_time,
              timeout: attd.out_time,
              duration: attd.duration
            }
          );
        });

      }
    });
  }

  ngOnInit() {
  }

}
