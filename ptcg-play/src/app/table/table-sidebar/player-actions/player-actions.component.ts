import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ptcg-player-actions',
  templateUrl: './player-actions.component.html',
  styleUrls: ['./player-actions.component.scss']
})
export class PlayerActionsComponent implements OnInit {

  @Output() join = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
