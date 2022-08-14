import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import jsQR from 'jsqr';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
})
export class QrscanPage implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  videoStream = null;
  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  sColor = 'light';
  get statusColor(): string {
    if(this.isSending) {
      return 'warning';
    } else {
      if(this.previous !== null) {
        return this.scanActive ? 'primary' : 'secondary';
      } else {
        if(this.scanActive) {
          return 'success';
        } else {
          return 'danger';
        }
      }
    }
  }
  set statusColor(value: string) {
      this.sColor = value;
  }
  isSending = false;
  get statusSize(): string {
    if(this.isSending) {
      return 'large';
    } else {
      return 'small';
    }
  }

  attendance: any[] = [];
  lastLog: number;
  public curDate: Date = new Date();
  previous = null;
  dname: any = 'Ready!';
  scanActive = false;
  focusValue = 1;

  constructor(
    public util: UtilService,
    private api: ApiService,
    public app: AppComponent,
  ) {
    this.api.posts('attendance/clocked_in_list', {}).then((response: any) => {
      if(response.success) {
        const clockedIn: any[] = response.data;
        clockedIn.forEach(attd => {
          this.attendance.push({
              avatar: attd.image,
              fname: attd.first_name,
              lname: attd.last_name,
              stamp: attd.in_time,
              color: attd.out_time ? 'danger' : 'success',
              event: attd.out_time ? ' OUT ' : ' IN '
          });
        });
      }
    });

    this.lastLog = new Date().getTime();
    setInterval(()=> {
      this.curDate = new Date();

      if( this.scanActive && this.sinceLastLog() < 5) {
        return;
      }

      this.previous = null;
      this.scanActive = true;
      this.isSending = false;
      this.lastLog = new Date().getTime();
    }, 1000);
  }

  /**
   *
   * @returns returns time in seconds since last log.
   */
  sinceLastLog() {
    const timer = new Date().getTime() - this.lastLog;
    return timer/1000;
  }

  onSliderEvent(event) {
    if(this.videoStream) {
      const track = this.videoStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      const focusInt: number = this.focusValue;

      // Check whether focus distance is supported or not.
      if (!capabilities.focusDistance) {
        console.log('Sorry, manual focus not supported');
      } else {

        track.applyConstraints({
          advanced: [
            {
              focusMode: 'manual',
              focusDistance: focusInt
            }
          ]
        });
      }
    }
    localStorage.setItem('focusValue', this.focusValue.toString());
  }

  loadData(event) {
    event.target.complete();
  }

  sleep(ms) {
    setTimeout(() => {
      this.resetScan();
    }, ms);
  }

  async ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;

    this.focusValue = Number(localStorage.getItem('focusValue'));
    this.startScan();
  }

  async startScan() {
    // Not working on iOS standalone mode!
    if(this.videoStream === null) {

      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 720,
          height: 720,
          facingMode: 'user'
        }
      })
      .then(this.gotMedia.bind(this))
      .catch(err => console.error('getUserMedia() failed: ', err))
      .finally(() => {
        console.log('Video stream started.');
      });
    }

    requestAnimationFrame(this.scan.bind(this));
  }

  gotMedia(mediastream) {
    const track = mediastream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    const focusInt: number = this.focusValue;

    // Check whether focus distance is supported or not.
    if (!capabilities.focusDistance) {
      //this.util.modalAlert('NOT SUPPORTED', '', 'Sorry, manual focus not supported!');
    } else {
      track.applyConstraints({
        advanced: [{
            focusMode: 'manual',
            focusDistance: focusInt
        }]
      });
    }

    this.videoElement.srcObject = mediastream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    return mediastream;
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {

      this.scanActive = true;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (!this.isSending && code) {
        //Temporary disable scan to take time for qr processing.
        this.scanActive = false;

        const data: any = code.data;
        if( this.util.isJsonValid(data) ) {
          const user = JSON.parse(data);
          if(typeof user.id !== 'undefined' && user.id !== null && user.id !== '') {
            this.logtime(user.id);
            return;
          }
        }
      }
    }

    requestAnimationFrame(this.scan.bind(this));
  }

  async logtime(userId: any = 0) {
    this.lastLog = new Date().getTime();

    //New user clocked in.
    if(this.previous !== userId ) {
      this.previous = userId;
      this.statusColor = 'primary';

      this.dname = 'Verifying...';
      await this.api.posts('users/get', {
        current: userId
      }).then(async (response: any) => {
        if(response.success) {
          this.dname = 'Hey! ' + response.data.fname;
        }
      });
      this.startScan();
    } else {
      this.previous = null;
      this.trySend(userId); //Validated! Send clocked in.
    }
  }

  async trySend(userId: any = 0) {
    this.isSending = true;

    this.api.post('attendance/biotime', {
      current: userId
    }).subscribe(async (res: any) => {
      this.dname = 'Ready!';

      if(res.success === false) {
        this.util.modalAlert('Action not Allowed', res.message);
        this.sleep(3000);
        return;
      }

      this.util.playAudio();
      let premsg = res.clocked ? 'Goodbye! ' : 'Welcome! ';
      if(typeof res.break !== 'undefined' && typeof res.in !== 'undefined') {
        premsg = res.in?'Enjoy your break!':'Welcome back, glad your here.';
        this.attendance.unshift(
          {
            avatar: res.data.image,
            fname: res.data.fname,
            lname: res.data.lname,
            stamp: res.stamp,
            color: 'secondary',
            event: ' BREAK '
          }
        );
      } else {
        this.attendance.unshift(
          {
            avatar: res.data.image,
            fname: res.data.fname,
            lname: res.data.lname,
            stamp: res.stamp,
            color: res.clocked ? 'danger' : 'success',
            event: res.clocked ? ' OUT ' : ' IN '
          }
        );
      }
      this.util.modalAlert(premsg, res.stamp, res.data.fname +' '+ res.data.lname);

      this.sleep(3000);
    });
  }

  resetScan() {
    this.previous = null;
    this.scanActive = true;
    this.isSending = false;
    this.startScan();
  }

  stopScan() {
    this.scanActive = false;
  }

  ngOnDestroy() {
    this.videoStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}
