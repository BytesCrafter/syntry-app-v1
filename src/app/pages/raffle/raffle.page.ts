import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import jsQR from 'jsqr';

@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.page.html',
  styleUrls: ['./raffle.page.scss'],
})
export class RafflePage implements AfterViewInit, OnDestroy {
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

  modalActive: any = false;
  modalTitle: any = '';
  modalMsg: any = '';

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
    this.resetScan();
  }

  sinceLastLog() {
    const timer = new Date().getTime() - this.lastLog;
    return timer/1000;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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

      if (this.scanActive && !this.isSending && code) {
        const data: any = code.data;
        if( this.util.isJsonValid(data) ) {
          const epass = JSON.parse(data);
          this.tryJoinRaffle(epass);
          return;
        }
      }
    }

    requestAnimationFrame(this.scan.bind(this));
  }

  resetScan() {
    this.dname = 'Ready!';
    this.previous = null;
    this.scanActive = true;
    this.isSending = false;
    this.startScan();
  }

  stopScan() {
    this.scanActive = false;
    this.dname = 'Busy!';
  }

  ngOnDestroy() {
    this.videoStream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  async tryJoinRaffle(epass: any = false) {
    if(epass.length !== 3 && epass[0] !== 'epass' && epass[1] !== 'verify') {
      return;
    }

    const epassId = epass[2]; //get the uuid
    this.stopScan(); //Make sure scan is disable.

    //TODO: API to join.
    this.isSending = true;
    await this.delay(2000);
    // this.api.post('users/join_raffle', {
    //   uuid: epassId
    // }).subscribe(async (res: any) => {
    //   if(res.success) {

    //   } else {

    //   }
    //   //Move the reset here.
    // });

    this.modalAlert('Congratulation!', 'You successfully join the raffle: '+epassId);
    this.resetScan();//reset ready for the next.
  }

  modalAlert(title, message, timer = 3500) {
    this.modalActive = true;
    this.modalTitle = title;
    this.modalMsg = message;

    setTimeout(() => {
      this.modalActive = false;
      this.modalTitle = '';
      this.modalMsg = '';
    }, timer);
  }
}
