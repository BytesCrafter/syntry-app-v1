import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  public scheds: any[] = [];

  constructor(
    private api: ApiService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.api.posts('attendance/my_sched', {}).then((res: any) => {
      if(res && res.success === true) {
        this.scheds.push(res.data.mon);
        this.scheds.push(res.data.tue);
        this.scheds.push(res.data.wed);
        this.scheds.push(res.data.thu);
        this.scheds.push(res.data.fri);
        this.scheds.push(res.data.sat);
        this.scheds.push(res.data.sun);
      } else {
        this.scheds = null;
      }
    }).catch(error => {
      this.util.modalAlert('Error', 'Something went wrong!');
      console.log('error', error);
    });
  }

  getDayName(dayInt) {
    if(dayInt === 0) {
      return 'Monday';
    } else if(dayInt === 1) {
      return 'Tuesday';
    } else if(dayInt === 2) {
      return 'Wednesday';
    } else if(dayInt === 3) {
      return 'Thursday';
    } else if(dayInt === 4) {
      return 'Friday';
    } else if(dayInt === 5) {
      return 'Saturday';
    } else {
      return 'Sunday';
    }
  }

}
