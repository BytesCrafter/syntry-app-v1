import { Component, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { AppComponent } from 'src/app/app.component';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Page } from '@ionic/core';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
})
export class QrscanPage implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  previous = null;
  lastLog: number;
  retries: any = 0;
  dname: any = 'Hello!';
  timespan: any = 1; //do not set
  get countdown(): number {
      return this.timespan - this.retries;
  }

  videoStream = null;
  canvasElement: any;
  videoElement: any;
  canvasContext: any;

  scanActive = false;
  loading: HTMLIonLoadingElement = null;
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

  focusValue = 1;
  previouslyCorrected = false;
  isResizing = false;

  attendance: any[] = [];

  constructor(
    public util: UtilService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private auth: AuthService,
    public app: AppComponent,
    private router: Router,
  ) {
    this.api.post('users/permissions', {}).subscribe((response: any) => {
      let authorized = false;
      if(response.success) {
        if(response.admin) {
          authorized = true;
        } else {
          if(typeof response.data.can_use_biometric !== 'undefined') {
            authorized = response.data.can_use_biometric ? true:false;
          }
        }
        if(!authorized) {
          this.router.navigate(['/']);
        }
      }
    });

    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }

    this.lastLog = new Date().getTime();
    setInterval(()=> {
      const timer = new Date().getTime() - this.lastLog;
      const seconds = timer/1000;
      if( seconds > 10) {
        this.retries = 0;
        this.previous = null;
        this.scanActive = true;
        this.isSending = false;
        this.lastLog = new Date().getTime();
      }
    }, 1000);

    this.focusValue = Number(localStorage.getItem('focusValue'));
    let supportsOrientationChange = 'onorientationchange' in window,
      orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
    window.addEventListener(orientationEvent, () => {
        this.videoStream = null;
        this.startScan();
    }, false);

    this.api.posts('attendance/clocked_in_list', {}).then((response: any) => {
      if(response.success) {
        this.previous = null;

        const clockedIn: any[] = response.data;
        clockedIn.forEach(attd => {
          this.attendance.push(
            {
              avatar: attd.image,
              fname: attd.first_name,
              lname: attd.last_name,
              stamp: attd.in_time,
              color: attd.out_time ? 'danger' : 'success',
              event: attd.out_time ? ' OUT ' : ' IN '
            }
          );
        });

      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(!this.isResizing) {
      this.isResizing = true;
      this.videoStream = null;
      this.startScan();
    }
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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
    this.startScan();
  }

  async startScan() {
    // Not working on iOS standalone mode!
    if(this.videoStream === null) {

      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          height: screen.height / 2,
          width: screen.width
        }
      })
      .then(this.gotMedia.bind(this))
      .catch(err => console.error('getUserMedia() failed: ', err));
    }

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

  gotMedia(mediastream) {
    const track = mediastream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    const focusInt: number = this.focusValue;

    // Check whether focus distance is supported or not.
    if (!capabilities.focusDistance) {
      this.util.modalAlert('NOT SUPPORTED', '', 'Sorry, manual focus not supported!');
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
    this.isResizing = false;

    return mediastream;
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

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

      if (code) {
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

        this.scanActive = true;
      }
    }

    // this.previous = null;
    // this.retries = 0;
    requestAnimationFrame(this.scan.bind(this));
  }

  async logtime(userId: any = 0) {
    this.lastLog = new Date().getTime();
    this.retries += 1;

    //New user clocked in.
    if(this.previous !== userId ) {
      this.retries = 0;
      this.previous = userId;
      this.statusColor = 'primary';

      this.dname = 'Hello!';
      await this.api.posts('users/get', {
        current: userId
      }).then(async (response: any) => {
        if(response.success) {
          this.dname = 'Hey! ' + response.data.fname;
        }
      });
      this.startScan();
    } else {
      if(this.countdown !== 0) {
        this.startScan();
        return;
      }

      this.retries = 0;
      this.previous = null;
      this.trySend(userId); //Validated! Send clocked in.
    }
  }

  async trySend(userId: any = 0) {
    this.scanActive = false;
    this.isSending = true;

    this.api.post('attendance/biotime', {
      current: userId
    }).subscribe(async (res: any) => {

      if(res.success === false) {
        this.util.modalAlert('Action not Allowed', res.message);
        await this.sleep(3000);
        this.resetScan();
        return;
      }

      this.util.playAudio();
      const premsg = res.clocked ? 'Goodbye! ' : 'Welcome! ';
      this.util.modalAlert(premsg, res.stamp, res.data.fname +' '+ res.data.lname);

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

      await this.sleep(3000);
      this.resetScan();
    });
  }

  resetScan() {
    this.retries = 0;
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
