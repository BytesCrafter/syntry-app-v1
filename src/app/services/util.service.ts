import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public translations: any[] = [];

  constructor(
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  async showToast(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: colors,
      position: positon
    });
    toast.present();
  }

  async shoNotification(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async errorToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  apiErrorHandler(err) {
    // console.log('Error got in service =>', err)
    if (err.status === -1) {
      this.showErrorAlert('Failed To Connect With Server');
    } else if (err.status === 401) {
      this.showErrorAlert('Unauthorized Request!');
      this.router.navigate(['/login']);
    } else if (err.status === 500) {
      this.showErrorAlert('Somethimg Went Wrong..');
    }
  }

  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
   async showErrorAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getString(str) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  isJsonValid(str) {
    try {
      JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }
}
