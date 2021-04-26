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

  attendance: any[] = [];
  previous: any;
  retries: any = 0;
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

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

    // for(var i=0; i< 50; i++) {
    //   this.attendance.push(
    //     {
    //       avatar: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
    //       fname: 'Juan',
    //       lname: 'Dela Cruz',
    //       stamp: 'April 4, 2021 10:12 PM'
    //     }
    //   );
    // }
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

  logtime(data) {

    let user = JSON.parse(data);
    //console.log('ID: ' + user.id);

    const param = {};
    this.api.post('attendance/logtime/'+user.id, param).subscribe((res: any) => {
      if(res.success === true) {
        this.api.get('users/get/'+user.id).subscribe((response: any) => {
          //console.log(response);
          if(response.success) {
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
        });
      } else {
        this.util.showToast(res.message, 'dark', 'top');
      }
    });
  }

  // Helper functions
  async showQrToast() {
    if(this.scanResult === '' || this.scanResult) {
      if(this.previous !== this.scanResult ) {
        this.previous = this.scanResult;
        this.logtime(this.scanResult);
      } else {
        this.retries += 1;
        let remain = 3 - this.retries;

        if(remain == 0) {
          this.retries = 0;
          this.previous = '';
          this.util.showToast('You can now log your time. Try now!', 'dark', 'bottom');
        } else {
          this.util.showToast('Try again for ' + remain + ' to reset.', 'dark', 'bottom');
        }
      }
      await this.sleep(3000);
      this.startScan();
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
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
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
        this.showQrToast();
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
        this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }
}
