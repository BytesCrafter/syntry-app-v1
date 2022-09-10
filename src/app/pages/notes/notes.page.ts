import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  notes: any = [
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

  onAdd() {

  }
}
