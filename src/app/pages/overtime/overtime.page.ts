import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.page.html',
  styleUrls: ['./overtime.page.scss'],
})
export class OvertimePage implements OnInit {

  isLoading: any = true;
  myInterval = null;
  previous = null;
  overtime: any[] = [];

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private util: UtilService
  ) {
    this.getMyClockedList();
  }

  getMyClockedList() {
    this.api.get('overtime/my_clocked_in_list').subscribe((response: any) => {
      this.serverDatetime = new Date(response.status.local_time);

      if(response.success) {

        if(this.myInterval) {
          clearInterval(this.myInterval);
        }

        this.myInterval = setInterval(() => {
          this.serverDatetime.setSeconds(this.serverDatetime.getSeconds() + 1);
        }, 1000);

        if(response.status.clocked_in) {
          this.clockedinDatetime = new Date(response.status.clocked_in); //Issue
        } else {
          this.clockedinDatetime = null;
        }

        this.previous = null;
        this.overtime = [];
        const clockedIn: any[] = response.data;
        clockedIn.forEach(attd => {
          this.overtime.push(
            {
              id: attd.id,
              timein: attd.start_time,
              timeout: attd.end_time,
              duration: attd.duration
            }
          );
        });

      } else {
        this.util.modalAlert(
          'Something went wrong',
          this.serverDatetime.toLocaleTimeString(),
          'The server did not respond accordingly.'
        );
      }

      this.isLoading = false;
    });
  }

  public get isClockedIn(): any {
    return this.clockedinDatetime ? true:false;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private serverDatetime: Date = new Date();
  public get currentDate(): any {
    return this.serverDatetime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  public get currentTime(): any {
    return this.serverDatetime.toLocaleTimeString();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private clockedinDatetime: Date = new Date();
  public get currentDatestart(): any {
    return 'Started'+moment(this.clockedinDatetime).format(' on h:mm:ss A of Do MMMM YYYY');
  }
  public get currentTimespan(): any {
    const start = moment(this.clockedinDatetime);
    const end = moment(this.serverDatetime);
    const duration = moment.duration(end.diff(start));
    // eslint-disable-next-line max-len
    return Math.floor(duration.asHours())+'h '
      +Math.floor(duration.asMinutes() % 60)+'m '
      +Math.floor(duration.asSeconds() % 60)+'s';
  }

  ngOnInit() {
  }

  logTime() {
    const userId = this.auth.userToken.id;
    this.api.post('overtime/logtime/'+userId, {
      self: this.auth.userToken.uuid
    }).subscribe(async (res: any) => {

      if(res.success === false) {
        this.util.modalAlert('Action not Allowed', res.message);
        await this.sleep(3000);
        return;
      }

      this.util.playAudio();
      const premsg = res.clocked ? 'Goodbye! ' : 'Welcome! ';
      this.util.modalAlert(premsg, res.stamp, res.data.fname +' '+ res.data.lname);

      this.getMyClockedList();
      await this.sleep(3000);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
