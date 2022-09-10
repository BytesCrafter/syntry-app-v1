import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages: any = [
    // {
    //   title: 'The red brown fox jump over the lazy dog.',
    // },
    // {
    //   title: 'Mary have a little lamb little lamb.',
    // }
  ];

  constructor() { }

  ngOnInit() {
  }

}
