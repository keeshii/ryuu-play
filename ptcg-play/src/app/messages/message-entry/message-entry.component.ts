import { Component, OnInit, Input } from '@angular/core';
import { MessageInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-message-entry',
  templateUrl: './message-entry.component.html',
  styleUrls: ['./message-entry.component.scss']
})
export class MessageEntryComponent implements OnInit {

  @Input() message: MessageInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
