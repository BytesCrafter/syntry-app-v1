import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isLoading: any = true;
  myInterval = null;
  advisories: any[] = [];

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private util: UtilService
  ) {
    this.getAdvisories();
  }

  async getAdvisories() {
    this.isLoading = true;

    this.api.posts('announcements/list', {}).then((response: any) => {
      this.serverDatetime = new Date(response.stamp);

      if(response.success) {
        this.advisories = response.data;
      } else {
        this.util.modalAlert(
          'Something went wrong',
          this.serverDatetime.toLocaleTimeString(),
          'The server did not respond accordingly.'
        );
      }
    }).catch(error => {
      this.util.modalAlert('Error', 'Something went wrong!');
      console.log('error', error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  stringToHtml(str) {
    const parser = new DOMParser();
	  return parser.parseFromString(str, 'text/html');
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
