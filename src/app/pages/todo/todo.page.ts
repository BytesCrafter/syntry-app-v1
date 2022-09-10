import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  tasks: any = [
    // {
    //   title: 'The red brown fox jump over the lazy dog.',
    //   done: false
    // },
    // {
    //   title: 'Mary have a little lamb little lamb.',
    //   done: true
    // }
  ];

  constructor() { }

  ngOnInit() {
  }

  onAdd() {

  }

  taskDone(task: any) {
    if(task.done) {
      return;
    }

    //task.title = '';
  }

}
