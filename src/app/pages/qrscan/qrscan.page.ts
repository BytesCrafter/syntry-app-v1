import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { AppComponent } from 'src/app/app.component';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
})
export class QrscanPage {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  videoStream = null;
  attendance: any[] = [];
  previous = null;
  retries: any = 0;
  dname: string = 'Hello!';
  cdown: number = 3;
  get countdown(): number {
      return 3 - this.retries;
  }
  set countdown(value: number) {
      this.cdown = value;
  }
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
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

  constructor(
    public util: UtilService,
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    public app: AppComponent
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }

  loadData(event) {
    event.target.complete();
  }

  async ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
    this.startScan();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async logtime(data) {

    if(!this.util.isJsonValid(data)) {
      this.util.showToast('QR code dont have a valid data!', 'dark', 'bottom');
      this.previous = null;
      this.retries = 0;
    } else {
      let user = JSON.parse(data);

      if(typeof user.id === 'undefined' || user.id === null) {
        this.util.showToast('QR code data dont have a valid property!', 'dark', 'bottom');
        this.previous = null;
        this.retries = 0;
      } else {
        this.retries += 1;

        if(this.previous === data ) {

          if(this.countdown === 0) {
            this.retries = 0;
            this.isSending = true;
            this.trySend(user);
            //this.util.showToast('You can now log your time. Try now!', 'dark', 'bottom');
          } else {
            //this.util.showToast('Try again for ' + this.countdown + ' to reset.', 'dark', 'bottom');
          }
        } else {
          this.retries = 0;
          this.previous = data;
          this.statusColor = 'primary';

          this.dname = 'Hello!';
          await this.api.get('users/get/'+user.id).subscribe((response: any) => {
            if(response.success) {
              this.dname = 'Hey! ' + response.data.fname;
            }
          });
        }
      }
    }
  }

  async trySend(user) {

    const param = {
      id: localStorage.getItem('id')
    };
    this.api.post('attendance/logtime/'+user.id, param).subscribe((res: any) => {
      if(res.success === true) {
        this.api.get('users/get/'+user.id).subscribe((response: any) => {
          //console.log(response);
          if(response.success) {
            this.util.playAudio();
            this.previous = null;

            let premsg = res.clocked ? 'Goodbye! ' : 'Welcome! ';
            this.util.showToast(premsg + response.data.fname +' '+ response.data.lname, 'dark', 'bottom');

            this.attendance.unshift(
              {
                avatar: response.data.avatar,
                fname: response.data.fname,
                lname: response.data.lname,
                stamp: res.stamp,
                color: res.clocked ? 'danger' : 'success',
                event: res.clocked ? ' OUT ' : ' IN '
              }
            );
          }
          this.scanResult = null;
          this.countdown = 3;
          this.isSending = false;
          this.startScan();
        });
      } else {
        this.util.showToast(res.message, 'dark', 'bottom');
        this.scanResult = null;
        this.countdown = 3;
        this.isSending = false;
        this.startScan();
      }
    });
  }

  // Helper functions
  async qrcodeDetected() {
    if(this.scanResult && this.scanResult !== '' && this.scanResult !== null) {
      this.logtime(this.scanResult);
      if(!this.isSending) {
        this.startScan();
      }
    }
    //Disable open toast on detect!
    // const toast = await this.toastCtrl.create({
    //   message: `Open ${this.scanResult}?`,
    //   position: 'top',
    //   buttons: [
    //     {
    //       text: 'Open',
    //       handler: () => {
    //         window.open(this.scanResult, '_system', 'location=yes');
    //       }
    //     }
    //   ]
    // });
    // toast.present();
  }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    await this.sleep(500);
    // Not working on iOS standalone mode!
    if(this.videoStream === null) {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      this.videoElement.srcObject = this.videoStream;
      // Required for Safari
      this.videoElement.setAttribute('playsinline', true);

      this.videoElement.play();
    }

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
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
        this.scanActive = false;
        this.scanResult = code.data;
        this.qrcodeDetected();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }

  handleFile(files: FileList) {
    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
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
        this.scanResult = code.data;
        this.qrcodeDetected();
      }
    };
    img.src = URL.createObjectURL(file);
  }
}
