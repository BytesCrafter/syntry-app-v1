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
    private api: ApiService
  ) {
    this.api.get('attendance/my_clocked_in_list').subscribe((response: any) => {
      if(response.success) {
        this.previous = null;

        const clockedIn: any[] = response.data;
        clockedIn.forEach(attd => {
          this.attendance.push(
            {
              avatar: attd.avatar,
              fname: attd.fname,
              lname: attd.lname,
              stamp: attd.in_time,
              color: attd.out_time ? 'danger' : 'success',
              event: attd.out_time ? ' OUT ' : ' IN '
            }
          );
        });

      }
    });
  }

  ngOnInit() {
  }

}
