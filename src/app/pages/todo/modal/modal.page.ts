import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
//import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage {

  message: any = '';
  isSending: any = false;

  constructor(
    private api: ApiService,
    private util: UtilService,
    private modal: ModalController
  ) { }

  cancel() {
    this.modal.dismiss({ action: 'dismiss' });
  }

  confirm() {
    if(this.isSending) {
      return;
    }
    this.isSending = true;

    this.api.posts('organize/todo/add', {
      title: this.message
    }).then((response: any) => {

      if(response.success) {
        this.modal.dismiss({ action: 'closed' });
      } else {
        this.util.modalAlert(
          'Something went wrong', '',
          'The server did not respond accordingly.'
        );
      }
    }).catch(error => {
      this.util.modalAlert('Error', 'Something went wrong!');
      console.log('error', error);
    }).finally(() => {
      this.isSending = false;
    });
  }

}
