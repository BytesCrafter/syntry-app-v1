import { Component, OnInit } from '@angular/core';
import { IonCheckbox, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalPage } from './modal/modal.page';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  curTab: any = 'todo';

  isLoading: any = true;
  pending: any = [];

  isLoading2: any = true;
  completed: any = [];

  constructor(
    private api: ApiService,
    private util: UtilService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.getLatestPending();
    this.getLatestCompleted();
  }

  getLatestPending() {
    this.isLoading = true;

    this.api.posts('organize/todo/list', {
      status: 'to_do'
    }).then((response: any) => {

      if(response.success) {

        this.pending = [];
        const tasks: any[] = response.data;
        tasks.forEach(task => {
          this.pending.push(
            {
              id: task.id,
              title: task.title,
              start: task.start_date,
              done: (task.status === 'done'? true:false),
            }
          );
        });

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
      this.isLoading = false;
    });
  }

  onPendingChange(task: any, index: any) {
    task.done = false;
    const curTask = task;

    this.api.posts('organize/todo/complete', {
      id: task.id
    }).then((response: any) => {
      if(response.success) {
        curTask.done = true;
        this.pending.splice(index, 1);
        this.completed.push(curTask);
        this.util.playAudio();
      } else {
        this.util.modalAlert(
          'Something went wrong', '',
          'The server did not respond accordingly.'
        );
        task.done = false;
        this.util.stopAudio();
      }
    }).catch(error => {
      this.util.modalAlert('Error', 'Something went wrong!');
      console.log('error', error);
      task.done = false;
      this.util.stopAudio();
    });
  }

  getLatestCompleted() {
    this.isLoading2 = true;

    this.api.posts('organize/todo/list', {
      status: 'done'
    }).then((response: any) => {

      if(response.success) {

        this.completed = [];
        const tasks: any[] = response.data;
        tasks.forEach(task => {
          this.completed.push(
            {
              id: task.id,
              title: task.title,
              start: task.start_date,
              done: (task.status === 'done'? true:false),
            }
          );
        });

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
      this.isLoading2 = false;
    });
  }

  async onAdd() {
    const modal = await this.modal.create({
      component: ModalPage,
      //cssClass: 'add-todo-modal'
    });
    modal.onDidDismiss().then((data) => {
      if (data !== null) {
        this.getLatestPending();
      }
    });
    return await modal.present();
  }

}
